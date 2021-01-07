import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { ResourceFormStep, ResourceFormSteps, ResourceWrapper } from '../../types/resource.types';
import { useFormikContext } from 'formik';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
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

// const StyledDebugWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   justify-content: space-evenly;
// `;

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
    console.log(`Changed step from ${activeStep} to ${step}`);
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
        console.log(`...Adding touched to step  ${stepNumber} `);
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

  const getStepLabel = (step: ResourceFormStep) => {
    switch (step) {
      case ResourceFormStep.Description:
        return t('resource.form_steps.description');
      case ResourceFormStep.Contributors:
        return t('resource.form_steps.contributors');
      case ResourceFormStep.Contents:
        return t('resource.form_steps.files');
      case ResourceFormStep.AccessAndLicense:
        return t('resource.form_steps.access_and_licence');
      case ResourceFormStep.Preview:
        return t('resource.form_steps.preview');
    }
  };

  return (
    <StyledContentWrapper>
      {/*<StyledDebugWrapper>*/}
      {/*  <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid red', width: '40%' }}>*/}
      {/*    ERRORS:*/}
      {/*    {JSON.stringify(errors, null, 2)}*/}
      {/*  </pre>*/}
      {/*  <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid cadetblue', width: '40%' }}>*/}
      {/*    TOUCHED:*/}
      {/*    {JSON.stringify(touched, null, 2)}*/}
      {/*  </pre>*/}
      {/*</StyledDebugWrapper>*/}

      <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
        {ResourceFormSteps.map((step, index) => {
          return (
            <Step key={step} completed={false}>
              <StepButton onClick={handleStep(index)}>
                <StepLabel error={hasTouchedError(errors, touched, values, index)}>
                  {getStepLabel(step)}
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
    </StyledContentWrapper>
  );
};

export default ResourceFormNavigationHeader;
