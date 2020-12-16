import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';

interface LicenseProps {
  license: License;
}

const StyledWrapper = styled.div`
  padding-top: 1rem;
`;

const StyledA = styled.a`
  display: flex;
  padding: 0.2rem;
`;
const StyledTypography = styled(Typography)`
  padding-left: 0.2rem;
`;

const LicenseCard: FC<LicenseProps> = (props) => {
  const language = i18next.language;
  return (
    <StyledWrapper>
      <div>
        {props.license.features?.dlr_license_code && (
          <Typography variant="h6">{props.license.features?.dlr_license_name_no}</Typography>
        )}
      </div>
      {language.includes('NO') && (
        <>
          <Typography variant="body1">{props.license.features?.dlr_license_description_no}</Typography>
          <StyledA
            target="_blank"
            href={props.license.features?.dlr_license_url_no ? props.license.features.dlr_license_url_no : ''}>
            <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            <StyledTypography> {props.license.features?.dlr_license_code}</StyledTypography>
          </StyledA>
        </>
      )}
      {!language.includes('NO') && (
        <>
          <Typography variant="caption">{props.license.features?.dlr_license_description_en}</Typography>
          <StyledA
            target="_blank"
            href={props.license.features?.dlr_license_url_en ? props.license.features.dlr_license_url_en : ''}>
            <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            <StyledTypography> {props.license.features?.dlr_license_code}</StyledTypography>
          </StyledA>
        </>
      )}
    </StyledWrapper>
  );
};

export default LicenseCard;
