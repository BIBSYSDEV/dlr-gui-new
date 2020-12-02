import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldProps, FormikProps, FormikValues } from 'formik';
import Button from '@material-ui/core/Button';
import { createContributor } from '../api/resourceApi';
import Card from '../components/Card';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const StyledPaper = styled(Paper)`
  width: 100%;
  padding: 3rem;
`;

const StyledField = styled(Field)`
  display: inline-block;
  margin-left: 2rem;
  margin-right: 2rem;
  padding: 1rem;
`;
const StyledCard = styled(Card)`
  display: inline-block;
  margin-top: 1rem;
  margin-bottom: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  width: 22rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const StyledButton = styled(Button)`
  position: relative;
  vertical-align: bottom;
`;

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
      resource.contributors
        ? resource.contributors.push(contributorResponse.data)
        : (resource.contributors = [contributorResponse.data]);
      // Hacky way to force ContributorFields to update:
      setReloadState(!reloadState);
    });
  };

  const deleteContributor = (identifier: string) => {
    //TODO: implement deletion
  };

  return (
    <StyledPaper>
      <Typography variant="h1">{t('resource.metadata.contributors')}</Typography>
      <FieldArray
        name={`resource.contributors`}
        render={(arrayHelpers) => (
          <>
            {resource.contributors?.map((contributor, index) => {
              return (
                <StyledCard key={contributor.features.dlr_contributor_identifier}>
                  <StyledField name={`resource.contributors[${index}].features.dlr_contributor_type`}>
                    {({ field, meta: { touched, error } }: FieldProps) => (
                      <StyledTextField
                        {...field}
                        variant="filled"
                        label={t('type')}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        onBlur={(event) => {
                          formikProps.handleBlur(event);
                          !error && saveField(event, formikProps.resetForm, formikProps.values);
                        }}
                      />
                    )}
                  </StyledField>
                  <StyledField name={`resource.contributors[${index}].features.dlr_contributor_name`}>
                    {({ field, meta: { touched, error } }: FieldProps) => (
                      <StyledTextField
                        {...field}
                        variant="filled"
                        label={t('name')}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        onBlur={(event) => {
                          formikProps.handleBlur(event);
                          !error && saveField(event, formikProps.resetForm, formikProps.values);
                        }}
                      />
                    )}
                  </StyledField>

                  <StyledButton
                    color="secondary"
                    startIcon={<DeleteIcon fontSize="large" />}
                    size="large"
                    onClick={() => {
                      deleteContributor(contributor.features.dlr_contributor_identifier);
                    }}>
                    {t('common.remove')}
                  </StyledButton>
                </StyledCard>
              );
            })}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                addContributor();
                arrayHelpers.push({ features: { dlr_contributor_name: '', dlr_contributor_type: '' } });
              }}>
              {t('resource.add_contributor')}
            </Button>
          </>
        )}
      />
    </StyledPaper>
  );
};

export default ContributorFields;
