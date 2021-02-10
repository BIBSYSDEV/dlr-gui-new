import React, { FC } from 'react';
import styled from 'styled-components';
import CC from '../resources/images/creative_commons_logos/cc.xlarge.png';
import BY from '../resources/images/creative_commons_logos/by.xlarge.png';
import NC from '../resources/images/creative_commons_logos/nc.xlarge.png';
import SA from '../resources/images/creative_commons_logos/sa.xlarge.png';
import ND from '../resources/images/creative_commons_logos/nd.xlarge.png';
import Zero from '../resources/images/creative_commons_logos/zero.xlarge.png';

const StyledLogoWrapper = styled.div`
  display: flex;
`;

const StyledImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`;

interface CClogoImageProps {
  licenseCode: string;
}

const CClogoImage: FC<CClogoImageProps> = ({ licenseCode }) => {
  return (
    <StyledLogoWrapper>
      {licenseCode.toLowerCase().includes('cc') && <StyledImage src={CC} alt="cc" />}
      {licenseCode.toLowerCase().includes('by') && <StyledImage src={BY} alt="by" />}
      {licenseCode.toLowerCase().includes('nc') && <StyledImage src={NC} alt="nc" />}
      {licenseCode.toLowerCase().includes('nd') && <StyledImage src={ND} alt="nd" />}
      {licenseCode.toLowerCase().includes('sa') && <StyledImage src={SA} alt="sa" />}
      {licenseCode.toLowerCase().includes('1') && <StyledImage src={Zero} alt="sa" />}
    </StyledLogoWrapper>
  );
};

export default CClogoImage;
