import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Resource } from '../types/resource.types';
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
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { deleteResourceCreator, postResourceCreator, putResourceCreatorFeature } from '../api/resourceApi';
import { AxiosError } from 'axios';
import { ServerError } from '../types/server.types';
import { StatusCode } from '../utils/constants';
import ErrorBanner from '../components/ErrorBanner';

const StyledPaper = styled(Paper)`
  width: 100%;
  padding: 3rem;
`;

const StyledDiv = styled.div`
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.3rem;
`;
const StyledField = styled(Field)`
  display: inline-block;
  margin-left: 2rem;
  margin-right: 2rem;
  padding: 1rem;
`;

const StyledTextField = styled(TextField)`
  width: 44rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const StyledButton = styled(Button)`
  position: relative;
  vertical-align: bottom;
`;

interface CreatorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

interface ResourceWrapper {
  resource: Resource;
}
enum ErrorIndex {
  ADD_CREATOR_ERROR = -2,
  NO_ERRORS = -1,
}

const CreatorFields: FC<CreatorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm } = useFormikContext<ResourceWrapper>();
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [saveStatusCode, setSaveStatusCode] = useState(StatusCode.ACCEPTED);

  const addCreator = async (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    try {
      const postCreatorResponse = await postResourceCreator(values.resource.identifier);
      arrayHelpers.push({
        identifier: postCreatorResponse.data.identifier,
        features: {
          dlr_creator_name: '',
          dlr_creator_identifier: postCreatorResponse.data.identifier,
        },
      });
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (error) {
      if (error.response) {
        const axiosError = error as AxiosError<ServerError>;
        setErrorIndex(ErrorIndex.ADD_CREATOR_ERROR);
        setSaveStatusCode(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
      }
    } finally {
      setAllChangesSaved(true);
    }
  };

  const saveCreatorField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentValues: FormikValues,
    resetForm: any,
    creatorIdentifier: string,
    creatorIndex: number
  ) => {
    setAllChangesSaved(false);
    try {
      const name = '' + event.target.name.split('.').pop();
      if (event.target.value.length > 0) {
        await putResourceCreatorFeature(values.resource.identifier, creatorIdentifier, name, event.target.value);
        setErrorIndex(ErrorIndex.NO_ERRORS);
        setSaveStatusCode(StatusCode.ACCEPTED);
        resetForm({ values: currentValues });
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ServerError>;
      setSaveStatusCode(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const removeCreator = async (
    creatorIdentifier: string,
    arrayHelpers: FieldArrayRenderProps,
    creatorIndex: number
  ) => {
    setAllChangesSaved(false);
    try {
      await deleteResourceCreator(values.resource.identifier, creatorIdentifier);
      arrayHelpers.remove(creatorIndex);
      setSaveStatusCode(StatusCode.ACCEPTED);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (error) {
      const axiosError = error as AxiosError<ServerError>;
      setSaveStatusCode(axiosError.response ? axiosError.response.status : StatusCode.UNAUTHORIZED);
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <>
      <StyledPaper>
        <Typography variant="h1">{t('resource.metadata.creator')}</Typography>
        <FieldArray
          name={'resource.creators'}
          render={(arrayHelpers) => (
            <>
              {values.resource.creators
                ?.sort((element1, element2) => {
                  if (element1.features.dlr_creator_order && element2.features.dlr_creator_order) {
                    return element2.features.dlr_creator_order - element1.features.dlr_creator_order;
                  } else {
                    return 0;
                  }
                })
                .map((creator, index) => {
                  return (
                    <StyledDiv key={creator.identifier}>
                      <StyledField name={`resource.creators[${index}].features.dlr_creator_name`}>
                        {({ field, meta: { touched, error } }: FieldProps) => (
                          <StyledTextField
                            {...field}
                            variant="filled"
                            label={t('common.name')}
                            error={touched && !!error}
                            helperText={<ErrorMessage name={field.name} />}
                            onBlur={(event) => {
                              handleBlur(event);
                              !error && saveCreatorField(event, values, resetForm, creator.identifier, index);
                            }}
                          />
                        )}
                      </StyledField>
                      <StyledButton
                        color="secondary"
                        startIcon={<DeleteIcon fontSize="large" />}
                        size="large"
                        onClick={() => {
                          removeCreator(creator.identifier, arrayHelpers, index);
                        }}>
                        {t('common.remove').toUpperCase()}
                      </StyledButton>
                      {errorIndex === index && <ErrorBanner statusCode={saveStatusCode} />}
                    </StyledDiv>
                  );
                })}
              <StyledButton
                type="button"
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  addCreator(arrayHelpers);
                }}>
                {t('resource.add_creator').toUpperCase()}
              </StyledButton>
              {errorIndex === ErrorIndex.ADD_CREATOR_ERROR && <ErrorBanner statusCode={saveStatusCode} />}
            </>
          )}
        />
      </StyledPaper>
    </>
  );
};

export default CreatorFields;
