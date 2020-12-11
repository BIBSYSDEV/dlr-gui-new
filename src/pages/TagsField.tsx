import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { deleteTag, postTag } from '../api/resourceApi';
import { AxiosError } from 'axios';
import { ServerError } from '../types/server.types';
import { StatusCode } from '../utils/constants';
import ErrorBanner from '../components/ErrorBanner';

interface ResourceWrapper {
  resource: Resource;
}

interface TagsFieldProps {
  setAllChangesSaved: (status: boolean) => void;
}

const TagsField: FC<TagsFieldProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, resetForm } = useFormikContext<ResourceWrapper>();
  const [saveTagStatus, setSaveTagsStatus] = useState(StatusCode.ACCEPTED);

  const saveTagsChanging = async (name: string, value: string[]) => {
    setAllChangesSaved(false);

    try {
      const promiseArray: Promise<any>[] = [];
      const newTags = value.filter((tag) => !values.resource.tags?.includes(tag));
      newTags.forEach((tag) => {
        promiseArray.push(postTag(values.resource.identifier, tag));
      });
      const removeTags = values.resource.tags?.filter((tag) => !value.includes(tag));
      removeTags?.forEach((tag) => {
        promiseArray.push(deleteTag(values.resource.identifier, tag));
      });
      //Must wait for all the promises to finish or we will get race conditions for updating setAllChangesSaved.
      await Promise.all(promiseArray);
      setSaveTagsStatus(StatusCode.ACCEPTED);
      setFieldValue('resource.tags', value);
      values.resource.tags = value;
      resetForm({ values });
    } catch (saveTagsError) {
      const axiosError = saveTagsError as AxiosError<ServerError>;
      setSaveTagsStatus(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor3}>
      <StyledContentWrapper>
        <Field name={'resource.tags'}>
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              freeSolo
              multiple
              options={[]}
              onChange={(_: ChangeEvent<unknown>, value: string[]) => {
                saveTagsChanging(field.name, value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('resource.metadata.tags')}
                  helperText={t('resource.add_tags')}
                  variant="filled"
                  fullWidth
                  onBlur={(event) => {
                    const value = event.target.value;
                    const tags = value
                      .split(/[|,;]+/)
                      .map((value: string) => value.trim())
                      .filter((tag) => tag !== '');
                    saveTagsChanging(field.name, [...field.value, ...tags]);
                  }}
                />
              )}
            />
          )}
        </Field>
        {saveTagStatus !== StatusCode.ACCEPTED && <ErrorBanner statusCode={saveTagStatus} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default TagsField;
