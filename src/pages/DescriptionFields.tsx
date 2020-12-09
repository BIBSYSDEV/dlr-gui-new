import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, FormikProps, FormikValues } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
  saveField: any;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ formikProps, saveField }) => {
  const { t } = useTranslation();

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
                  formikProps.handleBlur(event);
                  !error && saveField(event, formikProps.resetForm, formikProps.values);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
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
                  formikProps.handleBlur(event);
                  !error && saveField(event, formikProps.resetForm, formikProps.values);
                }}
              />
            )}
          </Field>
        </StyledContentWrapper>
      </StyledSchemaPartColored>
    </>
  );
};

export default DescriptionFields;
