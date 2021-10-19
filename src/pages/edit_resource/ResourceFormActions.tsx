import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import { publishResource, updateSearchIndex } from '../../api/resourceApi';
import { getStepLabel, Resource, ResourceFormStep } from '../../types/resource.types';
import { StyledContentWrapperMedium, StyledSchemaPart } from '../../components/styled/Wrappers';
import ErrorBanner from '../../components/ErrorBanner';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fileUploadPanelId, resourcePath } from '../../utils/constants';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import CircularFileUploadProgress from '../../components/CircularFileUploadProgress';
import { Uppy } from '../../types/file.types';

const PageWidthThresholdForButtons = '45rem';

const StyledButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'};
  @media (max-width: ${PageWidthThresholdForButtons}) {
    flex-direction: column-reverse;
    justify-content: center;
  }
`;

const StyledSaveButtonWrapper = styled.div`
  margin-right: 1rem;
  display: inline-block;
  @media (max-width: ${PageWidthThresholdForButtons}) {
    margin-right: 0;
    display: block;
  }
`;

const StyledRightSideButtonWrapper = styled.div`
  display: inline-block;
  @media (max-width: ${PageWidthThresholdForButtons}) {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
  }
`;

const StyledButtonText = styled.span``;

const UpperCaseButton = styled(Button)`
  text-transform: uppercase;
  margin-top: 1rem;
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  margin-right: 1rem;
`;

const StyledSchemaPartWithoutTopPadding = styled(StyledSchemaPart)`
  padding-top: 0.5rem;
`;

const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
  margin-left: 1rem;
`;

interface ResourceFormActionProps {
  activeStep: ResourceFormStep;
  allChangesSaved: boolean;
  setActiveStep: (step: ResourceFormStep) => void;
  scrollToTop: () => void;
  mainFileBeingUploaded: boolean;
  uppy: Uppy;
}

const ResourceFormAction: FC<ResourceFormActionProps> = ({
  activeStep,
  mainFileBeingUploaded,
  setActiveStep,
  scrollToTop,
  uppy,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [publishResourceError, setPublishResourceError] = useState<Error | AxiosError>();
  const { values, isValid } = useFormikContext<Resource>();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    scrollToTop();
  };

  const handlePublishResource = async () => {
    setPublishResourceError(undefined);
    try {
      await publishResource(values.identifier);
      history.push(`${resourcePath}/${values.identifier}`);
    } catch (error) {
      setPublishResourceError(handlePotentialAxiosError(error));
    }
  };

  const handleLeaveForm = async () => {
    values.features.dlr_status_published && updateSearchIndex(values.identifier);
    history.push(`${resourcePath}/user/current`);
  };

  return (
    <StyledSchemaPartWithoutTopPadding>
      <StyledContentWrapperMedium>
        <StyledButtonWrapper>
          <div>
            {activeStep > 0 ? (
              <UpperCaseButton
                data-testid="previous-step-button"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}>
                <StyledArrowBackIcon /> <StyledButtonText>{t(getStepLabel(activeStep - 1))}</StyledButtonText>
              </UpperCaseButton>
            ) : (
              <span />
            )}
          </div>
          <StyledRightSideButtonWrapper>
            {values.features.dlr_status_published ? (
              <UpperCaseButton
                data-testid="resource-close-button"
                variant="contained"
                color="primary"
                onClick={handleLeaveForm}>
                {t('common.close')}
              </UpperCaseButton>
            ) : (
              <>
                {mainFileBeingUploaded && (
                  <Typography>
                    <CircularFileUploadProgress
                      uppy={uppy}
                      describedById={fileUploadPanelId}
                      isUploadingNewFile={true}
                      shouldDisplayCompleted={false}
                    />
                    Du kan ikke publisere eller lagre og fortsette senere mens filer lastes opp
                  </Typography>
                )}
                <StyledSaveButtonWrapper>
                  <UpperCaseButton
                    disabled={mainFileBeingUploaded}
                    data-testid="leave-form-button"
                    variant="outlined"
                    onClick={handleLeaveForm}>
                    {t('resource.leave_form')}
                  </UpperCaseButton>
                </StyledSaveButtonWrapper>
                {activeStep === ResourceFormStep.Preview ? (
                  <UpperCaseButton
                    data-testid="resource-publish-button"
                    variant="contained"
                    color="primary"
                    onClick={handlePublishResource}
                    disabled={!isValid || mainFileBeingUploaded}>
                    {t('common.publish')}
                  </UpperCaseButton>
                ) : (
                  <UpperCaseButton
                    data-testid="next-step-button"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}>
                    <StyledButtonText>{t(getStepLabel(activeStep + 1))}</StyledButtonText>
                    <StyledArrowForwardIcon />
                  </UpperCaseButton>
                )}
              </>
            )}
          </StyledRightSideButtonWrapper>
        </StyledButtonWrapper>
        {publishResourceError && <ErrorBanner userNeedsToBeLoggedIn={true} error={publishResourceError} />}
      </StyledContentWrapperMedium>
    </StyledSchemaPartWithoutTopPadding>
  );
};

export default ResourceFormAction;
