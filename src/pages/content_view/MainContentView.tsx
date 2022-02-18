import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import { getResource, getResourceContents, getResourceDefaultContent } from '../../api/resourceApi';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { CircularProgress } from '@mui/material';
import ContentPreview from '../../components/ContentPreview';
import styled from 'styled-components';
import { Content, SupportedFileTypes } from '../../types/content.types';
import { determinePresentationMode } from '../../utils/mime_type_utils';

const ContentWrapper = styled.div<{ height: string }>`
  height: ${(props) => props.height};
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

interface ContentViewParams {
  resourceIdentifier: string;
}

const MainContentView = () => {
  const { resourceIdentifier } = useParams<ContentViewParams>();
  const [resource, setResource] = useState(emptyResource);
  const searchParams = new URLSearchParams(window.location.search);
  const height = searchParams.get('height') ?? '27rem';
  const [isLoadingResource, setIsLoadingResource] = useState(true);
  const [defaultContent, setDefaultContent] = useState<Content | null>(null);
  const [presentationMode, setPresentationMode] = useState<SupportedFileTypes>();
  const [contentUnavailable, setContentUnavailable] = useState(false);

  useEffect(() => {
    const fetchData = async (resourceIdentifier: string) => {
      try {
        setIsLoadingResource(true);
        const tempResource = (await getResource(resourceIdentifier)).data;
        setResource(tempResource);
        tempResource.contents = await getResourceContents(resourceIdentifier);
        const defaultContent = (await getResourceDefaultContent(resourceIdentifier)).data;
        setDefaultContent(defaultContent);
        setPresentationMode(determinePresentationMode(defaultContent));
      } catch (error) {
        setContentUnavailable(true);
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (resourceIdentifier) {
      fetchData(resourceIdentifier);
    }
  }, [resourceIdentifier, setDefaultContent, setPresentationMode, setContentUnavailable]);
  return isLoadingResource ? (
    <StyledProgressWrapper>
      <CircularProgress />
    </StyledProgressWrapper>
  ) : (
    <ContentWrapper height={height}>
      <ContentPreview
        resource={resource}
        isPreview={false}
        mainFileBeingUploaded={false}
        defaultContent={defaultContent}
        presentationMode={presentationMode}
        contentUnavailable={contentUnavailable}
      />
    </ContentWrapper>
  );
};

export default MainContentView;
