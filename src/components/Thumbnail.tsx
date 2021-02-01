import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import { API_PATHS, API_URL } from '../utils/constants';
import useInterval from '../utils/useInterval';

const StyledImage = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 7rem;
    max-height: 7rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    width: 5rem;
    max-height: 5rem;
  }
`;

interface thumbnailProps {
  resourceIdentifier: string;
  alt: string;
  tempContentIdentifier?: string;
  needsToStartToPoll?: boolean;
}

const pollingDelayMilliseconds = 500;

const urlGenerator = (tempContentIdentifier: string | undefined, resourceIdentifier: string) => {
  return tempContentIdentifier
    ? `${API_URL}${
        API_PATHS.guiBackendResourcesContentPath
      }/${tempContentIdentifier}/thumbnails/default?t=${new Date().getTime().toString()}`
    : `${API_URL}${
        API_PATHS.guiBackendResourcesContentPath
      }/${resourceIdentifier}/thumbnails/default?t=${new Date().getTime().toString()}`;
};

const Thumbnail: FC<thumbnailProps> = ({
  resourceIdentifier,
  alt,
  tempContentIdentifier,
  needsToStartToPoll = false,
}) => {
  const [url, setUrl] = useState(urlGenerator(tempContentIdentifier, resourceIdentifier));
  const addDefaultImage = (event: any) => {
    event.target.src = placeholderImage;
  };

  const calculateShouldUseInterval = () => {
    if (!needsToStartToPoll) {
      return null;
    } else {
      return pollingDelayMilliseconds;
    }
  };

  useInterval(() => {
    setUrl(urlGenerator(tempContentIdentifier, resourceIdentifier));
  }, calculateShouldUseInterval());

  useEffect(() => {
    setUrl(urlGenerator(tempContentIdentifier, resourceIdentifier));
  }, [tempContentIdentifier, resourceIdentifier]);

  return (
    <>
      <StyledImage onError={(event) => addDefaultImage(event)} src={url} alt={alt} />
    </>
  );
};

export default Thumbnail;
