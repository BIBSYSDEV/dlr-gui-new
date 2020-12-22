import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPart } from '../components/styled/Wrappers';
import TagsField from './TagsField';
import { postResourceFeature } from '../api/resourceApi';
import { ResourceWrapper } from '../types/resource.types';
import ErrorBanner from '../components/ErrorBanner';
import ResourceTypeField from './ResourceTypeField';
import { resetFormButKeepTouched } from '../utils/formik-helpers';
import { DescriptionFieldNames } from '../utils/FieldNames';

interface DescriptionFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, touched, setTouched } = useFormikContext<ResourceWrapper>();
  const [saveErrorFields, setSaveErrorFields] = useState<string[]>([]);

  const saveField = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    setAllChangesSaved(false);
    try {
      const name = '' + event.target.name.split('.').pop();
      await postResourceFeature(values.resource.identifier, name, event.target.value);
      setAllChangesSaved(true);
      setSaveErrorFields([]);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      //todo: remove from array
    } catch (err) {
      setSaveErrorFields([...saveErrorFields, name]);
    }
  };

  return (
    <>
      <StyledSchemaPart>
        <StyledContentWrapper>
          <Field name={DescriptionFieldNames.TITLE}>
            {({ field, meta: { touched, error } }: FieldProps) => (
              <TextField
                {...field}
                variant="outlined"
                fullWidth
                label={t('resource.metadata.title')}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
                onBlur={(event) => {
                  handleBlur(event);
                  !error && saveField(event, DescriptionFieldNames.TITLE);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(DescriptionFieldNames.TITLE) && <ErrorBanner />}
      </StyledSchemaPart>
      <StyledSchemaPart>
        <StyledContentWrapper>
          <Field name={DescriptionFieldNames.DESCRIPTION}>
            {({ field, meta: { error } }: FieldProps) => (
              <TextField
                {...field}
                variant="outlined"
                fullWidth
                multiline
                rows="4"
                label={t('resource.metadata.description')}
                onBlur={(event) => {
                  handleBlur(event);
                  !error && saveField(event, DescriptionFieldNames.DESCRIPTION);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(DescriptionFieldNames.DESCRIPTION) && <ErrorBanner />}
      </StyledSchemaPart>
      <ResourceTypeField setAllChangesSaved={setAllChangesSaved} />
      <TagsField setAllChangesSaved={setAllChangesSaved} />
    </>
  );
};

export default DescriptionFields;
