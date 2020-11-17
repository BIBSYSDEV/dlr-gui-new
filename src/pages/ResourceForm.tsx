import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import { Button, CircularProgress, Step, StepButton, Stepper, Typography } from '@material-ui/core';
import { getResource, getResourceDefaults, postResourceFeature } from '../api/resourceApi';
import { emptyResource, Resource } from '../types/resource.types';
import deepmerge from 'deepmerge';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './DescriptionFields';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-items: center;
  margin-left: 4rem;
  margin-right: 4rem;
`;

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-items: center;
  min-height: 10rem;
  padding: 2rem 2rem 1rem;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 2rem 2rem 1rem;
`;

interface ResourceFormProps {
  identifier?: string;
}

export enum ResourceFormSteps {
  Description = 0,
  Contributors = 1,
  Files = 2,
  AccessAndLicense = 3,
  Preview = 4,
}

const ResourceForm: FC<ResourceFormProps> = ({ identifier }) => {
  const { t } = useTranslation();
  const [resource, setResource] = useState<Resource>(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [allChangesSaved, setAllChangesSaved] = useState<boolean>(false);
  const steps = [
    t('resource.form_steps.description'),
    t('resource.form_steps.contributors'),
    t('resource.form_steps.files'),
    t('resource.form_steps.access_and_licence'),
    t('resource.form_steps.preview'),
  ];
  const [activeStep, setActiveStep] = useState<ResourceFormSteps>(ResourceFormSteps.Description);

  interface ResourceFormValues {
    resource: Resource;
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  return (
    <>
      <PageHeader>{t('resource.edit_resource')}</PageHeader>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <>
          {resource && (
            <Formik
              initialValues={{
                resource: resource,
              }}
              validateOnChange
              validationSchema={resourceValidationSchema}
              onSubmit={() => {
                /*dont use. But cannot have empty onsubmit*/
              }}>
              {(formikProps: FormikProps<FormikValues>) => (
                <StyledForm>
                  <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
                    {steps.map((label, index) => {
                      const stepProps: { completed?: boolean } = {};
                      stepProps.completed = false;
                      return (
                        <Step key={label} {...stepProps}>
                          <StepButton onClick={handleStep(index)}>{label}</StepButton>
                        </Step>
                      );
                    })}
                  </Stepper>

                  {activeStep === ResourceFormSteps.Description && (
                    <StyledPanel>
                      <DescriptionFields resource={resource} formikProps={formikProps} saveField={saveField} />
                    </StyledPanel>
                  )}
                  {activeStep === ResourceFormSteps.Contributors && (
                    <StyledPanel>
                      <Typography>Contributors-fields implemented</Typography>
                    </StyledPanel>
                  )}
                  {activeStep === ResourceFormSteps.AccessAndLicense && (
                    <StyledPanel>
                      <Typography>Access and license-fields not implemented</Typography>
                    </StyledPanel>
                  )}
                  {activeStep === ResourceFormSteps.Files && (
                    <StyledPanel>
                      <Typography>Files-fields not implemented</Typography>
                    </StyledPanel>
                  )}
                  {activeStep === ResourceFormSteps.Preview && (
                    <StyledPanel>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(formikProps.values, null, 2)}</pre>
                    </StyledPanel>
                  )}

                  <StyledButtonWrapper>
                    <div>
                      {!allChangesSaved && <CircularProgress size="1rem" />}
                      {allChangesSaved && !formikProps.dirty && <span>{t('common.all_changes_saved')}</span>}
                    </div>
                    <div>
                      <Button disabled={activeStep === 0} onClick={handleBack}>
                        {t('common.back')}
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? t('common.finish') : t('common.next')}
                      </Button>
                    </div>
                  </StyledButtonWrapper>
                </StyledForm>
              )}
            </Formik>
          )}
        </>
      )}
    </>
  );
};

export default ResourceForm;
