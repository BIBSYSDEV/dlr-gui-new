import React, { FC, useState } from 'react';
import AccessFields from './AccessFields';
import LicenseFields from './LicenseFields';
import { License } from '../../../types/license.types';
import LicenseWizardFields from './LicenseWizardFields';
import ContainsOtherWorksFields from './ContainsOtherWorksFields';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import RequiredFieldInformation from '../../../components/RequiredFieldInformation';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

interface AccessAndLicenseStepProps {
  allChangesSaved: boolean;
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
}

const AccessAndLicenseStep: FC<AccessAndLicenseStepProps> = ({ allChangesSaved, setAllChangesSaved, licenses }) => {
  const [containsOtherWorksFieldsSelectedCC, setContainsOtherWorksFieldsSelectedCC] = useState(false);
  const { values } = useFormikContext<Resource>();
  const { t } = useTranslation();

  return (
    <>
      {values.features.dlr_status_published && <Alert severity="info">{t('license.cannot_change_on_published')}</Alert>}
      <ContainsOtherWorksFields
        licenses={licenses}
        setAllChangesSaved={(status: boolean) => setAllChangesSaved(status)}
        setHasSelectedCC={(selectedCC) => setContainsOtherWorksFieldsSelectedCC(selectedCC)}
      />
      <AccessFields
        setAllChangesSaved={(status: boolean) => {
          setAllChangesSaved(status);
        }}
      />
      {licenses && (
        <LicenseWizardFields
          allChangesSaved={allChangesSaved}
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
