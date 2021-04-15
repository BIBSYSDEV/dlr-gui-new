import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import { Creator, CreatorFeatureAttributes, FieldNames, Resource } from '../../../types/resource.types';
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
import AuthorityLink from '../../../components/AuthorityLink';
import { Authority } from '../../../types/authority.types';

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
  min-width: 6.3rem;
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
      setUpdateCreatorError(error);
      setErrorIndex(index);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor1}>
      <StyledContentWrapper>
        <HeaderWrapper>
          <Typography variant="h3">{t('resource.metadata.creator')}</Typography>
          <HelperTextWrapper>
            <HelperTextPopover
              ariaButtonLabel={t('explanation_text.creator_helper_aria_label')}
              popoverId={'creator-helper-popover'}>
              <StyledTypography variant="body1">{t('explanation_text.creator_helper_text1')}.</StyledTypography>
              {user.institutionAuthorities?.isCurator && (
                <StyledTypography variant="body1">{t('explanation_text.creator_helper_text2')}.</StyledTypography>
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
                      {!isDeleting && user.institutionAuthorities?.isCurator && (
                        <StyledButtonWrapper>
                          {!creator.authorities || creator.authorities.length === 0 ? (
                            <AuthoritySelector
                              resourceIdentifier={values.identifier}
                              creatorOrContributorId={creator.identifier}
                              initialNameValue={creator.features.dlr_creator_name ?? ''}
                              onAuthoritySelected={(authorities) => onAuthoritySelected(authorities, index, creator)}
                            />
                          ) : (
                            <AuthorityLink authority={creator.authorities[0]} />
                          )}
                        </StyledButtonWrapper>
                      )}
                      {values.creators?.length > 1 && !isDeleting && (
                        <StyledButtonWrapper>
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
