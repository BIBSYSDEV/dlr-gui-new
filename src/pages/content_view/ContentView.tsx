import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import { getContentById, getContentPresentationData, getResource, getResourceContents } from '../../api/resourceApi';
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
import { calculatePreferredWidAndHeigFromPresentationMode, DefaultContentSize } from '../../utils/Preview.utils';

const ContentWrapper = styled.div<{ height: string }>`
  height: ${(props) => props.height};
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

interface ContentViewParams {
  resourceIdentifier: string;
  contentIdentifier: string;
}

const ContentView = () => {
  const { resourceIdentifier, contentIdentifier } = useParams<ContentViewParams>();
  const [resource, setResource] = useState(emptyResource);
  const [height, setHeight] = useState(DefaultContentSize.medium.height);
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
        const content = (await getContentById(resourceIdentifier, contentIdentifier)).data;
        const contentPresentation = (await getContentPresentationData(contentIdentifier)).data;
        content.features.dlr_content_url = contentPresentation.features.dlr_content_url;
        setContent(content);
        const presentationMode = determinePresentationMode(content);
        setPresentationMode(presentationMode);
        const searchParams = new URLSearchParams(window.location.search);
        setHeight(
          searchParams.get('height') ?? calculatePreferredWidAndHeigFromPresentationMode(presentationMode).medium.height
        );
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

    if (resourceIdentifier) {
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
    <ContentWrapper height={height}>
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
