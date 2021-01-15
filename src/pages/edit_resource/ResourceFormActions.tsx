import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { publishResource } from '../../api/resourceApi';
import { getStepLabel, ResourceFormStep, ResourceWrapper } from '../../types/resource.types';
import { StyledContentWrapper, StyledSchemaPart } from '../../components/styled/Wrappers';
import ErrorBanner from '../../components/ErrorBanner';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const StyledButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'};
`;

const StyledFormStatusWrapper = styled.div`
  padding-right: 1rem;
  display: inline-block;
`;

const StyledRightSideButtonWrapper = styled.div`
  display: inline-block;
`;

const UpperCaseButton = styled(Button)`
  text-transform: uppercase;
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  margin-right: 1rem;
`;
const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
  margin-left: 1rem;
`;

interface ResourceFormActionProps {
  activeStep: ResourceFormStep;
  allChangesSaved: boolean;
  setActiveStep: (step: ResourceFormStep) => void;
}

const ResourceFormAction: FC<ResourceFormActionProps> = ({ activeStep, allChangesSaved, setActiveStep }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [publishResourceError, setPublishResourceError] = useState(false);
  const { values, dirty, isValid } = useFormikContext<ResourceWrapper>();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePublishResource = async () => {
    setPublishResourceError(false);
    try {
      await publishResource(values.resource.identifier);
      history.push(`/resource/${values.resource.identifier}`);
    } catch (error) {
      setPublishResourceError(true);
    }
  };

  return (
    <StyledSchemaPart>
      <StyledButtonWrapper>
        {activeStep > 0 ? (
          <UpperCaseButton variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
            <StyledArrowBackIcon /> {t(getStepLabel(activeStep - 1))}
          </UpperCaseButton>
        ) : (
          <span />
        )}
        <StyledRightSideButtonWrapper>
          <StyledFormStatusWrapper>
            {!allChangesSaved && <CircularProgress size="1rem" />}
            {allChangesSaved && !dirty && <Typography variant={'body1'}>{t('common.all_changes_saved')}</Typography>}
          </StyledFormStatusWrapper>
          {activeStep === ResourceFormStep.Preview ? (
            <UpperCaseButton variant="contained" color="primary" onClick={handlePublishResource} disabled={!isValid}>
              {t('common.publish')}
            </UpperCaseButton>
          ) : (
            <UpperCaseButton variant="contained" color="primary" onClick={handleNext}>
              {t(getStepLabel(activeStep + 1))}
              <StyledArrowForwardIcon />
            </UpperCaseButton>
          )}
        </StyledRightSideButtonWrapper>
      </StyledButtonWrapper>
      {publishResourceError && <ErrorBanner />}
    </StyledSchemaPart>
  );
};

export default ResourceFormAction;
