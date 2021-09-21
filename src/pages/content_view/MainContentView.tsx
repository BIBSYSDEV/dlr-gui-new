import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import { getResource, getResourceContents } from '../../api/resourceApi';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { CircularProgress } from '@material-ui/core';
import ContentPreview from '../../components/ContentPreview';
import ErrorBanner from '../../components/ErrorBanner';
import styled from 'styled-components';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

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
  const [resourceLoadingError, setResourceLoadingError] = useState<Error | AxiosError>();

  useEffect(() => {
    const fetchData = async (resourceIdentifier: string) => {
      try {
        setIsLoadingResource(true);
        setResourceLoadingError(undefined);
        const tempResource = (await getResource(resourceIdentifier)).data;
        setResource(tempResource);
        tempResource.contents = await getResourceContents(resourceIdentifier);
      } catch (error) {
        setResourceLoadingError(handlePotentialAxiosError(error));
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (resourceIdentifier) {
      fetchData(resourceIdentifier);
    }
  }, [resourceIdentifier]);
  return isLoadingResource ? (
    <StyledProgressWrapper>
      <CircularProgress />
    </StyledProgressWrapper>
  ) : resourceLoadingError ? (
    <ErrorBanner error={resourceLoadingError} />
  ) : (
    <ContentWrapper height={height}>
      <ContentPreview resource={resource} isPreview={false} mainFileBeingUploaded={false} />
    </ContentWrapper>
  );
};

export default MainContentView;
