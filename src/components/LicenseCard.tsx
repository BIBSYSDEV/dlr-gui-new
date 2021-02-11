import React, { FC } from 'react';
import { Link, Typography } from '@material-ui/core';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CClogoImage from './CClogoImage';
import { Colors } from '../themes/mainTheme';

interface LicenseProps {
  license: License;
}

const StyledWrapper = styled.div`
  padding-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${Colors.Primary};
  text-decoration: underline;
  :hover {
    font-weight: 600;
  }
  :focus {
    font-weight: 600;
  }
  font-weight: 500;
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
`;
const StyledTypography = styled(Typography)`
  padding-left: 0.2rem;
`;

const LicenseCard: FC<LicenseProps> = ({ license }) => {
  const language = i18next.language;
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      {language.includes('nb') && (
        <>
          {license.features?.dlr_license_code && (
            <Typography variant="subtitle1"> {license.features?.dlr_license_name_no} </Typography>
          )}
          {!license.features?.dlr_license_name_no && (
            <Typography variant="subtitle1">{license.features?.dlr_license_name}</Typography>
          )}
          <Typography variant="caption">{license.features?.dlr_license_description_no}</Typography>
          {!license.features?.dlr_license_description_no && (
            <Typography variant="caption">{license.features?.dlr_license_description}</Typography>
          )}
          <StyledLink target="_blank" href={license.features?.dlr_license_url_no ?? ''}>
            {`${t('license.read_more')}: `}
            {license.features?.dlr_license_code && <CClogoImage licenseCode={license.features.dlr_license_code} />}
          </StyledLink>
        </>
      )}
      {!language.includes('nb') && (
        <div lang="en">
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
          <StyledLink target="_blank" href={license.features?.dlr_license_url_en ?? ''}>
            {license.features?.dlr_license_code && <CClogoImage licenseCode={license.features.dlr_license_code} />}
            <StyledTypography>
              {`${t('license.read_more')}: ${license.features?.dlr_license_code} (${t(
                'license.external_page'
              ).toLowerCase()})`}
            </StyledTypography>
          </StyledLink>
        </div>
      )}
    </StyledWrapper>
  );
};

export default LicenseCard;
