import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { Resource } from '../types/resource.types';
import { API_PATHS, API_URL } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { determinePresentationMode } from '../utils/mime_type_utils';

const StyledImage = styled.img`
  height: 100%;
`;

const StyledVideo = styled.video`
  height: 100%;
`;

const InformationAndDownloadWrapper = styled.div`
  display: block;
  width: 27rem;
  text-align: center;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 2rem;
`;

const windowsMaxRenderSize = 10000000;

interface ContentPreviewProps {
  resource: Resource;
}

const ContentPreview: FC<ContentPreviewProps> = ({ resource }) => {
  const { t } = useTranslation();
  const presentationMode = determinePresentationMode(resource);
  const contentURL = `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resource.contents.masterContent.identifier}/delivery?jwt=${localStorage.token}`;

  return (
    <>
      {presentationMode === resourceType.IMAGE && <StyledImage src={contentURL} alt="Preview of resource" />}
      {presentationMode === resourceType.VIDEO && <StyledVideo src={contentURL} controls />}
      {!(presentationMode === resourceType.IMAGE) &&
        !(presentationMode === resourceType.VIDEO) &&
        !(presentationMode === SupportedFileTypes.Document) &&
        !(presentationMode === SupportedFileTypes.Audio) && (
          <Typography>{t('resource.preview_not_supported_filetype')}</Typography>
        )}
      {presentationMode === SupportedFileTypes.Audio && (
        <audio controls>
          <source src={contentURL} type={resource.contents.masterContent.features.dlr_content_mime_type} />
        </audio>
      )}
      {presentationMode === SupportedFileTypes.Document && (
        <>
          {parseInt(resource.contents.masterContent.features.dlr_content_size_bytes ?? '0') < windowsMaxRenderSize ? (
            <iframe
              title="document1"
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${contentURL}`}
              frameBorder="0"
              height={'100%'}
              width={'100%'}
            />
          ) : (
            <InformationAndDownloadWrapper>
              <StyledAlert severity="info">{t('file_to_big')}</StyledAlert>
              <Button
                href={contentURL}
                size="large"
                fullWidth={false}
                startIcon={<CloudDownloadIcon />}
                variant="contained"
                color="primary">
                {t('common.download')}
              </Button>
            </InformationAndDownloadWrapper>
          )}
        </>
      )}
    </>
  );
};

export default ContentPreview;
