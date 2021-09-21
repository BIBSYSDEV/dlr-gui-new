import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { Contributor, ContributorFeatureNames, FieldNames, Resource } from '../../../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import {
  createContributor,
  deleteContributor,
  putContributorFeature,
  updateSearchIndex,
} from '../../../api/resourceApi';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors, DeviceWidths } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import contributorTypeList from '../../../resources/assets/contributorTypeList.json';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { StyledDeleteButton } from '../../../components/styled/StyledButtons';
import HelperTextPopover from '../../../components/HelperTextPopover';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import AuthoritySelector from './AuthoritySelector';
import AuthorityLink from '../../../components/AuthorityLink';
import { Authority } from '../../../types/authority.types';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StyledTypography = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HelperTextWrapper = styled.div`
  padding-left: 1rem;
`;

const StyledFieldsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
  }
`;

interface Props {
  isCurator: boolean;
}

const StyledTextFieldSizer: any = styled.div<Props>`
  flex-grow: 1;
  width: auto;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 1 + 'px'}) {
    width: ${(props) => (props.isCurator ? '25%' : '14rem')};
    margin-right: 1rem;
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
  min-width: 7rem;
`;

interface ContributorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

enum ErrorIndex {
  NO_ERRORS = -1,
}

interface contributorTypesTranslated {
  key: string;
  description: string;
}

const generateContributorTypesTranslated = (t: any) => {
  const contributorTypesTranslatedTemp: contributorTypesTranslated[] = [];
  contributorTypeList.forEach((contributorType) => {
    contributorTypesTranslatedTemp.push({
      key: contributorType,
      description: t(`resource.contributor_type.${contributorType}`),
    });
  });
  return contributorTypesTranslatedTemp.sort((contributorType1, contributorType2) =>
    contributorType1.description.localeCompare(contributorType2.description)
  );
};

const ContributorFields: FC<ContributorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, handleChange, setFieldTouched, setTouched, touched } =
    useFormikContext<Resource>();
  const [addContributorError, setAddContributorError] = useState<Error | AxiosError>();
  const [updateContributorError, setUpdateContributorError] = useState<Error | AxiosError>();
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [contributorTypesTranslated, setContributorTypesTranslated] = useState<contributorTypesTranslated[]>(
    generateContributorTypesTranslated(t)
  );
  const inputElements = useRef<any>({});
  const user = useSelector((state: RootState) => state.user);
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  useEffect(() => {
    setContributorTypesTranslated(generateContributorTypesTranslated(t));
  }, [t]);

  const addContributor = async (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    try {
      setAddContributorError(undefined);
      const contributorResponse = await createContributor(values.identifier);
      arrayHelpers.push({
        identifier: contributorResponse.data.identifier,
        features: {
          dlr_contributor_name: '',
          dlr_contributor_type: '',
          dlr_contributor_identifier: contributorResponse.data.identifier,
        },
      });
    } catch (error) {
      setAddContributorError(handlePotentialAxiosError(error));
    } finally {
      setAllChangesSaved(true);
      inputElements.current[values.contributors.length].focus();
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  const saveContributorField = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    contributorIdentifier: string,
    contributorIndex: number
  ) => {
    try {
      setAllChangesSaved(false);
      setUpdateContributorError(undefined);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      const name = '' + event.target.name.split('.').pop();
      if (event.target.value.length > 0) {
        await putContributorFeature(values.identifier, contributorIdentifier, name, event.target.value);
      }
      if (
        values?.contributors[contributorIndex].identifier === contributorIdentifier &&
        name === ContributorFeatureNames.Type
      ) {
        values.contributors[contributorIndex].features.dlr_contributor_type = event.target.value;
      }
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setUpdateContributorError(handlePotentialAxiosError(error));
      setErrorIndex(contributorIndex);
    } finally {
      setAllChangesSaved(true);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  const removeContributor = async (
    contributorIdentifier: string,
    arrayHelpers: FieldArrayRenderProps,
    contributorIndex: number
  ) => {
    try {
      setAllChangesSaved(false);
      await deleteContributor(values.identifier, contributorIdentifier);
      arrayHelpers.remove(contributorIndex);
      setUpdateContributorError(undefined);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (error) {
      setUpdateContributorError(handlePotentialAxiosError(error));
      setErrorIndex(contributorIndex);
    } finally {
      setAllChangesSaved(true);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  const onAuthoritySelected = (contributor: Contributor, index: number, authorities: Authority[]) => {
    try {
      values.contributors[index].authorities = authorities;
      if (values.contributors[index].features.dlr_contributor_name !== authorities[0].name) {
        setAllChangesSaved(false);
        setUpdateContributorError(undefined);
        setErrorIndex(ErrorIndex.NO_ERRORS);
        values.contributors[index].features.dlr_contributor_name = authorities[0].name;
        putContributorFeature(
          values.identifier,
          contributor.identifier,
          ContributorFeatureNames.Name,
          authorities[0].name
        );
      }
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    } catch (error) {
      setUpdateContributorError(handlePotentialAxiosError(error));
      setErrorIndex(index);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.DLRBlue2}>
      <StyledContentWrapper>
        <HeaderWrapper>
          <Typography variant="h3" component={mediumOrLargerScreen ? 'h2' : 'h3'}>
            {t('resource.metadata.contributors')}
          </Typography>
          <HelperTextWrapper>
            <HelperTextPopover
              ariaButtonLabel={t('explanation_text.contributor_helper_aria_label')}
              popoverId={'contributor-helper-popover'}>
              <StyledTypography variant="body1">{t('explanation_text.contributor_helper_text1')}.</StyledTypography>
              {user.institutionAuthorities?.isCurator && (
                <Typography variant="body1">{t('explanation_text.contributor_helper_text2')}.</Typography>
              )}
            </HelperTextPopover>
          </HelperTextWrapper>
        </HeaderWrapper>
        <FieldArray
          name={FieldNames.ContributorsBase}
          render={(arrayHelpers) => (
            <>
              {values.contributors?.map((contributor: Contributor, index: number) => {
                return (
                  <StyledFieldsWrapper key={contributor.identifier}>
                    <Field
                      name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Type}`}>
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <StyledTextFieldSizer isCurator={!!user.institutionAuthorities?.isCurator}>
                          <TextField
                            {...field}
                            id={`contributor-feature-type-${index}`}
                            variant="filled"
                            select
                            required
                            fullWidth
                            inputRef={(element) => (inputElements.current[index] = element)}
                            data-testid={`contributor-type-field-${index}`}
                            label={t('common.type')}
                            value={field.value}
                            error={touched && !!error}
                            helperText={<ErrorMessage name={field.name} />}
                            onBlur={(event) => {
                              handleBlur(event);
                              setFieldTouched(
                                `${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Type}`,
                                true,
                                true
                              );
                            }}
                            onChange={(event) => {
                              handleChange(event);
                              saveContributorField(event, contributor.identifier, index);
                            }}>
                            {contributorTypesTranslated.map((contributorType, index) => {
                              return (
                                <MenuItem
                                  data-testid={`contributor-type-options-${index}`}
                                  key={index}
                                  value={contributorType.key}>
                                  <Typography variant="inherit">{contributorType.description}</Typography>
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </StyledTextFieldSizer>
                      )}
                    </Field>

                    <Field
                      name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Name}`}>
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <StyledTextFieldSizer isCurator={!!user.institutionAuthorities?.isCurator} id="name-field">
                          <TextField
                            {...field}
                            id={`contributor-name-${index}`}
                            variant="filled"
                            label={t('common.name')}
                            required
                            disabled={contributor.authorities && contributor.authorities.length > 0}
                            fullWidth
                            multiline
                            error={touched && !!error}
                            helperText={<ErrorMessage name={field.name} />}
                            data-testid={`contributor-name-field-${index}`}
                            onBlur={(event) => {
                              handleBlur(event);
                              !error && saveContributorField(event, contributor.identifier, index);
                            }}
                          />
                        </StyledTextFieldSizer>
                      )}
                    </Field>
                    <StyledButtonRowWrapper id="button-wrapper">
                      {user.institutionAuthorities?.isCurator && (
                        <StyledButtonWrapper>
                          {!contributor.authorities || contributor.authorities.length === 0 ? (
                            <AuthoritySelector
                              resourceIdentifier={values.identifier}
                              creatorOrContributorId={contributor.identifier}
                              initialNameValue={contributor.features.dlr_contributor_name ?? ''}
                              onAuthoritySelected={(authorities) =>
                                onAuthoritySelected(contributor, index, authorities)
                              }
                            />
                          ) : (
                            <AuthorityLink authority={contributor.authorities[0]} />
                          )}
                        </StyledButtonWrapper>
                      )}
                      <StyledButtonWrapper>
                        <StyledDeleteButton
                          color="secondary"
                          variant="outlined"
                          startIcon={<DeleteIcon fontSize="large" />}
                          size="large"
                          data-testid={`contributor-delete-button-${index}`}
                          onClick={() => {
                            removeContributor(contributor.features.dlr_contributor_identifier, arrayHelpers, index);
                          }}>
                          {t('common.remove')}
                        </StyledDeleteButton>
                      </StyledButtonWrapper>
                    </StyledButtonRowWrapper>

                    {updateContributorError && errorIndex === index && <ErrorBanner error={updateContributorError} />}
                  </StyledFieldsWrapper>
                );
              })}
              <Button
                type="button"
                variant="outlined"
                color="primary"
                data-testid="contributor-add-button"
                startIcon={<AddIcon />}
                onClick={() => {
                  addContributor(arrayHelpers);
                }}>
                {t('resource.add_contributor')}
              </Button>
              {addContributorError && <ErrorBanner userNeedsToBeLoggedIn={true} error={addContributorError} />}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContributorFields;
