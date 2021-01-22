import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { getStepLabel, ResourceFormStep, ResourceFormSteps, ResourceWrapper } from '../../types/resource.types';
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

interface ResourceFormNavigationHeaderProps {
  activeStep: ResourceFormStep;
  setActiveStep: (step: number) => void;
  uppy: Uppy;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceFormNavigationHeader: FC<ResourceFormNavigationHeaderProps> = ({ activeStep, setActiveStep, uppy }) => {
  const { t } = useTranslation();
  const { values, touched, setTouched, errors } = useFormikContext<ResourceWrapper>();
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

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    const stepFields = {
      [ResourceFormStep.Preview]: () => touchedPreviewFields, //todo: find a way to remove this. should not be needed
      [ResourceFormStep.Description]: () => touchedDescriptionFields,
      [ResourceFormStep.AccessAndLicense]: () => touchedAccessAndLicenseFields,
      [ResourceFormStep.Contents]: () => touchedContentsFields(valuesRef.current.resource.contents),
      [ResourceFormStep.Contributors]: () =>
        touchedContributorsFields(valuesRef.current.resource.contributors, valuesRef.current.resource.creators),
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
      <pre style={{ maxWidth: '90%' }}>PER2: {JSON.stringify(errors, null, 2)}</pre>
      <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
        {ResourceFormSteps.map((step, index) => {
          return (
            <Step key={step} completed={false}>
              <StepButton onClick={handleStep(index)} data-testid={`step-navigation-${index}`}>
                <StepLabel error={hasTouchedError(errors, touched, values, index)}>
                  {t(getStepLabel(step))}
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
