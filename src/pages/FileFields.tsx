import React, { FC, useEffect, useState } from 'react';
import { emptyFile, File, Uppy } from '../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Paper, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../resources/images/placeholder.png';

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

interface FileFieldsProps {
  uppy: Uppy;
}

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
          <div style={{ marginTop: '1rem', height: '2rem', marginBottom: '1rem' }}>{uploadedFiles[0]?.name}</div>
          <Paper>
            <StatusBarWrapper>
              <StatusBarComponent uppy={uppy} hideAfterFinish={false} />
            </StatusBarWrapper>
          </Paper>
        </MainFileMetadata>
      </MainFileWrapper>
    </>
  );
};

export default FileFields;
