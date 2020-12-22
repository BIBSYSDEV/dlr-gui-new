import React, { FC } from 'react';
import AccessFields from './AccessFields';
import LicenseFields from './LicenseFields';
import { License } from '../types/license.types';
import ContainsOtherWorksFields from './ContainsOtherWorksFields';

interface AccessAndLicenseStepProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
}

const AcessAndLicenseStep: FC<AccessAndLicenseStepProps> = ({ setAllChangesSaved, licenses }) => {
  return (
    <>
      <ContainsOtherWorksFields setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)} />
      <AccessFields
        setAllChangesSaved={(status: boolean) => {
          setAllChangesSaved(status);
        }}
      />
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
export default AcessAndLicenseStep;
