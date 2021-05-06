import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography, CircularProgress, Paper } from '@material-ui/core';
import { Content, resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { API_PATHS, API_URL, MICROSOFT_DOCUMENT_VIEWER } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import { determinePresentationMode } from '../utils/mime_type_utils';
import DownloadButton from './DownloadButton';
import { getResourceDefaultContent, getTextFileContents } from '../api/resourceApi';
import { Resource } from '../types/resource.types';
import { getSourceFromIframeString } from '../utils/iframe_utils';
import { getSoundCloudInformation } from '../api/externalApi';

const StyledImage = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

const StyledVideo = styled.video`
  max-height: 100%;
  max-width: 100%;
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

const StyledPaper = styled(Paper)`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const windowsMaxRenderSize = 10000000;

interface ContentPreviewProps {
  resource: Resource;
  isPreview?: boolean;
  mainFileBeingUploaded?: boolean;
}

const ContentPreview: FC<ContentPreviewProps> = ({ resource, isPreview = false, mainFileBeingUploaded = false }) => {
  const { t } = useTranslation();
  const [defaultContent, setDefaultContent] = useState<Content | null>(null);
  const [presentationMode, setPresentationMode] = useState<string>(
    determinePresentationMode(resource.contents.masterContent)
  );
  const [isLoading, setLoading] = useState(false);
  const [contentText, setContentText] = useState('');
  const [usageURL, setUsageURL] = useState(
    `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resource.contents.masterContent.identifier}/delivery?jwt=${localStorage.token}`
  );

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const defaultContentResponse = await getResourceDefaultContent(resource.identifier);

        const newDefaultContent = defaultContentResponse.data;
        const newPresentationMode = determinePresentationMode(newDefaultContent);

        if (newPresentationMode === SupportedFileTypes.Soundcloud && newDefaultContent.features.dlr_content_url) {
          const contentResponse = await getSoundCloudInformation(newDefaultContent.features.dlr_content_url);
          newDefaultContent.features.dlr_content_url = getSourceFromIframeString(contentResponse.data.html);
        }
        if (newPresentationMode === SupportedFileTypes.Text && newDefaultContent.features.dlr_content_url) {
          const contentFileResponse = await getTextFileContents(newDefaultContent.features.dlr_content_url);
          setContentText(contentFileResponse.data);
        }
        if (newDefaultContent.features.dlr_content_url) {
          setUsageURL(newDefaultContent.features.dlr_content_url);
        }
        setDefaultContent(newDefaultContent);
        setPresentationMode(newPresentationMode);
      } catch (error) {
        setDefaultContent(null);
        setPresentationMode(determinePresentationMode(resource.contents.masterContent));
      } finally {
        setLoading(false);
      }
    };

    if (!isPreview || !mainFileBeingUploaded) {
      fetch();
    }
  }, [isPreview, mainFileBeingUploaded, resource, resource.contents.masterContent, resource.identifier]);

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
      {!isLoading && !mainFileBeingUploaded ? (
        <>
          {presentationMode === resourceType.IMAGE && <StyledImage src={usageURL} alt="Preview of resource" />}
          {presentationMode === resourceType.VIDEO && <StyledVideo src={usageURL} controls />}
          {presentationMode === SupportedFileTypes.Audio && (
            <audio controls>
              <source
                src={usageURL}
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
                  src={`${MICROSOFT_DOCUMENT_VIEWER}?src=${usageURL}`}
                  frameBorder="0"
                  height={'100%'}
                  width={'100%'}
                />
              ) : (
                <InformationAndDownloadWrapper>
                  <StyledAlert severity="info">{t('resource.preview.file_to_big')}</StyledAlert>
                  <DownloadButton
                    contentURL={usageURL}
                    contentSize={resource.contents.masterContent.features.dlr_content_size}
                  />
                </InformationAndDownloadWrapper>
              )}
            </>
          )}
          {presentationMode === SupportedFileTypes.PDF && (
            <object data={usageURL} type="application/pdf" height={'100%'} width={'100%'}>
              <iframe
                title={t('resource.preview.preview_of_master_content')}
                height={'100%'}
                width={'100%'}
                src={usageURL}
                frameBorder="0"
              />
              <Typography>{t('resource.preview.browser_does_not_support_pdf_viewing')}</Typography>
              <DownloadButton
                contentURL={usageURL}
                contentSize={resource.contents.masterContent.features.dlr_content_size}
              />
            </object>
          )}
          {presentationMode === SupportedFileTypes.Download && (
            <DownloadButton
              contentURL={usageURL}
              contentSize={resource.contents.masterContent.features.dlr_content_size}
            />
          )}
          {previewIsRegularIframe() && (
            <iframe
              title={t('resource.preview.preview_of_master_content')}
              src={usageURL}
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
          {presentationMode === SupportedFileTypes.Text && (
            <StyledPaper elevation={2}>
              <Typography>{contentText}</Typography>
            </StyledPaper>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ContentPreview;
