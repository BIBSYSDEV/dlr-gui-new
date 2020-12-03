import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldProps, FormikProps, FormikValues } from 'formik';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
  saveField: any;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ formikProps, saveField }) => {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};

export default DescriptionFields;
