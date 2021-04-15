import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import BIImage from '../resources/images/institution_logos/bi.png';
import NTNUImage from '../resources/images/institution_logos/ntnu.png';
import OsloMetImage from '../resources/images/institution_logos/ntnu.png';
import UiBImage from '../resources/images/institution_logos/uib.png';
import HVLImage from '../resources/images/institution_logos/hvl.png';
import UnitImage from '../resources/images/institution_logos/unit.png';
import UiTImage from '../resources/images/institution_logos/uit.png';
import { API_PATHS, API_URL } from '../utils/constants';
import useInterval from '../utils/useInterval';
import { Colors } from '../themes/mainTheme';
import { UserInstitution } from '../types/user.types';

const StyledImageWrapper = styled.div`
  min-width: 11rem;
  min-height: 7rem;
  width: 11rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  border: 1px solid ${Colors.DescriptionPageGradientColor1};
`;

const StyledImage = styled.img`
  max-height: 7rem;
  max-width: 11rem;
`;

const UnitBanner = '#405363';
const UiBBanner = '#cf3c3a';

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
  institution?: string;
}

const Thumbnail: FC<thumbnailProps> = ({
  resourceOrContentIdentifier,
  alt,
  needsToStartToPoll = false,
  institution = '',
}) => {
  const [url, setUrl] = useState(urlGenerator(resourceOrContentIdentifier));
  const [backgroundColor, setBackgroundColor] = useState('white');

  const addDefaultImage = (event: any) => {
    switch (institution?.toLowerCase().trim()) {
      case UserInstitution.NTNU.toLowerCase():
        event.target.src = NTNUImage;
        break;
      case UserInstitution.HVL.toLowerCase():
        event.target.src = HVLImage;
        break;
      case UserInstitution.OsloMet.toLowerCase():
        event.target.src = OsloMetImage;
        break;
      case UserInstitution.UiB.toLowerCase():
        setBackgroundColor(UiBBanner);
        event.target.src = UiBImage;
        break;
      case UserInstitution.BI.toLowerCase():
        event.target.src = BIImage;
        break;
      case UserInstitution.Unit.toLowerCase():
        event.target.src = UnitImage;
        setBackgroundColor(UnitBanner);
        break;
      case UserInstitution.UiT.toLowerCase():
        event.target.src = UiTImage;
        break;
      default:
        event.target.src = placeholderImage;
        break;
    }
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
    <StyledImageWrapper color={backgroundColor}>
      <StyledImage
        onError={(event) => addDefaultImage(event)}
        src={url}
        alt={alt}
        aria-hidden="true"
        data-testid={`thumbnail-${resourceOrContentIdentifier}`}
      />
    </StyledImageWrapper>
  );
};

export default Thumbnail;
