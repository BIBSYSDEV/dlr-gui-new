import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { Contributor, ContributorFeatureNames, FieldNames, ResourceWrapper } from '../../../types/resource.types';
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
import { StyledDeleteButton } from '../../../components/styled/DeleteButton';

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
  const {
    values,
    handleBlur,
    resetForm,
    handleChange,
    setFieldTouched,
    setTouched,
    touched,
  } = useFormikContext<ResourceWrapper>();
  const [addContributorError, setAddContributorError] = useState(false);
  const [updateContributorError, setUpdateContributorError] = useState(false);
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [contributorTypesTranslated, setContributorTypesTranslated] = useState<contributorTypesTranslated[]>(
    generateContributorTypesTranslated(t)
  );

  useEffect(() => {
    setContributorTypesTranslated(generateContributorTypesTranslated(t));
  }, [t]);

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
      setAddContributorError(false);
    } catch (error) {
      setAddContributorError(true);
    } finally {
      setAllChangesSaved(true);
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
        await putContributorFeature(values.resource.identifier, contributorIdentifier, name, event.target.value);
      }
      setUpdateContributorError(false);
      setErrorIndex(ErrorIndex.NO_ERRORS);
      if (
        values.resource?.contributors[contributorIndex].identifier === contributorIdentifier &&
        name === ContributorFeatureNames.Type
      ) {
        values.resource.contributors[contributorIndex].features.dlr_contributor_type = event.target.value;
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
      await deleteContributor(values.resource.identifier, contributorIdentifier);
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

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.contributors')}</Typography>
        <FieldArray
          name={FieldNames.ContributorsBase}
          render={(arrayHelpers) => (
            <>
              {values.resource.contributors?.map((contributor: Contributor, index: number) => {
                return (
                  <StyledFieldsWrapper key={contributor.identifier}>
                    <Field
                      name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Type}`}>
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <StyledTextField
                          {...field}
                          variant="filled"
                          select
                          required
                          label={t('type')}
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
                              <MenuItem key={index} value={contributorType.key}>
                                <Typography variant="inherit">{contributorType.description}</Typography>
                              </MenuItem>
                            );
                          })}
                        </StyledTextField>
                      )}
                    </Field>
                    <Field
                      name={`${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}.${ContributorFeatureNames.Name}`}>
                      {({ field, meta: { touched, error } }: FieldProps<string>) => (
                        <StyledTextField
                          {...field}
                          variant="filled"
                          label={t('name')}
                          error={touched && !!error}
                          helperText={<ErrorMessage name={field.name} />}
                          onBlur={(event) => {
                            handleBlur(event);
                            !error && saveContributorField(event, contributor.identifier, index);
                          }}
                        />
                      )}
                    </Field>
                    <StyledDeleteButton
                      color="secondary"
                      startIcon={<DeleteIcon fontSize="large" />}
                      size="large"
                      onClick={() => {
                        removeContributor(contributor.features.dlr_contributor_identifier, arrayHelpers, index);
                      }}>
                      {t('common.remove').toUpperCase()}
                    </StyledDeleteButton>
                    {updateContributorError && errorIndex === index && <ErrorBanner />}
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
              {addContributorError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContributorFields;
