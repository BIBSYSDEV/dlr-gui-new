import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Contributor, Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, FormikProps, FormikValues } from 'formik';
import Button from '@material-ui/core/Button';
import { createContributor, putContributorFeature } from '../api/resourceApi';
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
const StyledDiv = styled.div`
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
  setAllChangesSaved: any;
}

const ContributorFields: FC<ContributorFieldsProps> = ({ resource, formikProps, setAllChangesSaved }) => {
  const { t } = useTranslation();

  const addContributor = (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    createContributor(resource.identifier).then((contributorResponse) => {
      arrayHelpers.push({
        identifier: contributorResponse.data.identifier,
        features: {
          dlr_contributor_name: '',
          dlr_contributor_type: '',
          dlr_contributor_identifier: contributorResponse.data.identifier,
        },
      });
      setAllChangesSaved(true);
    });
  };

  const saveContributorField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resetForm: any,
    currentValues: FormikValues,
    index: number
  ) => {
    setAllChangesSaved(false);
    const name = '' + event.target.name.split('.').pop();
    if (event.target.value.length > 0) {
      const contributorIdentifier = formikProps.values.resource?.contributors[index]?.identifier;
      if (contributorIdentifier) {
        await putContributorFeature(resource.identifier, contributorIdentifier, name, event.target.value);
      }
    }
    setAllChangesSaved(true);
    resetForm({ values: currentValues });
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
            {formikProps.values.resource.contributors?.map((contributor: Contributor, index: number) => {
              return (
                <StyledDiv key={contributor.identifier}>
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
                          !error && saveContributorField(event, formikProps.resetForm, formikProps.values, index);
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
                          !error && saveContributorField(event, formikProps.resetForm, formikProps.values, index);
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
                </StyledDiv>
              );
            })}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                addContributor(arrayHelpers);
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
