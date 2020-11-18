import React, { FC, useEffect, useState } from 'react';
import { emptyFile, File, Uppy } from '../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';

interface FileFieldsProps {
  uppy: Uppy;
}

const StatusBarWrapper = styled.div`
  width: 50%;
`;

const FileFields: FC<FileFieldsProps> = ({ uppy }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (uppy && !uppy.hasUploadSuccessEventListener) {
      uppy.on('upload-success', (file, response) => {
        const newFile = {
          ...emptyFile,
          identifier: response.uploadURL, // In reality an ID from completeMultipartUpload endpoint
          name: file.name,
          mimeType: file.type ?? '',
          size: file.size,
        };
        setUploadedFiles((files) => [newFile, ...files]);
      });
      // Avoid duplicating event listener
      uppy.hasUploadSuccessEventListener = true;
    }
  }, [uppy]);

  return (
    <>
      <StatusBarWrapper>
        <StatusBarComponent uppy={uppy} hideAfterFinish={false} />
      </StatusBarWrapper>
      Filer:
      {uploadedFiles.map((file) => {
        return (
          <div key={file.identifier}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(file, null, 2)}</pre>
          </div>
        );
      })}
    </>
  );
};

export default FileFields;
