import React, { Dispatch, FC, SetStateAction } from 'react';
import { Uppy } from '../../../types/file.types';
import AdditionalFilesUpload from './AdditionalFilesUpload';
import { Content } from '../../../types/content.types';
import { ResourceCreationType } from '../../../types/resource.types';
import FileFields from './FileFields';
import LinkFields from './LinkFields';
import RequiredFieldInformation from '../../../components/RequiredFieldInformation';

interface ContentsStepProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
  additionalFileUploadUppy: Uppy;
  thumbnailUppy: Uppy;
  newContent: Content | undefined;
  resourceType: ResourceCreationType;
  newThumbnailContent: Content | undefined;
  newThumbnailIsReady: () => void;
}

const ContentsStep: FC<ContentsStepProps> = ({
  uppy,
  setAllChangesSaved,
  additionalFileUploadUppy,
  newContent,
  resourceType,
  thumbnailUppy,
  newThumbnailContent,
  newThumbnailIsReady,
}) => {
  return (
    <>
      {resourceType === ResourceCreationType.FILE && (
        <FileFields
          uppy={uppy}
          newThumbnailIsReady={newThumbnailIsReady}
          setAllChangesSaved={setAllChangesSaved}
          thumbnailUppy={thumbnailUppy}
          newThumbnailContent={newThumbnailContent}
        />
      )}
      {resourceType === ResourceCreationType.LINK && <LinkFields />}
      <AdditionalFilesUpload additionalFileUploadUppy={additionalFileUploadUppy} newContent={newContent} />
      {resourceType === ResourceCreationType.FILE && <RequiredFieldInformation />}
    </>
  );
};

export default ContentsStep;
