import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { ResourceFormStep, ResourceFormSteps, ResourceWrapper } from '../../types/resource.types';
import { FormikTouched, useFormikContext } from 'formik';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { hasTouchedError, mergeTouchedFields } from '../../utils/formik-helpers';
import CircularFileUploadProgress from '../../components/CircularFileUploadProgress';
import { Uppy } from '../../types/file.types';
import styled from 'styled-components';

const StyledDebugWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`;

interface ResourceFormNavigationHeaderProps {
  activeStep: ResourceFormStep;
  setActiveStep: (step: number) => void;
  uppy: Uppy;
}

const fileUploadPanelId = 'file-upload-panel';

const ResourceFormNavigationHeader: FC<ResourceFormNavigationHeaderProps> = ({ activeStep, setActiveStep, uppy }) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ResourceWrapper>();

  const handleStep = (step: number) => () => {
    const tabFields = {
      [ResourceFormStep.Description]: () => touchedDescriptionTabFields,
      [ResourceFormStep.AccessAndLicense]: () => touchedAccessAndLicenseTabFields,
      //...more
    };

    //console.log(`Changed step from ${activeStep} to ${step}`);

    const fieldsToTouchOnMount = [];
    fieldsToTouchOnMount.push(tabFields[ResourceFormStep.Description]());
    fieldsToTouchOnMount.push(tabFields[ResourceFormStep.AccessAndLicense]());
    const mergedFieldsOnMount = mergeTouchedFields(fieldsToTouchOnMount);
    formikContext.setTouched(mergedFieldsOnMount);
    setActiveStep(step);

    //if 1->4  (set touched 1-3)
    //if 4->1  (set touched 4)
  };

  const touchedDescriptionTabFields: FormikTouched<ResourceWrapper> = {
    resource: {
      features: {
        dlr_title: true,
        dlr_description: true,
        dlr_type: true,
      },
    },
  };
  const touchedAccessAndLicenseTabFields: FormikTouched<ResourceWrapper> = {
    resource: {
      licenses: true,
    },
  };

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
      <StyledDebugWrapper>
        <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid red', width: '40%' }}>
          ERRORS:
          {JSON.stringify(formikContext.errors, null, 2)}
        </pre>
        <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid cadetblue', width: '40%' }}>
          VALUES:
          {JSON.stringify(formikContext.values.resource.features, null, 2)}
        </pre>
      </StyledDebugWrapper>

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
