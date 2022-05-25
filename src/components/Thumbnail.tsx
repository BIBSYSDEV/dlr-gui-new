import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import placeholderImage from '../resources/images/placeholder.png';
import BIImage from '../resources/images/institution_logos/bi.png';
import NTNUImage from '../resources/images/institution_logos/ntnu.png';
import OsloMetImage from '../resources/images/institution_logos/oslomet.png';
import UiBImage from '../resources/images/institution_logos/uib.png';
import HVLImage from '../resources/images/institution_logos/hvl.png';
import UnitImage from '../resources/images/institution_logos/unit.png';
import SiktImage from '../resources/images/institution_logos/sikt.png';
import UiTImage from '../resources/images/institution_logos/uit.png';
import USNImage from '../resources/images/institution_logos/usn.png';
import vidImage from '../resources/images/institution_logos/vid.png';
import mockThumbnail from '../resources/images/mockThumbnail.png';
import { API_PATHS, API_URL, USE_MOCK_DATA } from '../utils/constants';
import useInterval from '../utils/useInterval';
import { Colors } from '../themes/mainTheme';
import { UserInstitution } from '../types/user.types';

interface Props {
  small: boolean;
  color: string;
}

const StyledImageWrapper: any = styled.div<Props>`
  min-height: ${(props: any) => (props.small ? '5rem' : '7rem')};
  height: ${(props: any) => (props.small ? '5rem' : '7rem')};
  min-width: ${(props: any) => (props.small ? '7.85rem' : '11rem')};
  width: ${(props: any) => (props.small ? '7.85rem' : '11rem')};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  border: 1px solid ${Colors.DescriptionPageGradientColor2};
`;

const StyledImage: any = styled.img<Props>`
  max-height: ${(props: any) => (props.small ? '5rem' : '7rem')};
  max-width: ${(props: any) => (props.small ? '7.85rem' : '11rem')};
`;

const UnitBanner = '#405363';
const UiBBanner = '#cf3c3a';

const pollingDelayMilliseconds = 500;

const urlGenerator = (resourceOrContentIdentifier: string) => {
  return USE_MOCK_DATA
    ? mockThumbnail
    : `${API_URL}${
        API_PATHS.guiBackendResourcesContentPath
      }/${resourceOrContentIdentifier}/thumbnails/default?t=${new Date().getTime().toString()}`;
};

interface thumbnailProps {
  resourceOrContentIdentifier: string;
  needsToStartToPoll?: boolean;
  institution?: string;
  small?: boolean;
}

const Thumbnail: FC<thumbnailProps> = ({
  resourceOrContentIdentifier,
  needsToStartToPoll = false,
  institution = '',
  small = false,
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
      case UserInstitution.VID.toLowerCase():
        event.target.src = vidImage;
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
      case UserInstitution.Sikt.toLowerCase():
        event.target.src = SiktImage;
        break;
      case UserInstitution.UiT.toLowerCase():
        event.target.src = UiTImage;
        break;
      case UserInstitution.USN.toLowerCase():
        event.target.src = USNImage;
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
    <StyledImageWrapper color={backgroundColor} small={small}>
      <StyledImage
        onError={(event: any) => addDefaultImage(event)}
        src={url}
        small={small}
        alt={''}
        aria-hidden="true"
        data-testid={`thumbnail-${resourceOrContentIdentifier}`}
      />
    </StyledImageWrapper>
  );
};

export default Thumbnail;
