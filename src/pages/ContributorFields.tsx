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
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { AxiosError } from 'axios';
import ErrorBanner from '../components/ErrorBanner';
import { ServerError } from '../types/server.types';
import { StatusCode } from '../utils/constants';

const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
  flex-grow: 1;
  min-width: 10rem;
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
      setDeleteStatus(StatusCode.ACCEPTED);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (addContributorError) {
      if (addContributorError && addContributorError.response) {
        const axiosError = addContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
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
      setDeleteStatus(StatusCode.ACCEPTED);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      resetForm({ values: currentValues });
    } catch (saveContributorError: any) {
      if (saveContributorError && saveContributorError.response) {
        const axiosError = saveContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
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
      setDeleteStatus(StatusCode.ACCEPTED);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (deleteContributorError: any) {
      if (deleteContributorError && deleteContributorError.response) {
        const axiosError = deleteContributorError as AxiosError<ServerError>;
        setDeleteStatus(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
        setErrorIndex(contributorIndex);
      }
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h4">{t('resource.metadata.contributors')}</Typography>
        <FieldArray
          name={`resource.contributors`}
          render={(arrayHelpers) => (
            <>
              {values.resource.contributors?.map((contributor: Contributor, index: number) => {
                return (
                  <StyledFieldsWrapper key={contributor.identifier}>
                    <Field name={`resource.contributors[${index}].features.dlr_contributor_type`}>
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
                    </Field>
                    <Field name={`resource.contributors[${index}].features.dlr_contributor_name`}>
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
                    </Field>
                    <Button
                      color="secondary"
                      startIcon={<DeleteIcon fontSize="large" />}
                      size="large"
                      onClick={() => {
                        removeContributor(contributor.features.dlr_contributor_identifier, arrayHelpers, index);
                      }}>
                      {t('common.remove').toUpperCase()}
                    </Button>
                    {deleteStatus !== StatusCode.ACCEPTED && errorIndex === index && (
                      <ErrorBanner statusCode={deleteStatus} />
                    )}
                  </StyledFieldsWrapper>
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
                {t('resource.add_contributor').toUpperCase()}
              </Button>
              {deleteStatus !== StatusCode.ACCEPTED && errorIndex === ErrorIndex.ADD_CONTRIBUTOR_ERROR && (
                <ErrorBanner statusCode={deleteStatus} />
              )}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContributorFields;
