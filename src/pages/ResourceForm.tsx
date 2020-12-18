import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import { Button, CircularProgress, Divider, Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { getLicenses } from '../api/resourceApi';
import { Resource, ResourceCreationType } from '../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './DescriptionFields';
import { Uppy } from '../types/file.types';
import FileFields from './FileFields';
import ContributorFields from './ContributorFields';
import CreatorField from './CreatorField';
import LicenseAndAccessFields from './LicenseAndAccessFields';
import { StyledContentWrapper } from '../components/styled/Wrappers';
import PreviewPanel from './PreviewPanel';
import { StatusCode } from '../utils/constants';
import { License } from '../types/license.types';
import ErrorBanner from '../components/ErrorBanner';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useInterval from '../utils/useInterval';
import { hasTouchedError } from '../utils/formik-helpers';

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

interface ResourceFormProps {
  resource?: Resource;
  uppy: Uppy;
  resourceType: ResourceCreationType;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceForm: FC<ResourceFormProps> = ({ uppy, resource, resourceType }) => {
  const { t } = useTranslation();
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [loadingLicensesErrorStatus, setLoadingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String
  const [licenses, setLicenses] = useState<License[]>();
  const [percentageFileUpload, setPersentageFileUpload] = useState(0);
  const [count, setCount] = useState<number>(0);
  const [delay] = useState<number>(500);
  const [shouldUseInterval] = useState(false);

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
        dlr_type: Yup.string().required(t('feedback.required_field')).min(1, t('feedback.required_field')),
      }),
      creators: Yup.array().of(
        Yup.object().shape({
          features: Yup.object().shape({
            dlr_creator_name: Yup.string().required(t('feedback.required_field')),
          }),
        })
      ),
      contributors: Yup.array().of(
        Yup.object().shape({
          features: Yup.object().shape({
            dlr_contributor_name: Yup.string().required(t('feedback.required_field')),
            dlr_contributor_type: Yup.string().required(t('feedback.required_field')),
          }),
        })
      ),
      licenses: Yup.array().of(
        Yup.object().shape({
          identifier: Yup.string().required(t('feedback.required_field')).min(1),
        })
      ),
    }),
  });

  useEffect(() => {
    async function getAllLicences() {
      setIsLoadingLicenses(true);
      setLoadingLicensesErrorStatus(StatusCode.ACCEPTED);
      try {
        const response = await getLicenses(); //todo: Async method
        setLicenses(response.data);
      } catch (err) {
        err?.response && setLoadingLicensesErrorStatus(err.response.status);
      } finally {
        setIsLoadingLicenses(false);
      }
    }

    getAllLicences();
  }, []);

  const calculateShouldUseInterval = () => {
    if (!shouldUseInterval && percentageFileUpload === 100) {
      return null;
    } else {
      return delay;
    }
  };

  useInterval(() => {
    setPersentageFileUpload(uppy.getState().totalProgress);
    setCount(count + 1);
  }, calculateShouldUseInterval());

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
          validateOnBlur
          validateOnMount
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
                        <StepButton onClick={handleStep(index)}>
                          <StepLabel error={hasTouchedError(formikProps.errors, formikProps.touched, index)}>
                            {label}{' '}
                            {label === t('resource.form_steps.files') &&
                              percentageFileUpload > 0 &&
                              percentageFileUpload < 100 && (
                                <CircularProgress
                                  aria-describedby={fileUploadPanelId}
                                  size={20}
                                  variant="determinate"
                                  value={percentageFileUpload}
                                />
                              )}
                            {label === t('resource.form_steps.files') && percentageFileUpload === 100 && (
                              <CheckCircleIcon />
                            )}
                          </StepLabel>
                        </StepButton>
                      </Step>
                    );
                  })}
                </Stepper>
              </StyledContentWrapper>
              {activeStep === ResourceFormSteps.Description && (
                <StyledPanel>
                  <DescriptionFields
                    setAllChangesSaved={(status: boolean) => {
                      setAllChangesSaved(status);
                    }}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Contributors && (
                <StyledPanel>
                  <CreatorField setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)} />
                  <ContributorFields
                    setAllChangesSaved={(status: boolean) => {
                      setAllChangesSaved(status);
                    }}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.AccessAndLicense && (
                <StyledPanel>
                  {isLoadingLicenses && <CircularProgress />}
                  {loadingLicensesErrorStatus !== StatusCode.ACCEPTED && <ErrorBanner />}
                  {licenses && (
                    <LicenseAndAccessFields
                      setAllChangesSaved={(status: boolean) => {
                        setAllChangesSaved(status);
                      }}
                      licenses={licenses}
                    />
                  )}
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Files && (
                <StyledPanel id={fileUploadPanelId}>
                  <FileFields uppy={uppy} setAllChangesSaved={setAllChangesSaved} />
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
