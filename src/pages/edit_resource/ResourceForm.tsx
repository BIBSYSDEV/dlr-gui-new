import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { Button, CircularProgress, Divider, Typography } from '@material-ui/core';
import { getLicenses } from '../../api/resourceApi';
import { Resource, ResourceCreationType, ResourceFormStep, ResourceFormSteps } from '../../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './description_step/DescriptionFields';
import { Uppy } from '../../types/file.types';
import FileFields from './contents_step/FileFields';
import ContributorFields from './contributors_step/ContributorFields';
import CreatorField from './contributors_step/CreatorField';
import { StyledContentWrapper, StyledSchemaPart } from '../../components/styled/Wrappers';
import PreviewPanel from './preview_step/PreviewPanel';
import { StatusCode } from '../../utils/constants';
import { License } from '../../types/license.types';
import ErrorBanner from '../../components/ErrorBanner';
import AccessAndLicenseStep from './access_and_licence_step/AccessAndLicenseStep';
import ResourceFormNavigationHeader from './ResourceFormNavigationHeader';

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

  const [activeStep, setActiveStep] = useState<ResourceFormStep>(ResourceFormStep.Description);

  // useEffect(() => {
  //   resourceType === ResourceCreationType.FILE && setActiveStep(ResourceFormStep.Contents);
  // }, [resourceType]);

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
          validationSchema={resourceValidationSchema}
          onSubmit={() => {
            /*dont use. But cannot have empty onsubmit*/
          }}>
          {(formikProps: FormikProps<FormikValues>) => (
            <StyledForm>
              <StyledContentWrapper>
                <ResourceFormNavigationHeader activeStep={activeStep} setActiveStep={setActiveStep} uppy={uppy} />
              </StyledContentWrapper>
              {activeStep === ResourceFormStep.Description && (
                <StyledPanel>
                  <DescriptionFields
                    setAllChangesSaved={(status: boolean) => {
                      setAllChangesSaved(status);
                    }}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormStep.Contributors && (
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
              {activeStep === ResourceFormStep.AccessAndLicense && (
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
              {activeStep === ResourceFormStep.Contents && (
                <StyledPanel id={fileUploadPanelId}>
                  <StyledSchemaPart>
                    <StyledContentWrapper>
                      <Typography variant="h4">{formikProps.values.resource.features.dlr_title}</Typography>
                    </StyledContentWrapper>
                  </StyledSchemaPart>
                  <FileFields uppy={uppy} setAllChangesSaved={setAllChangesSaved} />
                </StyledPanel>
              )}
              {activeStep === ResourceFormStep.Preview && (
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
                      {activeStep === ResourceFormSteps.length - 1 ? t('common.finish') : t('common.next')}
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
