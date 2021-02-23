import React, { FC } from 'react';
import styled from 'styled-components';
import NC from '../resources/images/creative_commons_logos/nc.svg';
import SA from '../resources/images/creative_commons_logos/sa.svg';
import ND from '../resources/images/creative_commons_logos/nd.svg';
import Zero from '../resources/images/creative_commons_logos/zero.svg';
import CCLogo from '../resources/images/creative_commons_logos/cc.svg';
import BY from '../resources/images/creative_commons_logos/by.svg';

const StyledLogoWrapper = styled.span`
  display: flex;
  align-items: flex-start;
  margin-left: 0.3rem;
`;

const StyledImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.1rem;
`;

const StyledImageWrapper = styled.span`
  margin-left: 0.3rem;
`;

export enum CCLogoImageRole {
  Link = 'link',
  Option = 'option',
}

interface CClogoImageProps {
  licenseCode: string;
}

const CClogoImage: FC<CClogoImageProps> = ({ licenseCode }) => {
  return (
    <StyledLogoWrapper>
      {licenseCode}
      <StyledImageWrapper>
        {licenseCode.toLowerCase().includes('cc') && <StyledImage src={CCLogo} alt="" />}
        {licenseCode.toLowerCase().includes('by') && <StyledImage src={BY} alt="" />}
        {licenseCode.toLowerCase().includes('nc') && <StyledImage src={NC} alt="" />}
        {licenseCode.toLowerCase().includes('nd') && <StyledImage src={ND} alt="" />}
        {licenseCode.toLowerCase().includes('sa') && <StyledImage src={SA} alt="" />}
        {licenseCode.toLowerCase().includes('1') && <StyledImage src={Zero} alt="" />}
      </StyledImageWrapper>
    </StyledLogoWrapper>
  );
};

export default CClogoImage;
