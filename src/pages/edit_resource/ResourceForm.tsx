import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { Button, CircularProgress, Divider, Step, StepButton, StepLabel, Stepper, Typography } from '@material-ui/core';
import { getLicenses } from '../../api/resourceApi';
import { Resource, ResourceCreationType } from '../../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './description_step/DescriptionFields';
import { Uppy } from '../../types/file.types';
import ContributorFields from './contributors_step/ContributorFields';
import CreatorField from './contributors_step/CreatorField';
import { StyledContentWrapper, StyledSchemaPart } from '../../components/styled/Wrappers';
import PreviewPanel from './preview_step/PreviewPanel';
import { StatusCode } from '../../utils/constants';
import { License } from '../../types/license.types';
import ErrorBanner from '../../components/ErrorBanner';
import AccessAndLicenseStep from './access_and_licence_step/AccessAndLicenseStep';
import { hasTouchedError } from '../../utils/formik-helpers';
import CircularFileUploadProgress from '../../components/CircularFileUploadProgress';
import { useUppy } from '@uppy/react';
import { additionalCreateFilesUppy } from '../../utils/uppy-config';
import { Content } from '../../types/content.types';
import ContentsStep from './contents_step/ContentsStep';

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
  Contents = 2,
  AccessAndLicense = 3,
  Preview = 4,
}

interface ResourceFormProps {
  resource: Resource;
  uppy: Uppy;
  resourceType: ResourceCreationType;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceForm: FC<ResourceFormProps> = ({ uppy, resource, resourceType }) => {
  const { t } = useTranslation();
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [newContent, setNewContent] = useState<Content>();
  const [loadingLicensesErrorStatus, setLoadingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String
  const [licenses, setLicenses] = useState<License[]>();
  const additionalFilesUppy = useUppy(additionalCreateFilesUppy(resource.identifier, setNewContent));

  const steps = [
    t('resource.form_steps.description'),
    t('resource.form_steps.contributors'),
    t('resource.form_steps.files'),
    t('resource.form_steps.access_and_licence'),
    t('resource.form_steps.preview'),
  ];

  const [activeStep, setActiveStep] = useState<ResourceFormSteps>(ResourceFormSteps.Description);

  useEffect(() => {
    resourceType === ResourceCreationType.FILE && setActiveStep(ResourceFormSteps.Contents);
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
                          <StepLabel error={hasTouchedError(formikProps, index)}>
                            {label}{' '}
                            {label === t('resource.form_steps.files') && (
                              <CircularFileUploadProgress
                                uppy={uppy}
                                isUploadingNewFile={true}
                                describedById={fileUploadPanelId}
                              />
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
                  <StyledSchemaPart>
                    <StyledContentWrapper>
                      <Typography variant="h4">{formikProps.values.resource.features.dlr_title}</Typography>
                    </StyledContentWrapper>
                  </StyledSchemaPart>
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
                  <StyledSchemaPart>
                    <StyledContentWrapper>
                      <Typography variant="h4">{formikProps.values.resource.features.dlr_title}</Typography>
                    </StyledContentWrapper>
                  </StyledSchemaPart>

                  <AccessAndLicenseStep
                    setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
                    licenses={licenses}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormSteps.Contents && (
                <StyledPanel id={fileUploadPanelId}>
                  <StyledSchemaPart>
                    <StyledContentWrapper>
                      <Typography variant="h4">{formikProps.values.resource.features.dlr_title}</Typography>
                    </StyledContentWrapper>
                  </StyledSchemaPart>
                  <ContentsStep
                    uppy={uppy}
                    setAllChangesSaved={setAllChangesSaved}
                    newContent={newContent}
                    additionalFileUploadUppy={additionalFilesUppy}
                  />
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
