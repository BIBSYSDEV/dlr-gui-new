import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Contributor, Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldProps, FormikProps, FormikValues } from 'formik';
import Button from '@material-ui/core/Button';

interface ContributorFieldsProps {
  contributors: Contributor[];
  formikProps: FormikProps<FormikValues>;
  addContributor: any;
  saveField: any;
}

const ContributorFields: FC<ContributorFieldsProps> = ({ addContributor, contributors, formikProps, saveField }) => {
  const { t } = useTranslation();

  return (
    <>
      {contributors.map((contributor, index) => {
        return (
          <div key={contributor.features.dlr_contributor_identifier}>
            <Field name={`contributors[${index}].features.dlr_contributor_name`}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label="contributor name"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  onBlur={(event) => {
                    formikProps.handleBlur(event);
                    !error && saveField(event, formikProps.resetForm, formikProps.values);
                  }}
                />
              )}
            </Field>
            <Field name={`contributors[${index}].features.dlr_contributor_type`}>
              {({ field, meta: { touched, error } }: FieldProps) => (
                <TextField
                  {...field}
                  variant="filled"
                  fullWidth
                  label="contributor type"
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  onBlur={(event) => {
                    formikProps.handleBlur(event);
                    !error && saveField(event, formikProps.resetForm, formikProps.values);
                  }}
                />
              )}
            </Field>
          </div>
        );
      })}
      {contributors.map((contributor) => {
        return (
          <div key={contributor.features.dlr_contributor_identifier}>
            <h3> Contributor</h3>
            <p>Name: {contributor.features.dlr_contributor_name}</p>
            <p>Type: {contributor.features.dlr_contributor_type}</p>
            <p>Time created: {contributor.features.dlr_contributor_time_created}</p>
          </div>
        );
      })}
      <Button onClick={addContributor}>Legg til felt</Button>
    </>
  );
};

export default ContributorFields;
