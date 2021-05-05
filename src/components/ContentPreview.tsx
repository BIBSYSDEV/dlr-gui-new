import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography, CircularProgress } from '@material-ui/core';
import { Content, resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { API_PATHS, API_URL, GOOGLE_DOC_VIEWER, MICROSOFT_DOCUMENT_VIEWER } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import { determinePresentationMode } from '../utils/mime_type_utils';
import DownloadButton from './DownloadButton';
import { getResourceDefaultContent, getTextFileContents } from '../api/resourceApi';
import { Resource } from '../types/resource.types';
import { getSourceFromIframeString } from '../utils/iframe_utils';
import { getSoundCloudInformation } from '../api/externalApi';

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

const StyledBlockWrapper = styled.div`
  display: block;
`;

const windowsMaxRenderSize = 10000000;

interface ContentPreviewProps {
  resource: Resource;
  isPreview?: boolean;
}

const ContentPreview: FC<ContentPreviewProps> = ({ resource, isPreview = false }) => {
  const { t } = useTranslation();
  const [defaultContent, setDefaultContent] = useState<Content | null>(null);
  const [presentationMode, setPresentationMode] = useState<string>(
    determinePresentationMode(resource.contents.masterContent, resource)
  );
  const [isLoading, setLoading] = useState(false);
  const UrlGeneratedFromMasterContent = `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resource.contents.masterContent.identifier}/delivery?jwt=${localStorage.token}`;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const defaultContentResponse = await getResourceDefaultContent(resource.identifier);

        const newDefaultContent = defaultContentResponse.data;
        const newPresentationMode = determinePresentationMode(newDefaultContent, resource);
        if (newPresentationMode === SupportedFileTypes.Soundcloud && newDefaultContent.features.dlr_content_url) {
          const contentResponse = await getSoundCloudInformation(newDefaultContent.features.dlr_content_url);
          newDefaultContent.features.dlr_content_url = getSourceFromIframeString(contentResponse.data.html);
        }
        if (newPresentationMode === SupportedFileTypes.Text && newDefaultContent.features.dlr_content_url) {
          const contentFileResponse = await getTextFileContents(newDefaultContent.features.dlr_content_url);
        }
        setDefaultContent(newDefaultContent);
        setPresentationMode(newPresentationMode);
      } catch (error) {
        setDefaultContent(null);
        setPresentationMode(determinePresentationMode(resource.contents.masterContent, resource));
      } finally {
        setLoading(false);
      }
    };

    if (!isPreview) {
      fetch();
    }
  }, [isPreview, resource, resource.contents.masterContent, resource.identifier]);

  const getURL = () => {
    return defaultContent?.features.dlr_content_url ?? UrlGeneratedFromMasterContent;
  };

  const previewNotSupported = () => {
    return (
      !(presentationMode === resourceType.IMAGE) &&
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
      !(presentationMode === SupportedFileTypes.Spotify) &&
      !(presentationMode === SupportedFileTypes.LinkXFrameOptionsPresent) &&
      !(presentationMode === SupportedFileTypes.LinkSchemeHttp) &&
      !(presentationMode === SupportedFileTypes.Soundcloud)
    );
  };

  const previewIsRegularIframe = () => {
    return (
      presentationMode === SupportedFileTypes.Youtube ||
      presentationMode === SupportedFileTypes.Kaltura ||
      presentationMode === SupportedFileTypes.Vimeo ||
      presentationMode === SupportedFileTypes.Link ||
      presentationMode === SupportedFileTypes.MediaSite ||
      presentationMode === SupportedFileTypes.Spotify ||
      presentationMode === SupportedFileTypes.Soundcloud
    );
  };

  const hrefLinkUrl = (
    <Link target="_blank" rel="noopener noreferrer" href={resource.contents.masterContent.features.dlr_content}>
      {resource.contents.masterContent.features.dlr_content} ({t('resource.preview.open_in_new_tag')})
    </Link>
  );

  return (
    <>
      {!isLoading ? (
        <>
          {presentationMode === resourceType.IMAGE && <StyledImage src={getURL()} alt="Preview of resource" />}
          {presentationMode === resourceType.VIDEO && <StyledVideo src={getURL()} controls />}
          {previewNotSupported() && (
            <>
              <Typography>{t('resource.preview.preview_is_not_supported_for_file_format')}</Typography>
              <DownloadButton
                contentURL={getURL()}
                contentSize={resource.contents.masterContent.features.dlr_content_size}
              />
            </>
          )}
          {presentationMode === SupportedFileTypes.Audio && (
            <audio controls>
              <source
                src={getURL()}
                type={
                  defaultContent?.features.dlr_content_mime_type ??
                  resource.contents.masterContent.features.dlr_content_mime_type
                }
              />
            </audio>
          )}
          {presentationMode === SupportedFileTypes.Document && (
            <>
              {parseInt(
                defaultContent?.features.dlr_content_size_bytes ??
                  '' + resource.contents.masterContent.features.dlr_content_size_bytes
              ) < windowsMaxRenderSize ? (
                <iframe
                  title={t('resource.preview.preview_of_master_content')}
                  src={`${MICROSOFT_DOCUMENT_VIEWER}?src=${getURL()}`}
                  frameBorder="0"
                  height={'100%'}
                  width={'100%'}
                />
              ) : (
                <InformationAndDownloadWrapper>
                  <StyledAlert severity="info">{t('resource.preview.file_to_big')}</StyledAlert>
                  <DownloadButton
                    contentURL={getURL()}
                    contentSize={resource.contents.masterContent.features.dlr_content_size}
                  />
                </InformationAndDownloadWrapper>
              )}
            </>
          )}
          {presentationMode === SupportedFileTypes.PDF && (
            <iframe
              title={t('resource.preview.preview_of_master_content')}
              src={`${GOOGLE_DOC_VIEWER}?embedded=true&url=${getURL()}`}
              frameBorder="0"
              height={'100%'}
              width={'100%'}
              scrolling="no"
            />
          )}
          {presentationMode === SupportedFileTypes.Download && (
            <DownloadButton
              contentURL={getURL()}
              contentSize={resource.contents.masterContent.features.dlr_content_size}
            />
          )}
          {previewIsRegularIframe() && (
            <iframe
              title={t('resource.preview.preview_of_master_content')}
              src={getURL()}
              frameBorder="0"
              allowFullScreen
              height={'100%'}
              width={'100%'}
            />
          )}
          {(presentationMode === SupportedFileTypes.LinkSchemeHttp ||
            presentationMode === SupportedFileTypes.LinkXFrameOptionsPresent) && (
            <StyledBlockWrapper>
              <Typography gutterBottom variant="body1">
                {t('resource.preview.external_page')}: {hrefLinkUrl}
              </Typography>
              {presentationMode === SupportedFileTypes.LinkSchemeHttp && (
                <Typography variant="body1">{t('resource.preview.no_preview_security_reasons')}</Typography>
              )}
              {presentationMode === SupportedFileTypes.LinkXFrameOptionsPresent && (
                <Typography variant="body1">{t('resource.preview.no_preview_support_reasons')}</Typography>
              )}
            </StyledBlockWrapper>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ContentPreview;
