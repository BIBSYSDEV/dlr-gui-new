import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, CircularProgress, Paper } from '@material-ui/core';
import { Content, resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { API_PATHS, API_URL } from '../utils/constants';
import { determinePresentationMode } from '../utils/mime_type_utils';
import DownloadButton from './DownloadButton';
import { getResourceDefaultContent, getTextFileContents } from '../api/resourceApi';
import { Resource } from '../types/resource.types';
import { getSourceFromIframeString } from '../utils/iframe_utils';

import ContentIframe from './ContentIframe';
import DocumentPreview from './DocumentPreview';
import LinkPreviewNotPossible from './LinkPreviewNotPossible';
import { getSoundCloudInformation, getTwentyThreeVideoInformation } from '../api/externalApi';

const StyledImage = styled.img`
  max-height: 100%;
  max-width: 100%;
`;

const StyledVideo = styled.video`
  max-height: 100%;
  max-width: 100%;
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

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
  const [contentUnavailable, setContentUnavailable] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let newDefaultContent: Content | undefined = undefined;
      try {
        newDefaultContent = (await getResourceDefaultContent(resource.identifier)).data;
      } catch (error) {
        setContentUnavailable(true);
      }
      if (newDefaultContent) {
        try {
          const newPresentationMode = determinePresentationMode(newDefaultContent);

          if (
            newPresentationMode === SupportedFileTypes.TwentyThreeVideo &&
            newDefaultContent.features.dlr_content_url
          ) {
            const twentyThreeVideoResponse = await getTwentyThreeVideoInformation(
              newDefaultContent.features.dlr_content_url
            );
            newDefaultContent.features.dlr_content_url = getSourceFromIframeString(twentyThreeVideoResponse.data.html);
          }
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
        }
      }

      setLoading(false);
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
      presentationMode === SupportedFileTypes.Soundcloud ||
      presentationMode === SupportedFileTypes.TwentyThreeVideo
    );
  };

  return (
    <>
      {!isLoading && !mainFileBeingUploaded ? (
        <>
          {!contentUnavailable ? (
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
                <DocumentPreview defaultContent={defaultContent} resource={resource} usageURL={usageURL} />
              )}
              {presentationMode === SupportedFileTypes.PDF && (
                <object data={usageURL} type="application/pdf" height={'100%'} width={'100%'}>
                  <ContentIframe src={usageURL} />
                  <Typography>{t('resource.preview.browser_does_not_support_pdf_viewing')}</Typography>
                  <DownloadButton
                    fileName={resource.contents.masterContent.features.dlr_content}
                    contentURL={usageURL}
                    contentSize={resource.contents.masterContent.features.dlr_content_size}
                  />
                </object>
              )}
              {presentationMode === SupportedFileTypes.Download && (
                <DownloadButton
                  fileName={resource.contents.masterContent.features.dlr_content}
                  contentURL={usageURL}
                  contentSize={resource.contents.masterContent.features.dlr_content_size}
                />
              )}
              {previewIsRegularIframe() && <ContentIframe src={usageURL} />}
              {(presentationMode === SupportedFileTypes.LinkSchemeHttp ||
                presentationMode === SupportedFileTypes.LinkXFrameOptionsPresent) && (
                <LinkPreviewNotPossible resource={resource} presentationMode={presentationMode} />
              )}
              {presentationMode === SupportedFileTypes.Text && (
                <StyledPaper elevation={2}>
                  <Typography data-testid="text-file-content-typography">{contentText}</Typography>
                </StyledPaper>
              )}
            </>
          ) : (
            <Typography>{t('resource.preview.no_preview_authorization_reasons')}</Typography>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ContentPreview;
