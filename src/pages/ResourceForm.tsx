import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import { Button, CircularProgress, Divider, Step, StepButton, Stepper } from '@material-ui/core';
import { postResourceFeature } from '../api/resourceApi';
import { Resource, ResourceCreationType } from '../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './DescriptionFields';
import { Uppy } from '../types/file.types';
import FileFields from './FileFields';
import ContributorFields from './ContributorFields';
import LicenseAndAccessFields from './LicenseAndAccessFields';
import { StyledContentWrapper } from '../components/styled/Wrappers';
import PreviewPanel from './PreviewPanel';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
`;

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 10rem;
  padding-top: 2rem;
  padding-bottom: 1rem;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'};
  padding: 2rem 2rem 1rem;
`;

export enum ResourceFormSteps {
  Description = 0,
  Contributors = 1,
  Files = 2,
  AccessAndLicense = 3,
  Preview = 4,
}
export interface ResourceFormValues {
  resource: Resource;
}

interface ResourceFormProps {
  resource?: Resource;
  uppy: Uppy;
  resourceType: ResourceCreationType;
}

const ResourceForm: FC<ResourceFormProps> = ({ uppy, resource, resourceType }) => {
  const { t } = useTranslation();
  const [allChangesSaved, setAllChangesSaved] = useState(true);

  const steps = [
    t('resource.form_steps.description'),
    t('resource.form_steps.contributors'),
    t('resource.form_steps.files'),
    t('resource.form_steps.access_and_licence'),
    t('resource.form_steps.preview'),
  ];

  const [activeStep, setActiveStep] = useState<ResourceFormSteps>(ResourceFormSteps.Description);

  useEffect(() => {
    resourceType === ResourceCreationType.FILE && setActiveStep(ResourceFormSteps.Files);
  }, [resourceType]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resourceValidationSchema = Yup.object().shape({
    resource: Yup.object().shape({
      features: Yup.object().shape({
        dlr_title: Yup.string().required(t('feedback.required_field')),
      }),
    }),
  });

  const saveResourceField = async (
    //todo: legge i hook? - vi har mange forskjellige backends her
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
      <StyledContentWrapper>
        <PageHeader>{t('resource.edit_resource')}</PageHeader>
      </StyledContentWrapper>
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
              <StyledContentWrapper>
                <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
                  {steps.map((label, index) => {
                    return (
                      <Step key={label} completed={false}>
                        <StepButton onClick={handleStep(index)}>{label}</StepButton>
                      </Step>
                    );
                  })}
                </Stepper>
              </StyledContentWrapper>

              {activeStep === ResourceFormSteps.Description && (
                <StyledPanel>
                  <DescriptionFields formikProps={formikProps} saveField={saveResourceField} />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Contributors && (
                <StyledPanel>
                  <ContributorFields
                    setAllChangesSaved={(status: boolean) => {
                      setAllChangesSaved(status);
                    }}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.AccessAndLicense && (
                <StyledPanel>
                  <LicenseAndAccessFields
                    setAllChangesSaved={(status: boolean) => {
                      setAllChangesSaved(status);
                    }}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Files && (
                <StyledPanel>
                  <FileFields uppy={uppy} formikProps={formikProps} setAllChangesSaved={setAllChangesSaved} />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Preview && (
                <StyledPanel>
                  <PreviewPanel formikProps={formikProps} />
                </StyledPanel>
              )}
              <Divider style={{ marginTop: '1rem', width: '100%' }} />
              <StyledContentWrapper>
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
              </StyledContentWrapper>
            </StyledForm>
          )}
        </Formik>
      )}
    </>
  );
};

export default ResourceForm;
