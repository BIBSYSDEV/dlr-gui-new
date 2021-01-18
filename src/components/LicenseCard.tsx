import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface LicenseProps {
  license: License;
}

const StyledWrapper = styled.div`
  padding-top: 1rem;
`;

const StyledA = styled.a`
  display: flex;
  align-items: center;
  padding: 0.2rem;
`;
const StyledTypography = styled(Typography)`
  padding-left: 0.2rem;
`;

const StyledLicenseLogoImage = styled.img`
  max-height: 15px;
  margin-right: 1rem;
`;

const LicenseCard: FC<LicenseProps> = ({ license }) => {
  const language = i18next.language;
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      {language.includes('nb') && (
        <>
          {license.features?.dlr_license_code && (
            <Typography variant="subtitle1">{license.features?.dlr_license_name_no}</Typography>
          )}
          {!license.features?.dlr_license_name_no && (
            <Typography variant="subtitle1">{license.features?.dlr_license_name}</Typography>
          )}
          <Typography variant="caption">{license.features?.dlr_license_description_no}</Typography>
          {!license.features?.dlr_license_description_no && (
            <Typography variant="caption">{license.features?.dlr_license_description}</Typography>
          )}
          <StyledA target="_blank" href={license.features?.dlr_license_url_no ?? ''}>
            <img src={license.features?.dlr_license_url_image} alt={license.features?.dlr_license_code} />
            <StyledTypography> {license.features?.dlr_license_code}</StyledTypography>
          </StyledA>
        </>
      )}
      {!language.includes('nb') && (
        <>
          {license.features?.dlr_license_code && (
            <Typography variant="h6">{license.features?.dlr_license_name_en}</Typography>
          )}
          {!license.features?.dlr_license_name && (
            <Typography variant="h6">{license.features?.dlr_license_name}</Typography>
          )}
          <Typography variant="caption">{license.features?.dlr_license_description_en}</Typography>
          {!license.features?.dlr_license_description_en && (
            <Typography variant="body1">{license.features?.dlr_license_description}</Typography>
          )}
          <StyledA target="_blank" href={license.features?.dlr_license_url_en ?? ''}>
            <StyledLicenseLogoImage
              src={license.features?.dlr_license_url_image}
              alt={license.features?.dlr_license_code}
            />
            <StyledTypography>
              {`${t('license.read_more')}: ${license.features?.dlr_license_code} (${t(
                'license.external_page'
              ).toLowerCase()})`}
            </StyledTypography>
          </StyledA>
        </>
      )}
    </StyledWrapper>
  );
};

export default LicenseCard;
