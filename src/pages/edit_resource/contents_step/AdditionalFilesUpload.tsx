import React, { FC, useEffect, useState } from 'react';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy } from '../../../types/file.types';
import { Content } from '../../../types/content.types';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../../../types/resource.types';
import { StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import placeholderImage from '../../../resources/images/placeholder.png';
import { UppyFile } from '@uppy/core';
import LinearProgress from '@material-ui/core/LinearProgress';

interface AdditionalFilesUploadProps {
  additionalFileUploadUppy: Uppy;
  newContent: Content | undefined;
}
interface UploadPerFile {
  percentage: number;
  filename: string;
}

const filterAdditionalFiles = (contents: undefined | Content[]) => {
  if (contents) {
    return contents.slice(1).filter((content) => content.features.dlr_content_type === 'file') ?? [];
  } else {
    return [];
  }
};

const getIndividualProgress = (contents: Content[] | undefined, uppy: Uppy) => {
  const additionalFilesContents = filterAdditionalFiles(contents);
  const uploadedFiles: UploadPerFile[] = [];
  for (let i = 0; i < additionalFilesContents.length; i++) {
    const filename = additionalFilesContents[i].features.dlr_content ?? '';
    const percentage = uppy.getFiles().find((file) => file.meta.name === filename)?.progress?.percentage ?? 0;
    uploadedFiles.push({ filename: filename, percentage: percentage });
  }

  return uploadedFiles;
};

const AdditionalFilesUpload: FC<AdditionalFilesUploadProps> = ({ additionalFileUploadUppy, newContent }) => {
  const { values } = useFormikContext<ResourceWrapper>();
  const [contents, setContent] = useState<Content[]>(filterAdditionalFiles(values.resource.contents));
  const [uploadPercentageArray, setUploadPercentageArray] = useState<UploadPerFile[]>(
    getIndividualProgress(values.resource.contents, additionalFileUploadUppy)
  );

  useEffect(() => {
    additionalFileUploadUppy.on('upload-progress', (file: UppyFile, progress) => {
      setUploadPercentageArray((prevState) => {
        const index = prevState.findIndex((element) => element.filename === file.meta.name);
        if (index >= 0) {
          prevState[index].percentage = Math.ceil((progress.bytesUploaded / progress.bytesTotal) * 100);
        }
        return [...prevState];
      });
    });
  }, [additionalFileUploadUppy]);

  useEffect(() => {
    if (newContent && !values.resource.contents?.find((content) => content.identifier === newContent.identifier)) {
      if (values.resource.contents) {
        values.resource.contents.push(newContent);
      } else {
        values.resource.contents = [newContent];
      }
      setContent([...filterAdditionalFiles(values.resource.contents)]);
      setUploadPercentageArray((prevState) => {
        return [...prevState, { filename: newContent.features.dlr_content ?? '', percentage: 0 }];
      });
    }
  }, [newContent, values.resource]);

  return (
    <>
      {contents.map((content, index) => (
        <div key={content.identifier}>
          <img alt="resource" src={placeholderImage} />
          <p>{content.features.dlr_content}</p>
          <LinearProgress variant="determinate" value={uploadPercentageArray[index]?.percentage ?? 0} />
        </div>
      ))}
      <UppyDashboard uppy={additionalFileUploadUppy} />
    </>
  );
};

export default AdditionalFilesUpload;
