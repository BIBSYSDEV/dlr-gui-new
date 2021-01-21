import React, { Dispatch, FC, SetStateAction } from 'react';
import { Uppy } from '../../../types/file.types';
import AdditionalFilesUpload from './AdditionalFilesUpload';
import { Content } from '../../../types/content.types';
import { ResourceCreationType } from '../../../types/resource.types';
import FileFields from './FileFields';
import LinkFields from './LinkFields';

interface ContentsStepProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
  additionalFileUploadUppy: Uppy;
  thumbnailUppy: Uppy;
  newContent: Content | undefined;
  resourceType: ResourceCreationType;
  newThumbnailContent: Content | undefined;
}

const ContentsStep: FC<ContentsStepProps> = ({
  uppy,
  setAllChangesSaved,
  additionalFileUploadUppy,
  newContent,
  resourceType,
  thumbnailUppy,
  newThumbnailContent,
}) => {
  return (
    <>
      {resourceType === ResourceCreationType.FILE && (
        <FileFields
          uppy={uppy}
          setAllChangesSaved={setAllChangesSaved}
          thumbnailUppy={thumbnailUppy}
          newThumbnailContent={newThumbnailContent}
        />
      )}
      {resourceType === ResourceCreationType.LINK && <LinkFields />}
      <AdditionalFilesUpload additionalFileUploadUppy={additionalFileUploadUppy} newContent={newContent} />
    </>
  );
};

export default ContentsStep;
