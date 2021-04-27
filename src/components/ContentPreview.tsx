import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@material-ui/core';
import { resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { Resource } from '../types/resource.types';
import { API_PATHS, API_URL } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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

const documentTypeFromMime = (resource: Resource): string => {
  switch (resource.contents.masterContent.features.dlr_content_mime_type) {
    case SupportedFileTypes.Document:
    case SupportedFileTypes.Image:
    case SupportedFileTypes.PDF:
    case SupportedFileTypes.Video:
    case SupportedFileTypes.Link:
    case SupportedFileTypes.Download:
    case SupportedFileTypes.MediaSite:
    case SupportedFileTypes.Youtube:
    case SupportedFileTypes.Vimeo:
      return resource.contents.masterContent.features.dlr_content_mime_type;
    case 'audio-service/x-spotify':
      return SupportedFileTypes.Spotify;
    case 'audio-service/x-soundcloud':
      return SupportedFileTypes.Soundcloud;
    case 'video-service/x-youtube':
      return SupportedFileTypes.Youtube;
    case 'video-service/x-twentythree':
      return SupportedFileTypes.Video23;
    case 'video-service/x-mediasite':
      return SupportedFileTypes.MediaSite;
    case 'video-service/x-kaltura':
      return SupportedFileTypes.Kaltura;
    case 'video-service/x-vimeo':
      return SupportedFileTypes.Vimeo;
    case 'text/html':
      return SupportedFileTypes.Link;
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/svg+xml':
      return SupportedFileTypes.Image;
    case 'application/pdf':
      return SupportedFileTypes.PDF;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.oasis.opendocument.presentation':
      return SupportedFileTypes.Document;
    case 'text/plain':
    case 'application/json':
    case 'application/xml':
      return SupportedFileTypes.Text;
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/x-matroska':
      return SupportedFileTypes.Video;
    case 'audio/mpeg':
    case 'audio/ogg':
      return SupportedFileTypes.Audio;
    default:
      return SupportedFileTypes.Download;
  }
};

const determinePresentationMode = (resource: Resource): string => {
  if (resource.contents.masterContent.features.dlr_content_type_link_scheme_http === 'true') {
    return 'linkSchemeHttp';
  } else if (
    (resource.contents.masterContent.features.dlr_content_type_link_header_http_x_frame_options === 'deny' ||
      resource.contents.masterContent.features.dlr_content_type_link_header_http_x_frame_options === 'sameorigin') &&
    resource.contents.masterContent.features.dlr_content_mime_type !== 'video-service/x-vimeo' &&
    resource.contents.masterContent.features.dlr_content_mime_type !== 'video-service/x-youtube'
  ) {
    return 'linkXFrameOptionsPresent';
  } else {
    return documentTypeFromMime(resource);
  }
};
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
          {parseInt(resource.contents.masterContent.features.dlr_content_size_bytes ?? '0') > windowsMaxRenderSize ? (
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
