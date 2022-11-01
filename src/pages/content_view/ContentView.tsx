import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import { getContentPresentationData, getResource, getResourceContents } from '../../api/resourceApi';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { CircularProgress } from '@mui/material';
import ContentPreview from '../../components/ContentPreview';
import ErrorBanner from '../../components/ErrorBanner';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { Content, SupportedFileTypes } from '../../types/content.types';
import { determinePresentationMode } from '../../utils/mime_type_utils';
import { StatusCode } from '../../utils/constants';

const ContentWrapper = styled.div`
  height: auto;
  display: flex;
  width: auto;
  min-width: 50%;
  align-items: center;
  justify-content: center;
`;

interface ContentViewParams {
  resourceIdentifier: string;
  contentIdentifier: string;
}

const ContentView = () => {
  const { resourceIdentifier, contentIdentifier } = useParams<ContentViewParams>();
  const [resource, setResource] = useState(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState(true);
  const [resourceLoadingError, setResourceLoadingError] = useState<Error | AxiosError>();
  const [content, setContent] = useState<Content | null>(null);
  const [presentationMode, setPresentationMode] = useState<SupportedFileTypes>();
  const [contentUnavailable, setContentUnavailable] = useState(false);
  const [hasErrorAndErrorIsNot401, sethasErrorAndErrorIsNot401] = useState(false);

  useEffect(() => {
    const fetchData = async (resourceIdentifier: string) => {
      try {
        setIsLoadingResource(true);
        setResourceLoadingError(undefined);
        sethasErrorAndErrorIsNot401(false);
        const tempResource = (await getResource(resourceIdentifier)).data;
        setResource(tempResource);
        tempResource.contents = await getResourceContents(resourceIdentifier);
        const contentPresentation = (await getContentPresentationData(contentIdentifier)).data;
        setContent(contentPresentation);
        const presentationMode = determinePresentationMode(contentPresentation);
        setPresentationMode(presentationMode);
      } catch (error) {
        setContentUnavailable(true);
        setResourceLoadingError(handlePotentialAxiosError(error));
        if (axios.isAxiosError(error) && error.response?.status !== StatusCode.UNAUTHORIZED) {
          sethasErrorAndErrorIsNot401(true);
        }
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (resourceIdentifier && contentIdentifier) {
      fetchData(resourceIdentifier);
    }
  }, [contentIdentifier, resourceIdentifier, setContent, setPresentationMode, setContentUnavailable]);

  return isLoadingResource ? (
    <StyledProgressWrapper>
      <CircularProgress />
    </StyledProgressWrapper>
  ) : hasErrorAndErrorIsNot401 ? (
    <ErrorBanner error={resourceLoadingError} />
  ) : (
    <ContentWrapper>
      <ContentPreview
        resource={resource}
        isPreview={false}
        mainFileBeingUploaded={false}
        content={content}
        presentationMode={presentationMode}
        contentUnavailable={contentUnavailable}
      />
    </ContentWrapper>
  );
};

export default ContentView;
