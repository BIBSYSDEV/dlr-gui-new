import React, { FC } from 'react';
import { StyledContentWrapper, StyledSchemaPart } from '../components/styled/Wrappers';
import { Typography } from '@material-ui/core';
import AccessFields from './AccessFields';
import LicenseFields from './LicenseFields';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../types/resource.types';
import { License } from '../types/license.types';

interface AccessAndLicenseStepProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
}

const AcessAndLicenseStep: FC<AccessAndLicenseStepProps> = ({ setAllChangesSaved, licenses }) => {
  const { values } = useFormikContext<ResourceWrapper>();
  return (
    <>
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
