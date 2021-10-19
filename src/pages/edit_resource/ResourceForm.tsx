import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { getLicenses } from '../../api/resourceApi';
import { Resource, ResourceCreationType, ResourceFormStep } from '../../types/resource.types';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { BaseSchema } from 'yup';
import DescriptionFields from './description_step/DescriptionFields';
import { Uppy } from '../../types/file.types';
import ContributorFields from './contributors_step/ContributorFields';
import CreatorField from './contributors_step/CreatorField';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import PreviewPanel from './preview_step/PreviewPanel';
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
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { Alert, AlertTitle } from '@mui/material';
import SchemaPartTitle from './SchemaPartTitle';
import { hasTouchedError } from '../../utils/formik-helpers';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { gridClasses } from '@mui/material';
import { fileUploadPanelId } from '../../utils/constants';

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

const StyledGridItem = styled(Grid)`
  &&.${gridClasses.item} {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const StyledGridItemResourceTitle = styled(Grid)`
  &&.${gridClasses.item} {
    padding-top: 0;
  }
`;

const StyledPageHeaderSubtitle: any = styled(Typography)`
  color: ${Colors.PageHeaderSubtitle};
`;

interface ResourceFormProps {
  resource: Resource;
  uppy: Uppy;
  resourceType: ResourceCreationType;
  mainFileBeingUploaded: boolean;
}

const ResourceForm: FC<ResourceFormProps> = ({ uppy, resource, resourceType, mainFileBeingUploaded }) => {
  const setNewContentAndThumbnail = (newContent: Content) => {
    newContent.features.dlr_thumbnail_default = 'true';
    setNewContent(newContent);
    setNewThumbnailContent(newContent);
  };

  const { t } = useTranslation();
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [newContent, setNewContent] = useState<Content>();
  const [loadingError, setLoadingError] = useState<Error | AxiosError>();
  const [licenses, setLicenses] = useState<License[]>();
  const [activeStep, setActiveStep] = useState(ResourceFormStep.Description);
  const additionalFilesUppy = useUppy(additionalCreateFilesUppy(resource.identifier, setNewContent));
  const [newThumbnailContent, setNewThumbnailContent] = useState<Content>();
  const thumbnailUppy = useUppy(createThumbnailFileUppy(resource.identifier, setNewContentAndThumbnail));
  const contentRef = useRef<HTMLDivElement>(null);
  const beforeResourceFormNavigationRef = useRef<HTMLDivElement>(null);
  const [resourceTitle, setResourceTitle] = useState(resource.features.dlr_title);

  const resourceValidationSchema = Yup.object().shape({
    features: Yup.object().shape({
      dlr_title: Yup.string().required(t('feedback.required_field')),
      dlr_type: Yup.string().required(t('feedback.required_field')).min(1, t('feedback.required_field')),
      dlr_licensehelper_contains_other_peoples_work: Yup.string().when(
        'dlr_status_published',
        (isPublished: boolean, schema: BaseSchema) => {
          return isPublished ? schema : schema.required(t('feedback.required_field')).min(1);
        }
      ),
      dlr_licensehelper_usage_cleared_with_owner: Yup.string()
        .optional()
        .when('dlr_licensehelper_contains_other_peoples_work', {
          is: ContainsOtherPeoplesWorkOptions.Yes,
          then: Yup.string().when('dlr_status_published', (isPublished: boolean, schema: BaseSchema) => {
            return isPublished ? schema : schema.required(t('feedback.required_field')).min(1);
          }),
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
        identifier: Yup.string().when('dlr_status_published', (isPublished: boolean, schema: BaseSchema) => {
          return isPublished ? schema : schema.required(t('feedback.required_field')).min(1);
        }),
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
    const setupBeforeUnloadListener = () => {
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        const uppyState = additionalFilesUppy.getState();
        if (!(uppyState.totalProgress === 0 || uppyState.totalProgress === 100)) return (event.returnValue = ''); //The text displayed to the user is the browser's default text. (no need to add custom text)
      });
    };
    setupBeforeUnloadListener();
  }, [additionalFilesUppy]);

  useEffect(() => {
    const getAllLicences = async () => {
      setIsLoadingLicenses(true);
      setLoadingError(undefined);
      try {
        const response = await getLicenses();
        setLicenses(response.data);
      } catch (error) {
        setLoadingError(handlePotentialAxiosError(error));
      } finally {
        setIsLoadingLicenses(false);
      }
    };
    getAllLicences();
  }, []);
  return (
    <StyledContentWrapperLarge>
      <PageHeader>
        <Grid container spacing={3} alignItems="baseline">
          <StyledGridItem item>{t('resource.edit_resource')}</StyledGridItem>
          {activeStep !== ResourceFormStep.Description && (
            <StyledGridItemResourceTitle item>
              <StyledPageHeaderSubtitle component="span" variant="h3">
                {resourceTitle}
              </StyledPageHeaderSubtitle>
            </StyledGridItemResourceTitle>
          )}
        </Grid>
      </PageHeader>
      {resource && (
        <>
          {resource.features.dlr_status_published && (
            <StyledAlert data-testid="resource-published-warning" severity="warning">
              <AlertTitle>{t('common.nb')}</AlertTitle>
              {t('feedback.published_warning')}
            </StyledAlert>
          )}

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
                      <>
                        <SchemaPartTitle
                          error={hasTouchedError(
                            formikProps.errors,
                            formikProps.touched,
                            formikProps.values,
                            ResourceFormStep.Description
                          )}
                          stepTitle={t('resource.form_steps.description')}
                        />
                        <DescriptionFields
                          setResourceTitle={setResourceTitle}
                          setAllChangesSaved={(status: boolean) => {
                            setAllChangesSaved(status);
                          }}
                        />
                      </>
                    )}
                    {activeStep === ResourceFormStep.Contributors && (
                      <>
                        <SchemaPartTitle
                          error={hasTouchedError(
                            formikProps.errors,
                            formikProps.touched,
                            formikProps.values,
                            ResourceFormStep.Contributors
                          )}
                          stepTitle={t('resource.form_steps.contributors')}
                        />
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
                        {loadingError && (
                          <ErrorBanner error={loadingError} showAxiosStatusCode={true} userNeedsToBeLoggedIn={true} />
                        )}
                        <SchemaPartTitle
                          error={hasTouchedError(
                            formikProps.errors,
                            formikProps.touched,
                            formikProps.values,
                            ResourceFormStep.AccessAndLicense
                          )}
                          stepTitle={t('resource.form_steps.access_and_licence')}
                        />
                        <AccessAndLicenseStep
                          allChangesSaved={allChangesSaved}
                          setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
                          licenses={licenses}
                        />
                      </>
                    )}
                    {activeStep === ResourceFormStep.Contents && (
                      <div id={fileUploadPanelId}>
                        <SchemaPartTitle
                          error={hasTouchedError(
                            formikProps.errors,
                            formikProps.touched,
                            formikProps.values,
                            ResourceFormStep.Contents
                          )}
                          stepTitle={t('resource.form_steps.contents')}
                        />
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
                    {activeStep === ResourceFormStep.Preview && (
                      <>
                        <SchemaPartTitle
                          error={hasTouchedError(
                            formikProps.errors,
                            formikProps.touched,
                            formikProps.values,
                            ResourceFormStep.Preview
                          )}
                          stepTitle={t('resource.form_steps.preview')}
                        />
                        <PreviewPanel formikProps={formikProps} mainFileBeingUploaded={mainFileBeingUploaded} />
                        {!formikProps.isValid && <ResourceFormErrors />}
                      </>
                    )}
                    <ResourceFormActions
                      uppy={uppy}
                      activeStep={activeStep}
                      allChangesSaved={allChangesSaved}
                      setActiveStep={setActiveStep}
                      scrollToTop={scrollToTop}
                      mainFileBeingUploaded={mainFileBeingUploaded}
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
