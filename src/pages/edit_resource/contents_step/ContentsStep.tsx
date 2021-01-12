import React, { Dispatch, FC, SetStateAction } from 'react';
import { Uppy } from '../../../types/file.types';
import FileFields from './FileFields';
import AdditionalFilesUpload from './AdditionalFilesUpload';
import { Content } from '../../../types/content.types';

interface ContentsStepProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
  additionalFileUploadUppy: Uppy;
  newContent: Content | undefined;
}

const ContentsStep: FC<ContentsStepProps> = ({ uppy, setAllChangesSaved, additionalFileUploadUppy, newContent }) => {
  return (
    <>
      <FileFields uppy={uppy} setAllChangesSaved={setAllChangesSaved} />
      <AdditionalFilesUpload additionalFileUploadUppy={additionalFileUploadUppy} newContent={newContent} />
    </>
  );
};

export default ContentsStep;
