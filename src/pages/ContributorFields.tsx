import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import { Contributor, Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldProps, FormikProps, FormikValues } from 'formik';
import Button from '@material-ui/core/Button';
import { createContributor } from '../api/resourceApi';

interface ContributorFieldsProps {
  resource: Resource;
  formikProps: FormikProps<FormikValues>;
  saveField: any;
}

const ContributorFields: FC<ContributorFieldsProps> = ({ resource, formikProps, saveField }) => {
  const { t } = useTranslation();
  const [reloadState, setReloadState] = useState(false);

  const addContributor = () => {
    createContributor(resource.identifier).then((contributorResponse) => {
      const newContributors: Contributor[] = [];
      if (resource.contributors) {
        newContributors.push(...resource.contributors);
      }
      newContributors.push(contributorResponse.data);
      const resourceTemp = resource;
      resourceTemp.contributors = newContributors;
      // Hacky way to force ContributorFields to update:
      setReloadState(!reloadState);
    });
  };

  const deleteContributor = (identifier: string) => {
    console.log('deleting this', identifier);
  };

  return (
    <>
      <FieldArray
        name={`resource.contributors`}
        render={(arrayHelpers) => (
          <>
            {resource.contributors?.map((contributor, index) => {
              return (
                <div key={contributor.features.dlr_contributor_identifier}>
                  <Field name={`resource.contributors[${index}].features.dlr_contributor_name`}>
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
                  <Field name={`resource.contributors[${index}].features.dlr_contributor_type`}>
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
                  {index > 0 && (
                    <Button
                      onClick={() => {
                        deleteContributor(contributor.features.dlr_contributor_identifier);
                      }}>
                      Delete
                    </Button>
                  )}
                </div>
              );
            })}
            <Button
              type="button"
              onClick={() => {
                addContributor();
                arrayHelpers.push({ features: { dlr_contributor_name: '', dlr_contributor_type: '' } });
              }}>
              Legg til felt
            </Button>
          </>
        )}
      />

      {resource.contributors?.map((contributor) => {
        return (
          <div key={contributor.features.dlr_contributor_identifier}>
            <h3> Contributor</h3>
            <p>Name: {contributor.features.dlr_contributor_name}</p>
            <p>Type: {contributor.features.dlr_contributor_type}</p>
            <p>Time created: {contributor.features.dlr_contributor_time_created}</p>
          </div>
        );
      })}
    </>
  );
};

export default ContributorFields;
