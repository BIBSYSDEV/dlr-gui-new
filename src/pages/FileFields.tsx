import React, { FC, useEffect, useState } from 'react';
import { emptyFile, File, Uppy } from '../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../resources/images/placeholder.png';

interface FileFieldsProps {
  uppy: Uppy;
}

const StatusBarWrapper = styled.div`
  width: 100%;
`;

const MainFileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const MainFileImageWrapper = styled.div`
  margin-top: 1rem;
  margin-right: 2rem;
  max-height: 200px;
  max-width: 200px;
`;

const MainFileMetadata = styled.div`
  flex-grow: 1;
`;

const FileFields: FC<FileFieldsProps> = ({ uppy }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { t } = useTranslation();

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
      <Typography variant="h5">{t('resource.main_file')}</Typography>
      <MainFileWrapper>
        <MainFileImageWrapper>
          <img alt="resource" src={placeholderImage} />
        </MainFileImageWrapper>
        <MainFileMetadata>
          <TextField
            style={{ marginBottom: '1rem' }}
            variant="filled"
            fullWidth
            label={t('resource.main_file.name')}
            onBlur={(event) => {
              console.log('TODO: Save filename');
            }}
          />
          <StatusBarWrapper>
            <StatusBarComponent uppy={uppy} hideAfterFinish={false} />
          </StatusBarWrapper>
        </MainFileMetadata>
      </MainFileWrapper>

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
