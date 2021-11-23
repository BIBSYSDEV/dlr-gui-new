import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, CircularProgress, Paper } from '@mui/material';
import { Content, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import DownloadButton from './DownloadButton';
import { getTextFileContents } from '../api/resourceApi';
import { Resource } from '../types/resource.types';
import { getSourceFromIframeString } from '../utils/iframe_utils';
import ContentIframe from './ContentIframe';
import DocumentPreview from './DocumentPreview';
import LinkPreviewNotPossible from './LinkPreviewNotPossible';
import { getSoundCloudInformation, getTwentyThreeVideoInformation } from '../api/externalApi';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import LoginButton from '../layout/header/LoginButton';

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

const StyledLoginInformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ContentPreviewProps {
  resource: Resource;
  isPreview?: boolean;
  mainFileBeingUploaded?: boolean;
  defaultContent: Content | null;
  presentationMode: SupportedFileTypes | undefined;
  contentUnavailable: boolean;
}

const ContentPreview: FC<ContentPreviewProps> = ({
  resource,
  isPreview = false,
  mainFileBeingUploaded = false,
  defaultContent,
  presentationMode,
  contentUnavailable,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setLoading] = useState(false);
  const [contentText, setContentText] = useState('');
  const [usageURL, setUsageURL] = useState('');
  const [contentPresentationError, setContentPresentationError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (defaultContent) {
        try {
          if (presentationMode === SupportedFileTypes.TwentyThreeVideo && defaultContent.features.dlr_content_url) {
            const twentyThreeVideoResponse = await getTwentyThreeVideoInformation(
              defaultContent.features.dlr_content_url
            );
            defaultContent.features.dlr_content_url = getSourceFromIframeString(twentyThreeVideoResponse.data.html);
          }
          if (presentationMode === SupportedFileTypes.Soundcloud && defaultContent.features.dlr_content_url) {
            const contentResponse = await getSoundCloudInformation(defaultContent.features.dlr_content_url);
            defaultContent.features.dlr_content_url = getSourceFromIframeString(contentResponse.data.html);
          }
          if (presentationMode === SupportedFileTypes.Text && defaultContent.features.dlr_content_url) {
            const contentFileResponse = await getTextFileContents(defaultContent.features.dlr_content_url);
            setContentText(contentFileResponse.data);
          }
          if (defaultContent.features.dlr_content_url) {
            setUsageURL(defaultContent.features.dlr_content_url);
          }
        } catch (error) {
          setContentPresentationError(true);
        }
      }
      setLoading(false);
    };

    if (!isPreview || !mainFileBeingUploaded) {
      fetch();
    }
  }, [isPreview, mainFileBeingUploaded, resource, defaultContent, presentationMode, contentPresentationError]);

  const previewIsRegularIframe = () => {
    return (
      presentationMode === SupportedFileTypes.Youtube ||
      presentationMode === SupportedFileTypes.Panopto ||
      presentationMode === SupportedFileTypes.Kaltura ||
      presentationMode === SupportedFileTypes.Vimeo ||
      presentationMode === SupportedFileTypes.Link ||
      presentationMode === SupportedFileTypes.MediaSite ||
      presentationMode === SupportedFileTypes.Spotify ||
      presentationMode === SupportedFileTypes.Soundcloud ||
      presentationMode === SupportedFileTypes.Transistor ||
      presentationMode === SupportedFileTypes.TwentyThreeVideo
    );
  };

  return (
    <>
      {!isLoading && !mainFileBeingUploaded ? (
        <>
          {!contentUnavailable && !contentPresentationError ? (
            <>
              {presentationMode === SupportedFileTypes.Image && (
                <StyledImage src={usageURL} alt="Preview of resource" />
              )}
              {presentationMode === SupportedFileTypes.Video && <StyledVideo src={usageURL} controls />}
              {presentationMode === SupportedFileTypes.Audio && (
                <audio controls>
                  <source src={usageURL} type={defaultContent?.features.dlr_content_mime_type} />
                </audio>
              )}
              {presentationMode === SupportedFileTypes.Document && (
                <DocumentPreview defaultContent={defaultContent} resource={resource} usageURL={usageURL} />
              )}
              {presentationMode === SupportedFileTypes.PDF && (
                <object data={usageURL} type="application/pdf" height={'100%'} width={'100%'}>
                  <ContentIframe src={usageURL} />
                  <Typography>{t('resource.preview.browser_does_not_support_pdf_viewing')}</Typography>
                  <DownloadButton content={resource.contents.masterContent} />
                </object>
              )}
              {presentationMode === SupportedFileTypes.Download && (
                <DownloadButton content={resource.contents.masterContent} />
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
            <>
              <StyledLoginInformationWrapper>
                {user.id ? (
                  <Typography>{t('resource.preview.your_user_does_not_have_access')}</Typography>
                ) : (
                  <>
                    <Typography gutterBottom>{t('resource.preview.no_preview_authorization_reasons')}</Typography>
                    <LoginButton variant="contained" />
                  </>
                )}
              </StyledLoginInformationWrapper>
            </>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ContentPreview;
