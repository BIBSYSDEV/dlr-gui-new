import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { CircularProgress, Typography } from '@material-ui/core';
import { getLicenses } from '../../api/resourceApi';
import { Resource, ResourceCreationType, ResourceFormStep } from '../../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import DescriptionFields from './description_step/DescriptionFields';
import { Uppy } from '../../types/file.types';
import ContributorFields from './contributors_step/ContributorFields';
import CreatorField from './contributors_step/CreatorField';
import { StyledContentWrapper, StyledContentWrapperMedium, StyledSchemaPart } from '../../components/styled/Wrappers';
import PreviewPanel from './preview_step/PreviewPanel';
import { StatusCode } from '../../utils/constants';
import { ContainsOtherPeoplesWorkOptions, License } from '../../types/license.types';
import ErrorBanner from '../../components/ErrorBanner';
import AccessAndLicenseStep from './access_and_licence_step/AccessAndLicenseStep';
import { useUppy } from '@uppy/react';
import { additionalCreateFilesUppy, createThumbnailFileUppy } from '../../utils/uppy-config';
import { Content } from '../../types/content.types';
import ContentsStep from './contents_step/ContentsStep';
import ResourceFormNavigationHeader from './ResourceFormNavigationHeader';
import ResourceFormErrors from './ResourceFormErrors';
import ResourceFormActions from './ResourceFormActions';

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
`;

interface ResourceFormProps {
  resource: Resource;
  uppy: Uppy;
  resourceType: ResourceCreationType;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceForm: FC<ResourceFormProps> = ({ uppy, resource, resourceType }) => {
  const setNewContentAndThumbnail = (newContent: Content) => {
    newContent.features.dlr_thumbnail_default = 'true';
    setNewContent(newContent);
    setNewThumbnailContent(newContent);
  };

  const { t } = useTranslation();
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [newContent, setNewContent] = useState<Content>();
  const [loadingLicensesErrorStatus, setLoadingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String
  const [licenses, setLicenses] = useState<License[]>();
  const additionalFilesUppy = useUppy(additionalCreateFilesUppy(resource.identifier, setNewContent));
  const [newThumbnailContent, setNewThumbnailContent] = useState<Content>();
  const thumbnailUppy = useUppy(createThumbnailFileUppy(resource.identifier, setNewContentAndThumbnail));
  const [activeStep, setActiveStep] = useState(ResourceFormStep.Description);

  const resourceValidationSchema = Yup.object().shape({
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
    contents: Yup.object().shape({
      masterContent: Yup.object().shape({
        features: Yup.object().shape({
          dlr_content_title: Yup.string().required(t('feedback.required_field')),
        }),
      }),
    }),
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
    containsOtherPeoplesWork: Yup.string().required(t('feedback.required_field')).min(1),
    usageClearedWithOwner: Yup.string()
      .optional()
      .when('containsOtherPeoplesWork', {
        is: ContainsOtherPeoplesWorkOptions.Yes,
        then: Yup.string().required(t('feedback.required_field')).min(1),
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
      <StyledContentWrapperMedium>
        <PageHeader>{t('resource.edit_resource')}</PageHeader>
      </StyledContentWrapperMedium>
      {resource && (
        <Formik
          initialValues={resource}
          validationSchema={resourceValidationSchema}
          onSubmit={() => {
            /*dont use. But cannot have empty onsubmit*/
          }}>
          {(formikProps: FormikProps<FormikValues>) => (
            <StyledForm>
              <ResourceFormNavigationHeader activeStep={activeStep} setActiveStep={setActiveStep} uppy={uppy} />
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
                      <Typography variant="h2">{formikProps.values.features.dlr_title}</Typography>
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
                  {loadingLicensesErrorStatus !== StatusCode.ACCEPTED && <ErrorBanner userNeedsToBeLoggedIn={true} />}

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
                      <Typography variant="h2">{formikProps.values.features.dlr_title}</Typography>
                    </StyledContentWrapper>
                  </StyledSchemaPart>
                  <ContentsStep
                    uppy={uppy}
                    setAllChangesSaved={setAllChangesSaved}
                    newContent={newContent}
                    additionalFileUploadUppy={additionalFilesUppy}
                    thumbnailUppy={thumbnailUppy}
                    resourceType={resourceType}
                    newThumbnailContent={newThumbnailContent}
                    newThumbnailIsReady={() => setNewThumbnailContent(undefined)}
                  />
                </StyledPanel>
              )}
              {activeStep === ResourceFormStep.Preview && (
                <StyledPanel>
                  <PreviewPanel formikProps={formikProps} />
                </StyledPanel>
              )}

              {activeStep === ResourceFormStep.Preview && !formikProps.isValid && <ResourceFormErrors />}
              <StyledPanel>
                <ResourceFormActions
                  activeStep={activeStep}
                  allChangesSaved={allChangesSaved}
                  setActiveStep={setActiveStep}
                />
              </StyledPanel>
            </StyledForm>
          )}
        </Formik>
      )}
    </>
  );
};

export default ResourceForm;
