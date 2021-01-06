import React, { FC } from 'react';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy } from '../../../types/file.types';

interface AdditionalFilesUploadProps {
  additionalFileUploadUppy: Uppy;
}

const AdditionalFilesUpload: FC<AdditionalFilesUploadProps> = ({ additionalFileUploadUppy }) => {
  return (
    <>
      <UppyDashboard uppy={additionalFileUploadUppy} />
    </>
  );
};

export default AdditionalFilesUpload;
