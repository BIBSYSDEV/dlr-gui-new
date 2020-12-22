import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { deleteResourceCreator, postResourceCreator, putResourceCreatorFeature } from '../api/resourceApi';
import ErrorBanner from '../components/ErrorBanner';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { resetFormButKeepTouched } from '../utils/formik-helpers';

const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StyledTextField = styled(TextField)`
  width: 52rem;
  max-width: 80%
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

interface CreatorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

interface ResourceWrapper {
  resource: Resource;
}
enum ErrorIndex {
  NO_ERRORS = -1,
}

const CreatorFields: FC<CreatorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [updateCreatorError, setUpdateCreatorError] = useState(false);
  const [addCreatorError, setAddCreatorError] = useState(false);

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
    } catch (error) {
      setAddCreatorError(true);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const saveCreatorField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    creatorIdentifier: string,
    creatorIndex: number
  ) => {
    setAllChangesSaved(false);
    try {
      const name = '' + event.target.name.split('.').pop();
      if (event.target.value.length > 0) {
        await putResourceCreatorFeature(values.resource.identifier, creatorIdentifier, name, event.target.value);
        setErrorIndex(ErrorIndex.NO_ERRORS);
        setUpdateCreatorError(false);
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      }
    } catch (error) {
      setUpdateCreatorError(true);
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
      setUpdateCreatorError(false);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (error) {
      setUpdateCreatorError(true);
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const sortCreatorArray = () => {
    return values.resource.creators?.sort((element1, element2) => {
      if (element1.features.dlr_creator_order && element2.features.dlr_creator_order) {
        return element2.features.dlr_creator_order - element1.features.dlr_creator_order;
      } else {
        return 0;
      }
    });
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h4">{t('resource.metadata.creator')}</Typography>
        <FieldArray
          name={'resource.creators'}
          render={(arrayHelpers) => (
            <>
              {sortCreatorArray()?.map((creator, index) => {
                return (
                  <StyledFieldsWrapper key={creator.identifier}>
                    <Field name={`resource.creators[${index}].features.dlr_creator_name`}>
                      {({ field, meta: { touched, error } }: FieldProps) => (
                        <StyledTextField
                          {...field}
                          variant="outlined"
                          label={t('common.name')}
                          error={touched && !!error}
                          helperText={<ErrorMessage name={field.name} />}
                          onBlur={(event) => {
                            handleBlur(event);
                            !error && saveCreatorField(event, creator.identifier, index);
                          }}
                        />
                      )}
                    </Field>
                    <Button
                      color="secondary"
                      startIcon={<DeleteIcon fontSize="large" />}
                      size="large"
                      onClick={() => {
                        removeCreator(creator.identifier, arrayHelpers, index);
                      }}>
                      {t('common.remove').toUpperCase()}
                    </Button>
                    {updateCreatorError && errorIndex === index && <ErrorBanner />}
                  </StyledFieldsWrapper>
                );
              })}
              <Button
                type="button"
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  addCreator(arrayHelpers);
                }}>
                {t('resource.add_creator').toUpperCase()}
              </Button>
              {addCreatorError && <ErrorBanner />}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default CreatorFields;
