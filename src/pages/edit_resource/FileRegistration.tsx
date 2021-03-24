import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import PublishIcon from '@material-ui/icons/Publish';

import { Uppy } from '../../types/file.types';
import PublicationAccordion from './PublicationAccordion';
import UppyDashboard from '../../components/UppyDashboard';

interface FileRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void;
  uppy: Uppy;
}

const FileRegistration: FC<FileRegistrationProps> = ({ uppy, expanded, onChange }) => {
  const { t } = useTranslation();

  return (
    <PublicationAccordion
      dataTestId="new-resource-file"
      headerLabel={t('resource.start_with_uploading_file')}
      icon={<PublishIcon />}
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

export default FileRegistration;
