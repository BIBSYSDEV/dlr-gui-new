import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Typography } from '@material-ui/core';
import { CreatorFeatureAttributes, FieldNames, Resource } from '../../../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { deleteResourceCreator, postResourceCreator, putResourceCreatorFeature } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { StyledDeleteButton } from '../../../components/styled/StyledButtons';
import HelperTextPopover from '../../../components/HelperTextPopover';
import AuthoritySelector from './AuthoritySelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';

const StyledSpacer = styled.div`
  margin-bottom: 1rem;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

interface CreatorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

enum ErrorIndex {
  NO_ERRORS = -1,
}

const CreatorFields: FC<CreatorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [updateCreatorError, setUpdateCreatorError] = useState<Error>();
  const [addCreatorError, setAddCreatorError] = useState<Error>();
  const [isDeleting, setIsDeleting] = useState(false);
  const inputElements = useRef<any>({});
  const user = useSelector((state: RootState) => state.user);

  const addCreator = async (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    try {
      const postCreatorResponse = await postResourceCreator(values.identifier);
      arrayHelpers.push({
        identifier: postCreatorResponse.data.identifier,
        features: {
          dlr_creator_name: '',
          dlr_creator_identifier: postCreatorResponse.data.identifier,
        },
      });
    } catch (error) {
      setAddCreatorError(error);
    } finally {
      setAllChangesSaved(true);
      inputElements.current[values.creators.length].focus();
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
        setErrorIndex(ErrorIndex.NO_ERRORS);
        setUpdateCreatorError(undefined);
        await putResourceCreatorFeature(values.identifier, creatorIdentifier, name, event.target.value);
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      }
    } catch (error) {
      setUpdateCreatorError(error);
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
    setIsDeleting(true);
    setAllChangesSaved(false);
    try {
      setUpdateCreatorError(undefined);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      await deleteResourceCreator(values.identifier, creatorIdentifier);
      arrayHelpers.remove(creatorIndex);
    } catch (error) {
      setUpdateCreatorError(error);
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
      setIsDeleting(false);
    }
  };

  const sortCreatorArray = () => {
    return values.creators?.sort((element1, element2) => {
      if (element1.features.dlr_creator_order && element2.features.dlr_creator_order) {
        return element2.features.dlr_creator_order - element1.features.dlr_creator_order;
      } else {
        return 0;
      }
    });
  };

  const calculateNumSMColumns = (index: number) => {
    if (index === 0 && values.creators?.length < 2) {
      return 7;
    } else if (index === 0 && values.creators?.length >= 2) {
      return 5;
    } else {
      return 6;
    }
  };

  const calculateNumXSColumns = (index: number) => {
    return index === 0 ? 9 : 12;
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.creator')}</Typography>
        <FieldArray
          name={FieldNames.CreatorsBase}
          render={(arrayHelpers) => (
            <>
              {sortCreatorArray()?.map((creator, index) => {
                return (
                  <StyledSpacer key={index}>
                    <Grid container alignItems="center" key={index} spacing={2}>
                      <Grid item xs={calculateNumXSColumns(index)} sm={calculateNumSMColumns(index)}>
                        <Field
                          name={`${FieldNames.CreatorsBase}[${index}].${FieldNames.Features}.${CreatorFeatureAttributes.Name}`}>
                          {({ field, meta: { touched, error } }: FieldProps) => (
                            <StyledTextField
                              {...field}
                              id={`creator-name-input-field-${index}`}
                              variant="filled"
                              inputRef={(element) => (inputElements.current[index] = element)}
                              required
                              fullWidth
                              disabled={!!(creator.authorities && creator.authorities.length > 0)}
                              label={t('common.name')}
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                              data-testid={`creator-name-field-${index}`}
                              onBlur={(event) => {
                                handleBlur(event);
                                !error && saveCreatorField(event, creator.identifier, index);
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      {index === 0 && (
                        <Grid item xs={2} sm={1}>
                          <HelperTextPopover
                            ariaButtonLabel={t('explanation_text.creator_helper_aria_label')}
                            popoverId={'creator-helper-popover'}>
                            <StyledTypography variant="body1">
                              {t('explanation_text.creator_helper_text')}.
                            </StyledTypography>
                            <Typography variant="body2">{t('explanation_text.creator_helper_example')}</Typography>
                          </HelperTextPopover>
                        </Grid>
                      )}
                      {!isDeleting && user.institutionAuthorities?.isCurator && (
                        <Grid item xs={6} sm={3}>
                          <AuthoritySelector
                            resourceIdentifier={values.identifier}
                            creatorOrContributorId={creator.identifier}
                            initialNameValue={creator.features.dlr_creator_name ?? ''}
                            onAuthoritySelected={(authorities) => {
                              values.creators[index].authorities = authorities;
                            }}
                          />
                        </Grid>
                      )}
                      {values.creators?.length > 1 && !isDeleting && (
                        <Grid item xs={6} sm={3}>
                          <StyledDeleteButton
                            color="secondary"
                            startIcon={<DeleteIcon fontSize="large" />}
                            size="large"
                            data-testid={`creator-delete-button-${index}`}
                            onClick={() => {
                              removeCreator(creator.identifier, arrayHelpers, index);
                            }}>
                            {t('common.remove').toUpperCase()}
                          </StyledDeleteButton>
                        </Grid>
                      )}

                      {updateCreatorError && errorIndex === index && (
                        <Grid item xs={12}>
                          <ErrorBanner userNeedsToBeLoggedIn={true} error={updateCreatorError} />
                        </Grid>
                      )}
                    </Grid>
                  </StyledSpacer>
                );
              })}
              <Button
                type="button"
                variant="outlined"
                color="primary"
                data-testid="creator-add-button"
                startIcon={<AddIcon />}
                onClick={() => {
                  addCreator(arrayHelpers);
                }}>
                {t('resource.add_creator').toUpperCase()}
              </Button>
              {addCreatorError && <ErrorBanner userNeedsToBeLoggedIn={true} error={addCreatorError} />}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default CreatorFields;
