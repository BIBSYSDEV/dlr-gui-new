import React, { FC, useEffect, useRef, useState } from 'react';
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
import { StyledContentWrapper, StyledContentWrapperLarge, StyledSchemaPart } from '../../components/styled/Wrappers';
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
import RequiredFieldInformation from '../../components/RequiredFieldInformation';
import ScrollToContentButton from '../../components/ScrollToContentButton';
import { StyleWidths } from '../../themes/mainTheme';
import { Alert, AlertTitle } from '@material-ui/lab';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const StyledPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const StyledAlert = styled(Alert)`
  & .MuiAlertTitle-root {
    font-size: 1.2rem;
  }

  color: black;
  font-size: 1rem;
  margin-top: 2rem;
`;

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${StyleWidths.width5};
  flex-grow: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin: 0;
  }
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
  const [loadingLicensesErrorStatus, setLoadingLicensesErrorStatus] = useState(StatusCode.ACCEPTED);
  const [licenses, setLicenses] = useState<License[]>();
  const additionalFilesUppy = useUppy(additionalCreateFilesUppy(resource.identifier, setNewContent));
  const [newThumbnailContent, setNewThumbnailContent] = useState<Content>();
  const thumbnailUppy = useUppy(createThumbnailFileUppy(resource.identifier, setNewContentAndThumbnail));
  const [activeStep, setActiveStep] = useState(ResourceFormStep.Description);
  const contentRef = useRef<HTMLDivElement>(null);
  const beforeResourceFormNavigationRef = useRef<HTMLDivElement>(null);

  const resourceValidationSchema = Yup.object().shape({
    features: Yup.object().shape({
      dlr_title: Yup.string().required(t('feedback.required_field')),
      dlr_type: Yup.string().required(t('feedback.required_field')).min(1, t('feedback.required_field')),
      dlr_licensehelper_contains_other_peoples_work: Yup.string().required(t('feedback.required_field')).min(1),
      dlr_licensehelper_usage_cleared_with_owner: Yup.string()
        .optional()
        .when('dlr_licensehelper_contains_other_peoples_work', {
          is: ContainsOtherPeoplesWorkOptions.Yes,
          then: Yup.string().required(t('feedback.required_field')).min(1),
        }),
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
  });

  const scrollToTop = () => {
    beforeResourceFormNavigationRef?.current?.focus({ preventScroll: true });
    beforeResourceFormNavigationRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center',
    });
  };

  useEffect(() => {
    const getAllLicences = async () => {
      setIsLoadingLicenses(true);
      setLoadingLicensesErrorStatus(StatusCode.ACCEPTED);
      try {
        const response = await getLicenses();
        setLicenses(response.data);
      } catch (error) {
        error.response && setLoadingLicensesErrorStatus(error.response.status);
      } finally {
        setIsLoadingLicenses(false);
      }
    };
    getAllLicences();
  }, []);
  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('resource.edit_resource')}</PageHeader>
      {resource && (
        <>
          <StyledAlert severity="warning" variant="filled">
            <AlertTitle>Advarsel</AlertTitle>
            Ressursen er publisert. Alle felter som endres blir lagret umiddelbart og dermed blir endringene også
            publisert.
          </StyledAlert>

          <Formik
            initialValues={resource}
            validationSchema={resourceValidationSchema}
            onSubmit={() => {
              /*dont use. But cannot have empty onsubmit*/
            }}>
            {(formikProps: FormikProps<FormikValues>) => (
              <StyledForm>
                <ScrollToContentButton contentRef={contentRef} text={t('skip_to_form_content')} />
                <div tabIndex={-1} ref={beforeResourceFormNavigationRef} />
                <ResourceFormNavigationHeader activeStep={activeStep} setActiveStep={setActiveStep} uppy={uppy} />
                <StyledPanelWrapper>
                  <StyledPanel tabIndex={-1} ref={contentRef}>
                    {activeStep === ResourceFormStep.Description && (
                      <DescriptionFields
                        setAllChangesSaved={(status: boolean) => {
                          setAllChangesSaved(status);
                        }}
                      />
                    )}
                    {activeStep === ResourceFormStep.Contributors && (
                      <>
                        <StyledSchemaPart>
                          <StyledContentWrapper>
                            <Typography variant="h3" component="h2">
                              {formikProps.values.features.dlr_title}
                            </Typography>
                          </StyledContentWrapper>
                        </StyledSchemaPart>
                        <CreatorField setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)} />
                        <ContributorFields
                          setAllChangesSaved={(status: boolean) => {
                            setAllChangesSaved(status);
                          }}
                        />
                        <RequiredFieldInformation />
                      </>
                    )}
                    {activeStep === ResourceFormStep.AccessAndLicense && (
                      <>
                        {isLoadingLicenses && <CircularProgress />}
                        {loadingLicensesErrorStatus !== StatusCode.ACCEPTED && (
                          <ErrorBanner userNeedsToBeLoggedIn={true} />
                        )}
                        <AccessAndLicenseStep
                          setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
                          licenses={licenses}
                        />
                      </>
                    )}
                    {activeStep === ResourceFormStep.Contents && (
                      <div id={fileUploadPanelId}>
                        <StyledSchemaPart>
                          <StyledContentWrapper>
                            <Typography variant="h3" component="h2">
                              {formikProps.values.features.dlr_title}
                            </Typography>
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
                      </div>
                    )}
                    {activeStep === ResourceFormStep.Preview && <PreviewPanel formikProps={formikProps} />}
                    {activeStep === ResourceFormStep.Preview && !formikProps.isValid && <ResourceFormErrors />}
                    <ResourceFormActions
                      activeStep={activeStep}
                      allChangesSaved={allChangesSaved}
                      setActiveStep={setActiveStep}
                      scrollToTop={scrollToTop}
                    />
                  </StyledPanel>
                </StyledPanelWrapper>
              </StyledForm>
            )}
          </Formik>
        </>
      )}
    </StyledContentWrapperLarge>
  );
};

export default ResourceForm;
