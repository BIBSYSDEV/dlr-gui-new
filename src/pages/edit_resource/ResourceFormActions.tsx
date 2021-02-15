import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { publishResource } from '../../api/resourceApi';
import { getStepLabel, ResourceFormStep, Resource } from '../../types/resource.types';
import { StyledContentWrapperMedium, StyledSchemaPart } from '../../components/styled/Wrappers';
import ErrorBanner from '../../components/ErrorBanner';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
}

const ResourceFormAction: FC<ResourceFormActionProps> = ({ activeStep, setActiveStep }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [publishResourceError, setPublishResourceError] = useState(false);
  const { values, isValid } = useFormikContext<Resource>();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePublishResource = async () => {
    setPublishResourceError(false);
    try {
      await publishResource(values.identifier);
      history.push(`/resource/${values.identifier}`);
    } catch (error) {
      setPublishResourceError(true);
    }
  };

  const handleLeaveForm = async () => {
    history.push('/resources/user/current');
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
            <StyledSaveButtonWrapper>
              <UpperCaseButton data-testid="leave-form-button" variant="outlined" onClick={handleLeaveForm}>
                {t('resource.leave_form')}
              </UpperCaseButton>
            </StyledSaveButtonWrapper>
            {activeStep === ResourceFormStep.Preview ? (
              <UpperCaseButton
                data-testid="publish-button"
                variant="contained"
                color="primary"
                onClick={handlePublishResource}
                disabled={!isValid}>
                {t('common.publish')}
              </UpperCaseButton>
            ) : (
              <UpperCaseButton data-testid="next-step-button" variant="contained" color="primary" onClick={handleNext}>
                <StyledButtonText>{t(getStepLabel(activeStep + 1))}</StyledButtonText>
                <StyledArrowForwardIcon />
              </UpperCaseButton>
            )}
          </StyledRightSideButtonWrapper>
        </StyledButtonWrapper>
        {publishResourceError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      </StyledContentWrapperMedium>
    </StyledSchemaPartWithoutTopPadding>
  );
};

export default ResourceFormAction;
