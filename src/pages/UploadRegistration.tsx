import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { File } from '../types/file.types';
import useUppy from '../utils/useUppy';
import FileUploader from '../components/FileUploader';
import PublicationAccordion from './PublicationAccordion';

interface UploadRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void;
}

const UploadRegistration: FC<UploadRegistrationProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation('registration');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const uppy = useUppy();

  return (
    <PublicationAccordion
      dataTestId="new-registration-file"
      headerLabel={t('registration:registration.start_with_uploading_file')}
      icon={<CloudDownloadIcon />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="registration-method-file">
      {uppy ? (
        <>
          <FileUploader uppy={uppy} addFile={(newFile: File) => setUploadedFiles((files) => [newFile, ...files])} />
          {uploadedFiles.map((file) => (
            <div key={file.identifier}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(file, null, 2)}</pre>
            </div>
          ))}
        </>
      ) : null}
    </PublicationAccordion>
  );
};

export default UploadRegistration;
