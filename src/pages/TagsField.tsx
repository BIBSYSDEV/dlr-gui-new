import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { deleteTag, postTag } from '../api/resourceApi';
import ErrorBanner from '../components/ErrorBanner';
import { resetFormButKeepTouched } from '../utils/formik-helpers';

interface ResourceWrapper {
  resource: Resource;
}

interface TagsFieldProps {
  setAllChangesSaved: (status: boolean) => void;
}

const TagsField: FC<TagsFieldProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, resetForm, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [saveError, setSaveError] = useState(false);

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
      setSaveError(false);
      setFieldValue('resource.tags', value);
      values.resource.tags = value;
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (saveTagsError) {
      setSaveError(true);
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
                  variant="outlined"
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
        {saveError && <ErrorBanner />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default TagsField;
