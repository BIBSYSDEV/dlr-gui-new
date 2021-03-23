import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridSize, MenuItem, TextField, Typography } from '@material-ui/core';
import { Contributor, ContributorFeatureNames, FieldNames, Resource } from '../../../types/resource.types';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import { createContributor, deleteContributor, putContributorFeature } from '../../../api/resourceApi';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import contributorTypeList from '../../../resources/assets/contributorTypeList.json';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { StyledDeleteButton } from '../../../components/styled/StyledButtons';
import HelperTextPopover from '../../../components/HelperTextPopover';

const StyledSpacer = styled.div`
  margin-bottom: 1rem;
`;

interface ContributorFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

enum ErrorIndex {
  NO_ERRORS = -1,
}

const MaxGridColumns = 12;
const DefaultSmallColumns = 4;
const DefaultLargeColumns = 5;
const TextLengthOverflow = 14;

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
  const {
    values,
    handleBlur,
    resetForm,
    handleChange,
    setFieldTouched,
    setTouched,
    touched,
  } = useFormikContext<Resource>();
  const [addContributorError, setAddContributorError] = useState(false);
  const [updateContributorError, setUpdateContributorError] = useState(false);
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [contributorTypesTranslated, setContributorTypesTranslated] = useState<contributorTypesTranslated[]>(
    generateContributorTypesTranslated(t)
  );
  const inputElements = useRef<any>({});

  useEffect(() => {
    setContributorTypesTranslated(generateContributorTypesTranslated(t));
  }, [t]);

  const addContributor = async (arrayHelpers: FieldArrayRenderProps) => {
    setAllChangesSaved(false);
    try {
      const contributorResponse = await createContributor(values.identifier);
      arrayHelpers.push({
        identifier: contributorResponse.data.identifier,
        features: {
          dlr_contributor_name: '',
          dlr_contributor_type: '',
          dlr_contributor_identifier: contributorResponse.data.identifier,
        },
      });
      setAddContributorError(false);
    } catch (error) {
      setAddContributorError(true);
    } finally {
      setAllChangesSaved(true);
      inputElements.current[values.contributors.length].focus();
    }
  };

  const saveContributorField = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    contributorIdentifier: string,
    contributorIndex: number
  ) => {
    try {
      setAllChangesSaved(false);
      const name = '' + event.target.name.split('.').pop();
      if (event.target.value.length > 0) {
        await putContributorFeature(values.identifier, contributorIdentifier, name, event.target.value);
      }
      setUpdateContributorError(false);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      if (
        values?.contributors[contributorIndex].identifier === contributorIdentifier &&
        name === ContributorFeatureNames.Type
      ) {
        values.contributors[contributorIndex].features.dlr_contributor_type = event.target.value;
      }
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (saveContributorError: any) {
      setUpdateContributorError(true);
      setErrorIndex(contributorIndex);
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
      await deleteContributor(values.identifier, contributorIdentifier);
      arrayHelpers.remove(contributorIndex);
      setUpdateContributorError(false);
      setErrorIndex(ErrorIndex.NO_ERRORS);
    } catch (deleteContributorError: any) {
      setUpdateContributorError(true);
      setErrorIndex(contributorIndex);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const calculateNumSMTypeColumn = (index: number, bigScreen: boolean): GridSize => {
    const contributorName = values.contributors[index]?.features?.dlr_contributor_name;
    if (contributorName) {
      if (contributorName.length >= TextLengthOverflow && !bigScreen) {
        return MaxGridColumns;
      } else if (index === 0 && contributorName.length < TextLengthOverflow) {
        return DefaultSmallColumns;
      } else {
        return DefaultLargeColumns;
      }
    }
    return DefaultLargeColumns;
  };

  const calculateNumSMNameColumn = (index: number): GridSize => {
    const contributorName = values.contributors[index]?.features?.dlr_contributor_name;
    if (contributorName) {
      if (contributorName.length >= TextLengthOverflow) {
        return MaxGridColumns;
      } else if (index === 0 && contributorName.length < TextLengthOverflow) {
        return DefaultSmallColumns;
      } else {
        return DefaultSmallColumns;
      }
    }
    return DefaultSmallColumns;
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.contributors')}</Typography>
        <FieldArray
          name={FieldNames.ContributorsBase}
          render={(arrayHelpers) => (
            <>
              {values.contributors?.map((contributor: Contributor, index: number) => {
                return (
                  <StyledSpacer>
                    <Grid container alignItems="center" key={contributor.identifier} spacing={2}>
                      <Grid
                        item
                        xs={MaxGridColumns}
                        sm={calculateNumSMTypeColumn(index, false)}
                        xl={calculateNumSMTypeColumn(index, true)}>
                        <Field
                          name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Type}`}>
                          {({ field, meta: { touched, error } }: FieldProps<string>) => (
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
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={MaxGridColumns} sm={calculateNumSMNameColumn(index)} xl={DefaultSmallColumns}>
                        <Field
                          name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Name}`}>
                          {({ field, meta: { touched, error } }: FieldProps<string>) => (
                            <TextField
                              {...field}
                              id={`contributor-name-${index}`}
                              variant="filled"
                              label={t('common.name')}
                              required
                              fullWidth
                              error={touched && !!error}
                              helperText={<ErrorMessage name={field.name} />}
                              data-testid={`contributor-name-field-${index}`}
                              onBlur={(event) => {
                                handleBlur(event);
                                !error && saveContributorField(event, contributor.identifier, index);
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      {index === 0 && (
                        <Grid item xs={2} sm={1}>
                          <HelperTextPopover
                            ariaButtonLabel={t('explanation_text.contributor_helper_aria_label')}
                            popoverId={'contributor-helper-popover'}>
                            <Typography variant="body1">{t('explanation_text.contributor_helper_text')}.</Typography>
                          </HelperTextPopover>
                        </Grid>
                      )}
                      <Grid item xs={6} sm={3}>
                        <StyledDeleteButton
                          color="secondary"
                          startIcon={<DeleteIcon fontSize="large" />}
                          size="large"
                          data-testid={`contributor-delete-button-${index}`}
                          onClick={() => {
                            removeContributor(contributor.features.dlr_contributor_identifier, arrayHelpers, index);
                          }}>
                          {t('common.remove').toUpperCase()}
                        </StyledDeleteButton>
                      </Grid>
                      {updateContributorError && errorIndex === index && (
                        <Grid item xs={MaxGridColumns}>
                          <ErrorBanner />
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
                data-testid="contributor-add-button"
                startIcon={<AddIcon />}
                onClick={() => {
                  addContributor(arrayHelpers);
                }}>
                {t('resource.add_contributor').toUpperCase()}
              </Button>
              {addContributorError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContributorFields;
