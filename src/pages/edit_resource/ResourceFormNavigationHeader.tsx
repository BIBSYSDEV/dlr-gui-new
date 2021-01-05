import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { Resource, ResourceFormStep, ResourceFormSteps } from '../../types/resource.types';
import { FormikTouched, useFormikContext } from 'formik';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { hasTouchedError, mergeTouchedFields } from '../../utils/formik-helpers';
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
  const formikContext = useFormikContext<Resource>();

  const handleStep = (step: number) => () => {
    console.log('ACTIVE-STEP', activeStep);

    const tabFields = {
      [ResourceFormStep.Description]: () => touchedDescriptionTabFields,
      //...more
    };

    console.log('changed step from', activeStep);
    console.log('changed step to', step);

    const fieldsToTouchOnMount = [];
    fieldsToTouchOnMount.push(tabFields[ResourceFormStep.Description]());
    const mergedFieldsOnMount = mergeTouchedFields(fieldsToTouchOnMount);
    formikContext.setTouched(mergedFieldsOnMount);

    setActiveStep(step);

    //if 1->4  (set touched 1-3)
    //if 4->1  (set touched 4)
  };

  const touchedDescriptionTabFields: FormikTouched<Resource> = {
    features: {
      dlr_title: true,
    },
  };

  useEffect(() => {
    // All fields for each tab
  }, [activeStep]);

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
      <Stepper style={{ width: '100%' }} activeStep={activeStep} nonLinear alternativeLabel>
        {ResourceFormSteps.map((step, index) => {
          return (
            <Step key={step} completed={false}>
              <StepButton onClick={handleStep(index)}>
                <StepLabel error={hasTouchedError(formikContext, index)}>
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
