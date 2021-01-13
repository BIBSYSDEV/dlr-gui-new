import React, { FC } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import { API_PATHS, API_URL } from '../utils/constants';

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
}

const Thumbnail: FC<thumbnailProps> = ({ resourceIdentifier, alt }) => {
  const addDefaultImage = (event: any) => {
    event.target.src = placeholderImage;
  };
  return (
    <StyledImage
      onError={(event) => addDefaultImage(event)}
      src={`${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resourceIdentifier}/thumbnails/default`}
      alt={alt}
    />
  );
};

export default Thumbnail;
