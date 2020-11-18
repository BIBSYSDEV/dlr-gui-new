import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { Uppy } from '../types/file.types';
import PublicationAccordion from './PublicationAccordion';
import UppyDashboard from '../components/UppyDashboard';

interface UploadRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void;
  uppy: Uppy;
}

const UploadRegistration: FC<UploadRegistrationProps> = ({ uppy, expanded, onChange }) => {
  const { t } = useTranslation();

  return (
    <PublicationAccordion
      dataTestId="new-registration-file"
      headerLabel={t('resource.start_with_uploading_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="registration-method-file">
      {uppy ? (
        <>
          <UppyDashboard uppy={uppy} />
        </>
      ) : null}
    </PublicationAccordion>
  );
};

export default UploadRegistration;
