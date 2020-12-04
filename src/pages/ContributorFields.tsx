import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Contributor, Resource } from '../types/resource.types';
import {
  ErrorMessage,
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  FormikValues,
  useFormikContext,
} from 'formik';
import Button from '@material-ui/core/Button';
import { createContributor, deleteContributor, putContributorFeature } from '../api/resourceApi';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { AxiosError } from 'axios';
import ErrorBanner from '../components/ErrorBanner';
import { ServerError } from '../types/server.types';
import { StatusCode } from '../utils/constants';

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
  setAllChangesSaved: (value: boolean) => void;
}
interface ResourceWrapper {
  resource: Resource;
}

enum ErrorIndex {
  ADD_CONTRIBUTOR_ERROR = -2,
  NO_ERRORS = -1,
}

const ContributorFields: FC<ContributorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm } = useFormikContext<ResourceWrapper>();
  const [deleteStatus, setDeleteStatus] = useState(StatusCode.ACCEPTED);
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);

  const addContributor = async (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    try {
      const contributorResponse = await createContributor(values.resource.identifier);
      arrayHelpers.push({
        identifier: contributorResponse.data.identifier,
        features: {
          dlr_contributor_name: '',
          dlr_contributor_type: '',
          dlr_contributor_identifier: contributorResponse.data.identifier,
        },
      });
      setDeleteStatus(202);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (addContributorError) {
      if (addContributorError && addContributorError.response) {
        const axiosError = addContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : 401);
        setErrorIndex(ErrorIndex.ADD_CONTRIBUTOR_ERROR);
      }
    } finally {
      setAllChangesSaved(true);
    }
  };

  const saveContributorField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resetForm: any,
    currentValues: FormikValues,
    contributorIdentifier: string,
    contributorIndex: number
  ) => {
    try {
      setAllChangesSaved(false);
      const name = '' + event.target.name.split('.').pop();
      if (event.target.value.length > 0) {
        await putContributorFeature(values.resource.identifier, contributorIdentifier, name, event.target.value);
      }
      setDeleteStatus(202);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      resetForm({ values: currentValues });
    } catch (saveContributorError: any) {
      if (saveContributorError && saveContributorError.response) {
        const axiosError = saveContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : 401);
        setErrorIndex(contributorIndex);
      }
    } finally {
      setAllChangesSaved(true);
    }
  };

  const removeContributor = async (
    contributorIdentifier: string,
    arrayHelpers: FieldArrayRenderProps,
    contributorIndex: number
  ) => {
    try {
      setAllChangesSaved(false);
      await deleteContributor(values.resource.identifier, contributorIdentifier);
      arrayHelpers.remove(contributorIndex);
      setDeleteStatus(202);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (deleteContributorError: any) {
      if (deleteContributorError && deleteContributorError.response) {
        const axiosError = deleteContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : 401);
        setErrorIndex(contributorIndex);
      }
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h1">{t('resource.metadata.contributors')}</Typography>
      <FieldArray
        name={`resource.contributors`}
        render={(arrayHelpers) => (
          <>
            {values.resource.contributors?.map((contributor: Contributor, index: number) => {
              return (
                <StyledDiv key={contributor.identifier}>
                  <StyledField name={`resource.contributors[${index}].features.dlr_contributor_type`}>
                    {({ field, meta: { touched, error } }: FieldProps<string>) => (
                      <StyledTextField
                        {...field}
                        variant="filled"
                        label={t('type')}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        onBlur={(event) => {
                          handleBlur(event);
                          !error && saveContributorField(event, resetForm, values, contributor.identifier, index);
                        }}
                      />
                    )}
                  </StyledField>
                  <StyledField name={`resource.contributors[${index}].features.dlr_contributor_name`}>
                    {({ field, meta: { touched, error } }: FieldProps<string>) => (
                      <StyledTextField
                        {...field}
                        variant="filled"
                        label={t('name')}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        onBlur={(event) => {
                          handleBlur(event);
                          !error && saveContributorField(event, resetForm, values, contributor.identifier, index);
                        }}
                      />
                    )}
                  </StyledField>
                  <StyledButton
                    color="secondary"
                    startIcon={<DeleteIcon fontSize="large" />}
                    size="large"
                    onClick={() => {
                      removeContributor(contributor.features.dlr_contributor_identifier, arrayHelpers, index);
                    }}>
                    {t('common.remove')}
                  </StyledButton>
                  {deleteStatus !== 202 && errorIndex === index && <ErrorBanner statusCode={deleteStatus} />}
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
            {deleteStatus !== 202 && errorIndex === ErrorIndex.ADD_CONTRIBUTOR_ERROR && (
              <ErrorBanner statusCode={deleteStatus} />
            )}
          </>
        )}
      />
    </StyledPaper>
  );
};

export default ContributorFields;
