import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@material-ui/core';
import { Content, resourceType, SupportedFileTypes } from '../types/content.types';
import styled from 'styled-components';
import { API_PATHS, API_URL, GOOGLE_DOC_VIEWER, MICROSOFT_DOCUMENT_VIEWER } from '../utils/constants';
import { Alert } from '@material-ui/lab';
import { determinePresentationMode } from '../utils/mime_type_utils';
import DownloadButton from './DownloadButton';
import { getResourceDefaultContent } from '../api/resourceApi';
import { Resource } from '../types/resource.types';

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
  isPreview?: boolean;
}

const ContentPreview: FC<ContentPreviewProps> = ({ resource, isPreview = false }) => {
  const { t } = useTranslation();
  const [defaultContent, setDefaultContent] = useState<Content | null>(null);
  const [presentationMode, setPresentationMode] = useState<string>(
    determinePresentationMode(resource.contents.masterContent)
  );
  const [isLoading, setLoading] = useState(false);
  const UrlGeneratedFromMasterContent = `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resource.contents.masterContent.identifier}/delivery?jwt=${localStorage.token}`;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const defaultContentResponse = await getResourceDefaultContent(resource.identifier);
        setDefaultContent(defaultContentResponse.data);
        setPresentationMode(determinePresentationMode(defaultContentResponse.data));
      } catch (error) {
        setDefaultContent(null);
        setPresentationMode(determinePresentationMode(resource.contents.masterContent));
      } finally {
        setLoading(false);
      }
    };

    if (!isPreview) {
      fetch();
    }
  }, [isPreview, resource.contents.masterContent, resource.identifier]);

  const getURL = () => {
    return defaultContent?.features.dlr_content_url ?? UrlGeneratedFromMasterContent;
  };

  return (
    <>
      {!isLoading ? (
        <>
          {presentationMode === resourceType.IMAGE && <StyledImage src={getURL()} alt="Preview of resource" />}
          {presentationMode === resourceType.VIDEO && <StyledVideo src={getURL()} controls />}
          {!(presentationMode === resourceType.IMAGE) &&
            !(presentationMode === resourceType.VIDEO) &&
            !(presentationMode === SupportedFileTypes.Document) &&
            !(presentationMode === SupportedFileTypes.Audio) &&
            !(presentationMode === SupportedFileTypes.PDF) && (
              <>
                <Typography>{t('resource.preview.preview_is_not_supported_for_file_format')}</Typography>
                <DownloadButton contentURL={getURL()} />
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
                  <DownloadButton contentURL={getURL()} />
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
          {presentationMode === SupportedFileTypes.Download && <DownloadButton contentURL={getURL()} />}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ContentPreview;
