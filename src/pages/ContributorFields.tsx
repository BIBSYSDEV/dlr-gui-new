import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
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
import { createContributor, putContributorFeature } from '../api/resourceApi';
import styled from 'styled-components';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';

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

const ContributorFields: FC<ContributorFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm } = useFormikContext<ResourceWrapper>();

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

  const deleteContributor = (identifier: string) => {
    //TODO: implement deletion
  };

  return (
    <StyledSchemaPartColored color={Colors.ContributorsPageGradientColor1}>
      <StyledContentWrapper>
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
                            !error && saveContributorField(event, resetForm, values, contributor.identifier);
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
                            !error && saveContributorField(event, resetForm, values, contributor.identifier);
                          }}
                        />
                      )}
                    </Field>
                    <Button
                      color="secondary"
                      startIcon={<DeleteIcon fontSize="large" />}
                      size="large"
                      onClick={() => {
                        deleteContributor(contributor.features.dlr_contributor_identifier);
                      }}>
                      {t('common.remove')}
                    </Button>
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
                {t('resource.add_contributor')}
              </Button>
            </>
          )}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContributorFields;
