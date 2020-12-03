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

const StyledErrorDiv = styled.div`
  padding: 0.5rem;
  background-color: #ffe8e8;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

interface ContributorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}
interface ResourceWrapper {
  resource: Resource;
}

interface ServerError {
  response: {
    status: number;
    data: any;
    message: string;
  };
}

const ContributorFields: FC<ContributorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm } = useFormikContext<ResourceWrapper>();
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(202);
  const [errorIndex, setErrorIndex] = useState(-1);

  const addContributor = (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    createContributor(values.resource.identifier).then((contributorResponse) => {
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

  const CustomErrorMessage = (status: number) => {
    let message = '';
    switch (status) {
      case 401:
        message = t('error.401_page');
        break;
      default:
        t('error.500_page');
        break;
    }
    return (
      <StyledErrorDiv>
        <Typography>{message}</Typography>
      </StyledErrorDiv>
    );
  };

  const saveContributorField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resetForm: any,
    currentValues: FormikValues,
    contributorIdentifier: string
  ) => {
    setAllChangesSaved(false);
    const name = '' + event.target.name.split('.').pop();
    if (event.target.value.length > 0) {
      await putContributorFeature(values.resource.identifier, contributorIdentifier, name, event.target.value);
    }
    setAllChangesSaved(true);
    resetForm({ values: currentValues });
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
    } catch (deleteContributorError: any) {
      if (deleteContributorError && deleteContributorError.response) {
        const axiosError = deleteContributorError as AxiosError<ServerError>;
        setDeleteErrorMessage(axiosError.response ? axiosError.response.status : 401);
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
                          !error && saveContributorField(event, resetForm, values, contributor.identifier);
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
                          !error && saveContributorField(event, resetForm, values, contributor.identifier);
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
                  {deleteErrorMessage !== 202 && errorIndex === index && CustomErrorMessage(deleteErrorMessage)}
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
