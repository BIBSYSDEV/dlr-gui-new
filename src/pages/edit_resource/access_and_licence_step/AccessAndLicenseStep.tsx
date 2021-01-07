import React, { FC, useState } from 'react';
import AccessFields from './AccessFields';
import LicenseFields from './LicenseFields';
import { License } from '../../../types/license.types';
import LicenseWizardFields from './LicenseWizardFields';
import ContainsOtherWorksFields from './ContainsOtherWorksFields';

interface AccessAndLicenseStepProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
}

const AccessAndLicenseStep: FC<AccessAndLicenseStepProps> = ({ setAllChangesSaved, licenses }) => {
  const [forceResetInLicenseWizard, setForceResetInLicenseWizard] = useState(false);
  const [containsOtherWorksFieldsSelectedCC, setContainsOtherWorksFieldsSelectedCC] = useState(false);
  return (
    <>
      <ContainsOtherWorksFields
        licenses={licenses}
        setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
        forceReset={() => setForceResetInLicenseWizard(!forceResetInLicenseWizard)}
        setHasSelectedCC={(selectedCC) => setContainsOtherWorksFieldsSelectedCC(selectedCC)}
      />
      <AccessFields
        setAllChangesSaved={(status: boolean) => {
          setAllChangesSaved(status);
        }}
      />
      {licenses && (
        <LicenseWizardFields
          forceReset={forceResetInLicenseWizard}
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
    </>
  );
};
export default AccessAndLicenseStep;
