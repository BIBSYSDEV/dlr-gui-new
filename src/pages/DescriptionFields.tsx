import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, FormikProps, FormikValues } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import TagsField from './TagsField';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
  saveField: any;
  setAllChangesSaved: (status: boolean) => void;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ formikProps, saveField, setAllChangesSaved }) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
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
                  formikProps.handleBlur(event);
                  !error && saveField(event, formikProps.resetForm, formikProps.values);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
      </StyledSchemaPartColored>
      <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor2}>
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
                  formikProps.handleBlur(event);
                  !error && saveField(event, formikProps.resetForm, formikProps.values);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
      </StyledSchemaPartColored>
      <TagsField setAllChangesSaved={setAllChangesSaved} />
    </>
  );
};

export default DescriptionFields;
