import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, useMediaQuery } from '@mui/material';
import {
  CompareCreators,
  Creator,
  CreatorFeatureAttributes,
  FieldNames,
  Resource,
} from '../../../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  deleteResourceCreator,
  postResourceCreator,
  putResourceCreatorFeature,
  updateSearchIndex,
} from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors, DeviceWidths } from '../../../themes/mainTheme';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { StyledDeleteButton } from '../../../components/styled/StyledButtons';
import HelperTextPopover from '../../../components/HelperTextPopover';
import AuthoritySelector from './AuthoritySelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import AuthorityLink from '../../../components/AuthorityLink';
import { Authority } from '../../../types/authority.types';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StyledTypography = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-right: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 0.5rem;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HelperTextWrapper = styled.div`
  padding-left: 1rem;
`;

const CreatorRowWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
  }
`;

const StyledButtonRowWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 0.5rem;
  }
  margin-top: 1rem;
  display: flex;
  flex-grow: 1;
  align-items: center;
  align-self: start;
`;

const StyledButtonWrapper = styled.div`
  min-width: 8rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 1 + 'px'}) {
    margin-left: 1rem;
  }
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
  const [updateCreatorError, setUpdateCreatorError] = useState<Error | AxiosError>();
  const [addCreatorError, setAddCreatorError] = useState<Error | AxiosError>();
  const [isDeleting, setIsDeleting] = useState(false);
  const inputElements = useRef<any>({});
  const user = useSelector((state: RootState) => state.user);
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

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
      setAddCreatorError(handlePotentialAxiosError(error));
    } finally {
      setAllChangesSaved(true);
      inputElements.current[values.creators.length].focus();
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
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
      const eventTargetValueFirstLetterUpperCase =
        event.target.value.slice(0, 1).toUpperCase() + event.target.value.slice(1);
      if (event.target.value !== eventTargetValueFirstLetterUpperCase) {
        values.creators[creatorIndex].features.dlr_creator_name = eventTargetValueFirstLetterUpperCase;
      }
      if (eventTargetValueFirstLetterUpperCase.length > 0) {
        setErrorIndex(ErrorIndex.NO_ERRORS);
        setUpdateCreatorError(undefined);
        await putResourceCreatorFeature(
          values.identifier,
          creatorIdentifier,
          name,
          eventTargetValueFirstLetterUpperCase
        );
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      }
    } catch (error) {
      setUpdateCreatorError(handlePotentialAxiosError(error));
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
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
      setUpdateCreatorError(handlePotentialAxiosError(error));
      setErrorIndex(creatorIndex);
    } finally {
      setAllChangesSaved(true);
      setIsDeleting(false);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  const sortCreatorArray = () => {
    return values.creators?.sort((element1, element2) => CompareCreators(element1, element2));
  };

  const onAuthoritySelected = (authorities: Authority[], index: number, creator: Creator) => {
    try {
      values.creators[index].authorities = authorities;
      if (values.creators[index].features.dlr_creator_name !== authorities[0].name) {
        setUpdateCreatorError(undefined);
        setErrorIndex(ErrorIndex.NO_ERRORS);
        setAllChangesSaved(false);
        values.creators[index].features.dlr_creator_name = authorities[0].name;
        putResourceCreatorFeature(
          values.identifier,
          creator.identifier,
          CreatorFeatureAttributes.Name,
          authorities[0].name
        );
      }
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setUpdateCreatorError(handlePotentialAxiosError(error));
      setErrorIndex(index);
    } finally {
      setAllChangesSaved(true);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.DLRBlue1}>
      <StyledContentWrapper>
        <HeaderWrapper>
          <Typography variant="h3" component={mediumOrLargerScreen ? 'h2' : 'h3'}>
            {t('resource.metadata.creator')}
          </Typography>
          <HelperTextWrapper>
            <HelperTextPopover
              ariaButtonLabel={t('explanation_text.creator_helper_aria_label')}
              popoverId={'creator-helper-popover'}>
              <StyledTypography variant="body1">{t('explanation_text.creator_helper_text1')}</StyledTypography>
              <StyledTypography variant="body1">{t('explanation_text.authority_prevents_editing')}</StyledTypography>
              {user.institutionAuthorities?.isCurator && (
                <StyledTypography variant="body1">{t('explanation_text.creator_helper_text2')}</StyledTypography>
              )}
              <Typography variant="body2">{t('explanation_text.creator_helper_example')}</Typography>
            </HelperTextPopover>
          </HelperTextWrapper>
        </HeaderWrapper>
        <FieldArray
          name={FieldNames.CreatorsBase}
          render={(arrayHelpers) => (
            <>
              {sortCreatorArray()?.map((creator, index) => {
                return (
                  <CreatorRowWrapper key={index} id="creator-row-wrapper">
                    <Field
                      name={`${FieldNames.CreatorsBase}[${index}].${FieldNames.Features}.${CreatorFeatureAttributes.Name}`}>
                      {({ field, meta: { touched, error } }: FieldProps) => (
                        <StyledTextField
                          {...field}
                          id={`creator-name-input-field-${index}`}
                          variant="filled"
                          inputRef={(element) => (inputElements.current[index] = element)}
                          required
                          multiline
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
                    <StyledButtonRowWrapper>
                      {creator.authorities && creator.authorities?.length > 0 && (
                        <StyledButtonWrapper>
                          <AuthorityLink authority={creator.authorities[0]} />
                        </StyledButtonWrapper>
                      )}
                      {!isDeleting && user.institutionAuthorities?.isCurator && (
                        <StyledButtonWrapper>
                          {(!creator.authorities || creator.authorities.length === 0) && (
                            <AuthoritySelector
                              resourceIdentifier={values.identifier}
                              creatorOrContributorId={creator.identifier}
                              initialNameValue={creator.features.dlr_creator_name ?? ''}
                              onAuthoritySelected={(authorities) => onAuthoritySelected(authorities, index, creator)}
                            />
                          )}
                        </StyledButtonWrapper>
                      )}
                      {values.creators?.length > 1 && !isDeleting && (
                        <StyledButtonWrapper>
                          <StyledDeleteButton
                            color="secondary"
                            variant="outlined"
                            startIcon={<DeleteIcon fontSize="large" />}
                            size="large"
                            data-testid={`creator-delete-button-${index}`}
                            onClick={() => {
                              removeCreator(creator.identifier, arrayHelpers, index);
                            }}>
                            {t('common.remove')}
                          </StyledDeleteButton>
                        </StyledButtonWrapper>
                      )}
                    </StyledButtonRowWrapper>
                    {updateCreatorError && errorIndex === index && (
                      <ErrorBanner userNeedsToBeLoggedIn={true} error={updateCreatorError} />
                    )}
                  </CreatorRowWrapper>
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
                {t('resource.add_creator')}
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
