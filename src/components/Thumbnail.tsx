import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import { API_PATHS, API_URL } from '../utils/constants';
import useInterval from '../utils/useInterval';
import { Colors } from '../themes/mainTheme';

const StyledImage = styled.img`
  min-width: 11rem;
  max-width: 11rem;
  max-height: 7rem;
  border: 1px solid ${Colors.DescriptionPageGradientColor1};
`;

const pollingDelayMilliseconds = 500;

const urlGenerator = (resourceOrContentIdentifier: string) => {
  return `${API_URL}${
    API_PATHS.guiBackendResourcesContentPath
  }/${resourceOrContentIdentifier}/thumbnails/default?t=${new Date().getTime().toString()}`;
};

interface thumbnailProps {
  resourceOrContentIdentifier: string;
  alt: string;
  needsToStartToPoll?: boolean;
}

const Thumbnail: FC<thumbnailProps> = ({ resourceOrContentIdentifier, alt, needsToStartToPoll = false }) => {
  const [url, setUrl] = useState(urlGenerator(resourceOrContentIdentifier));
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
    setUrl(urlGenerator(resourceOrContentIdentifier));
  }, calculateShouldUseInterval());

  useEffect(() => {
    setUrl(urlGenerator(resourceOrContentIdentifier));
  }, [resourceOrContentIdentifier]);

  return (
    <>
      <StyledImage
        onError={(event) => addDefaultImage(event)}
        src={url}
        alt={alt}
        data-testid={`thumbnail-${resourceOrContentIdentifier}`}
      />
    </>
  );
};

export default Thumbnail;
