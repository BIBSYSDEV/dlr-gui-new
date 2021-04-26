import React, { FC, useState } from 'react';
import AccessFields from './AccessFields';
import LicenseFields from './LicenseFields';
import { License } from '../../../types/license.types';
import LicenseWizardFields from './LicenseWizardFields';
import ContainsOtherWorksFields from './ContainsOtherWorksFields';
import { StyledContentWrapper, StyledSchemaPart } from '../../../components/styled/Wrappers';
import { Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import RequiredFieldInformation from '../../../components/RequiredFieldInformation';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

interface AccessAndLicenseStepProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
}

const AccessAndLicenseStep: FC<AccessAndLicenseStepProps> = ({ setAllChangesSaved, licenses }) => {
  const [forceResetInLicenseWizard, setForceResetInLicenseWizard] = useState(false);
  const [containsOtherWorksFieldsSelectedCC, setContainsOtherWorksFieldsSelectedCC] = useState(false);
  const { values } = useFormikContext<Resource>();
  const { t } = useTranslation();

  return (
    <>
      <StyledSchemaPart>
        <StyledContentWrapper>
          <Typography variant="h3" component="h2">
            {values.features.dlr_title}
          </Typography>
        </StyledContentWrapper>
      </StyledSchemaPart>
      {values.features.dlr_status_published && (
        <Alert severity="warning">{t('license.cannot_change_on_published')}</Alert>
      )}
      <ContainsOtherWorksFields
        licenses={licenses}
        setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
        forceResetInLicenseWizard={() => setForceResetInLicenseWizard(!forceResetInLicenseWizard)}
        setHasSelectedCC={(selectedCC) => setContainsOtherWorksFieldsSelectedCC(selectedCC)}
      />
      <AccessFields
        setAllChangesSaved={(status: boolean) => {
          setAllChangesSaved(status);
        }}
      />
      {licenses && (
        <LicenseWizardFields
          forceResetInLicenseWizard={forceResetInLicenseWizard}
          containsOtherWorksFieldsSelectedCC={containsOtherWorksFieldsSelectedCC}
          licenses={licenses}
          setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
        />
      )}
      {licenses && (
        <LicenseFields
          setAllChangesSaved={(status: boolean) => {
            setAllChangesSaved(status);
          }}
          licenses={licenses}
        />
      )}
      <RequiredFieldInformation />
    </>
  );
};

export default AccessAndLicenseStep;
