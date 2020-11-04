import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import { Button, CircularProgress } from '@material-ui/core';
import { getResource, getResourceDefaults, postResourceFeature } from '../api/api';
import { emptyResource, Resource } from '../types/resource.types';
import deepmerge from 'deepmerge';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './DescriptionFields';

const StyledResource = styled.div`
  width: 100%;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 30rem;
  margin: auto;
  gap: 1rem;
  align-items: center;
  justify-items: center;
`;

interface ResourceFormProps {
  identifier?: string;
}

const ResourceForm: FC<ResourceFormProps> = ({ identifier }) => {
  const { t } = useTranslation();
  const [resource, setResource] = useState<Resource>(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [allChangesSaved, setAllChangesSaved] = useState<boolean>(false);

  interface ResourceFormValues {
    resource: Resource;
  }

  const saveCalculatedFields = (_resource: Resource) => {
    if (_resource.features.dlr_title) {
      postResourceFeature(_resource.identifier, 'dlr_title', _resource.features.dlr_title);
    }
    if (_resource.features.dlr_description) {
      postResourceFeature(_resource.identifier, 'dlr_description', _resource.features.dlr_description);
    }
    if (_resource.features.dlr_type) {
      postResourceFeature(_resource.identifier, 'dlr_type', _resource.features.dlr_type);
    }
    //TODO: tags, creators
    setAllChangesSaved(true);
  };

  useEffect(() => {
    if (identifier) {
      setIsLoadingResource(true);
      getResource(identifier).then((resourceResponse) => {
        getResourceDefaults(identifier).then((responseWithCalculatedDefaults) => {
          saveCalculatedFields(responseWithCalculatedDefaults.data);
          setResource(deepmerge(resourceResponse.data, responseWithCalculatedDefaults.data));
          setIsLoadingResource(false);
        });
      });
    }
  }, [identifier]);

  const resourceValidationSchema = Yup.object().shape({
    resource: Yup.object().shape({
      features: Yup.object().shape({
        dlr_title: Yup.string().required(t('feedback.required_field')),
      }),
    }),
  });

  const saveField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resetForm: any,
    currentValues: ResourceFormValues
  ) => {
    setAllChangesSaved(false);
    if (resource) {
      const name = '' + event.target.name.split('.').pop();
      await postResourceFeature(resource.identifier, name, event.target.value);
      setAllChangesSaved(true);
      resetForm({ values: currentValues });
    }
  };

  return (
    <>
      <PageHeader>{t('resource.edit_resource')}</PageHeader>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <StyledResource>
          {resource && (
            <Formik
              initialValues={{
                resource: resource,
              }}
              validateOnChange
              validationSchema={resourceValidationSchema}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
              }}>
              {(formikProps: FormikProps<FormikValues>) => (
                <StyledForm>
                  <DescriptionFields resource={resource} formikProps={formikProps} saveField={saveField} />

                  <Button variant="contained" color="primary" type="submit">
                    Show resource object
                  </Button>
                  <div>
                    {!allChangesSaved && <CircularProgress size="1rem" />}
                    {allChangesSaved && !formikProps.dirty && <span>{t('common.all_changes_saved')}</span>}
                  </div>
                </StyledForm>
              )}
            </Formik>
          )}
        </StyledResource>
      )}
    </>
  );
};

export default ResourceForm;
