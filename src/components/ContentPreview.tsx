import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { Resource } from '../types/resource.types';
import { API_PATHS, API_URL, GOOGLE_DOC_VIEWER, MICROSOFT_DOCUMENT_VIEWER } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import { determinePresentationMode } from '../utils/mime_type_utils';
import DownloadButton from './DownloadButton';

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
        !(presentationMode === SupportedFileTypes.Audio) &&
        !(presentationMode === SupportedFileTypes.PDF) &&
        !(presentationMode === SupportedFileTypes.Kaltura) &&
        !(presentationMode === SupportedFileTypes.Youtube) &&
        !(presentationMode === SupportedFileTypes.MediaSite) &&
        !(presentationMode === SupportedFileTypes.Link) &&
        !(presentationMode === SupportedFileTypes.Vimeo) &&
        !(presentationMode === SupportedFileTypes.Download) &&
        !(presentationMode === SupportedFileTypes.Spotify) && (
          <>
            <Typography>{t('resource.preview.preview_is_not_supported_for_file_format')}</Typography>
            <DownloadButton contentURL={contentURL} />
          </>
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
              title={t('resource.preview.preview_of_master_content')}
              src={`${MICROSOFT_DOCUMENT_VIEWER}?src=${contentURL}`}
              frameBorder="0"
              height={'100%'}
              width={'100%'}
            />
          ) : (
            <InformationAndDownloadWrapper>
              <StyledAlert severity="info">{t('resource.preview.file_to_big')}</StyledAlert>
              <DownloadButton contentURL={contentURL} />
            </InformationAndDownloadWrapper>
          )}
        </>
      )}
      {presentationMode === SupportedFileTypes.PDF && (
        <iframe
          title={t('resource.preview.preview_of_master_content')}
          src={`${GOOGLE_DOC_VIEWER}?embedded=true&url=${contentURL}`}
          frameBorder="0"
          height={'100%'}
          width={'100%'}
          scrolling="no"
        />
      )}
      {(presentationMode === SupportedFileTypes.Youtube ||
        presentationMode === SupportedFileTypes.Kaltura ||
        presentationMode === SupportedFileTypes.Vimeo ||
        presentationMode === SupportedFileTypes.Link ||
        presentationMode === SupportedFileTypes.MediaSite ||
        presentationMode === SupportedFileTypes.Spotify) && (
        <iframe
          title={t('resource.preview.preview_of_master_content')}
          src={contentURL}
          frameBorder="0"
          height={'100%'}
          width={'100%'}
        />
      )}
      {presentationMode === SupportedFileTypes.Download && <DownloadButton contentURL={contentURL} />}
    </>
  );
};

export default ContentPreview;
