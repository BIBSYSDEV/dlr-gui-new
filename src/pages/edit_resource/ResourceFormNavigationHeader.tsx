import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { getStepLabel, Resource, ResourceFormStep, ResourceFormSteps } from '../../types/resource.types';
import { useFormikContext } from 'formik';
import { StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import {
  hasTouchedError,
  mergeTouchedFields,
  touchedAccessAndLicenseFields,
  touchedContentsFields,
  touchedContributorsFields,
  touchedDescriptionFields,
  touchedPreviewFields,
} from '../../utils/formik-helpers';
import CircularFileUploadProgress from '../../components/CircularFileUploadProgress';
import { Uppy } from '../../types/file.types';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

interface ResourceFormNavigationHeaderProps {
  activeStep: ResourceFormStep;
  setActiveStep: (step: number) => void;
  uppy: Uppy;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceFormNavigationHeader: FC<ResourceFormNavigationHeaderProps> = ({ activeStep, setActiveStep, uppy }) => {
  const { t } = useTranslation();
  const { values, touched, setTouched, errors } = useFormikContext<Resource>();
  const noTouchedStep = -1;
  type HighestTouchedTab = ResourceFormStep | typeof noTouchedStep;
  const highestPreviouslyTouchedStepRef = useRef<HighestTouchedTab>(noTouchedStep);

  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  const StyledStepTypography = styled(Typography)`
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  `;

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    const stepFields = {
      [ResourceFormStep.Preview]: () => touchedPreviewFields, //todo: find a way to remove this. should not be needed
      [ResourceFormStep.Description]: () => touchedDescriptionFields,
      [ResourceFormStep.AccessAndLicense]: () =>
        touchedAccessAndLicenseFields(valuesRef.current.containsOtherPeoplesWork),
      [ResourceFormStep.Contents]: () =>
        touchedContentsFields(valuesRef.current.contents, valuesRef.current.features.dlr_content_type),
      [ResourceFormStep.Contributors]: () =>
        touchedContributorsFields(valuesRef.current.contributors, valuesRef.current.creators),
      //These are functions because the form is dynamic
    };
    if (activeStep > highestPreviouslyTouchedStepRef.current) {
      // Avoid setting tabs to touched all the time
      if (activeStep > highestPreviouslyTouchedStepRef.current) {
        highestPreviouslyTouchedStepRef.current = activeStep;
      }
      const fieldsToTouchOnMount = [touchedRef.current];
      for (let stepNumber = ResourceFormStep.Description; stepNumber < activeStep; stepNumber++) {
        fieldsToTouchOnMount.push(stepFields[stepNumber]());
      }
      const mergedFieldsOnMount = mergeTouchedFields(fieldsToTouchOnMount);
      setTouched(mergedFieldsOnMount);
    }

    // Set fields on current tab to touched
    return () => {
      const mergedFieldsOnUnmount = mergeTouchedFields([touchedRef.current, stepFields[activeStep]()]);
      setTouched(mergedFieldsOnUnmount);
    };
  }, [setTouched, activeStep]);

  return (
    <StyledContentWrapperMedium>
      <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
        {ResourceFormSteps.map((step, index) => {
          return (
            <Step key={step} completed={false}>
              <StepButton
                onClick={handleStep(index)}
                data-testid={`step-navigation-${index}`}
                title={
                  hasTouchedError(errors, touched, values, index)
                    ? `${t(getStepLabel(step))} ${t('common.error')}`
                    : `${t(getStepLabel(step))}`
                }>
                <StepLabel error={hasTouchedError(errors, touched, values, index)}>
                  <StyledStepTypography>{t(getStepLabel(step))}</StyledStepTypography>
                  {hasTouchedError(errors, touched, values, index) && (
                    <Typography color="error" variant="caption">
                      {t('common.error')}
                    </Typography>
                  )}
                  {step === ResourceFormStep.Contents && (
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
    </StyledContentWrapperMedium>
  );
};

export default ResourceFormNavigationHeader;
