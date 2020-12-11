import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import TagsField from './TagsField';
import { postResourceFeature } from '../api/resourceApi';
import { ResourceWrapper } from '../types/resource.types';
import ErrorBanner from '../components/ErrorBanner';
import ResourceTypeField from './ResourceTypeField';

interface DescriptionFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

enum descriptionFieldNames {
  TITLE = 'dlr_title',
  DESCRIPTION = 'dlr_description',
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm } = useFormikContext<ResourceWrapper>();
  const [saveErrorFields, setSaveErrorFields] = useState<string[]>([]);

  const saveField = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    setAllChangesSaved(false);
    try {
      await postResourceFeature(values.resource.identifier, name, event.target.value);
      setAllChangesSaved(true);
      setSaveErrorFields([]);
      resetForm({ values: values });
      //todo: remove from array
    } catch (err) {
      setSaveErrorFields([...saveErrorFields, name]);
    }
  };

  return (
    <>
      <StyledSchemaPartColored color={Colors.Background}>
        <StyledContentWrapper>
          <Field name="resource.features.dlr_title">
            {({ field, meta: { touched, error } }: FieldProps) => (
              <TextField
                {...field}
                variant="filled"
                fullWidth
                label={t('resource.metadata.title')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
                onBlur={(event) => {
                  handleBlur(event);
                  !error && saveField(event, descriptionFieldNames.TITLE);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(descriptionFieldNames.TITLE) && <ErrorBanner />}
      </StyledSchemaPartColored>
      <StyledSchemaPartColored color={Colors.Background}>
        <StyledContentWrapper>
          <Field name="resource.features.dlr_description">
            {({ field, meta: { error } }: FieldProps) => (
              <TextField
                {...field}
                variant="filled"
                fullWidth
                multiline
                rows="4"
                label={t('resource.metadata.description')}
                onBlur={(event) => {
                  handleBlur(event);
                  !error && saveField(event, descriptionFieldNames.DESCRIPTION);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(descriptionFieldNames.DESCRIPTION) && <ErrorBanner />}
      </StyledSchemaPartColored>
      <ResourceTypeField setAllChangesSaved={setAllChangesSaved} />
      <TagsField setAllChangesSaved={setAllChangesSaved} />
    </>
  );
};

export default DescriptionFields;
