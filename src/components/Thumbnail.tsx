import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import { API_PATHS, API_URL } from '../utils/constants';
import { ref } from 'yup';

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
}

const Thumbnail: FC<thumbnailProps> = ({ resourceIdentifier, alt, tempContentIdentifier = false }) => {
  const [url, setUrl] = useState(
    tempContentIdentifier
      ? `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${tempContentIdentifier}/thumbnails/default`
      : `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resourceIdentifier}/thumbnails/default`
  );
  const addDefaultImage = (event: any) => {
    event.target.src = placeholderImage;
  };

  useEffect(() => {
    setUrl(
      tempContentIdentifier
        ? `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${tempContentIdentifier}/thumbnails/default`
        : `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resourceIdentifier}/thumbnails/default`
    );
  }, [tempContentIdentifier]);

  return (
    <>
      <StyledImage onError={(event) => addDefaultImage(event)} src={url} alt={alt} />
    </>
  );
};

export default Thumbnail;
