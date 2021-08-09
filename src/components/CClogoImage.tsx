import React, { FC } from 'react';
import styled from 'styled-components';
import NC from '../resources/images/creative_commons_logos/nc.svg';
import SA from '../resources/images/creative_commons_logos/sa.svg';
import ND from '../resources/images/creative_commons_logos/nd.svg';
import Zero from '../resources/images/creative_commons_logos/zero.svg';
import CCLogo from '../resources/images/creative_commons_logos/cc.svg';
import BY from '../resources/images/creative_commons_logos/by.svg';
import { Typography } from '@material-ui/core';

const StyledLogoWrapper = styled.span`
  display: flex;
  align-items: flex-start;
`;

const StyledImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.1rem;
`;

const StyledImageWrapper = styled.div`
  margin-left: 0.3rem;
  white-space: nowrap;
`;

const StyledLicenseCode = styled(Typography)`
  margin-left: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2rem;
`;

const StyledFirstLicenseCode = styled(Typography)`
  margin-left: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2rem;
  min-width: 8rem;
`;
export enum CCLogoImageRole {
  Link = 'link',
  Option = 'option',
}

interface CClogoImageProps {
  licenseCode: string;
  showCCImage?: boolean;
  textFirst?: boolean;
}

const CClogoImage: FC<CClogoImageProps> = ({ licenseCode, showCCImage = true, textFirst = false }) => {
  return (
    <StyledLogoWrapper>
      {textFirst && (
        <StyledFirstLicenseCode>{licenseCode.replace(' 4.0', '').replace(' 1.0', '')}</StyledFirstLicenseCode>
      )}
      <StyledImageWrapper>
        {licenseCode.toLowerCase().includes('cc') && showCCImage && <StyledImage src={CCLogo} alt="" />}
        {licenseCode.toLowerCase().includes('by') && <StyledImage src={BY} alt="" />}
        {licenseCode.toLowerCase().includes('nc') && <StyledImage src={NC} alt="" />}
        {licenseCode.toLowerCase().includes('nd') && <StyledImage src={ND} alt="" />}
        {licenseCode.toLowerCase().includes('sa') && <StyledImage src={SA} alt="" />}
        {licenseCode.toLowerCase().includes('1') && <StyledImage src={Zero} alt="" />}
      </StyledImageWrapper>
      {!textFirst && <StyledLicenseCode>{licenseCode.replace(' 4.0', '').replace(' 1.0', '')}</StyledLicenseCode>}
    </StyledLogoWrapper>
  );
};

export default CClogoImage;
