import React, { FC } from 'react';
import { Link, Typography } from '@mui/material';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CClogoImage from './CClogoImage';
import { Colors } from '../themes/mainTheme';

const StyledWrapper = styled.div`
  padding-top: 1rem;
`;

const StyledLink = styled(Link)`
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  & .MuiTypography-body1 {
    color: ${Colors.Link};
  }
`;

interface LicenseProps {
  license: License;
}

const LicenseCard: FC<LicenseProps> = ({ license }) => {
  const language = i18next.language;
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      {language.includes('nb') || language.includes('nob') ? (
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
          <StyledLink
            underline="hover"
            rel="noopener noreferrer"
            target="_blank"
            href={license.features?.dlr_license_url_no ?? ''}>
            {`${t('license.read_more')}: `}
            {license.features?.dlr_license_code?.replace(' 4.0', '').replace(' 1.0', '') && (
              <CClogoImage licenseCode={license.features.dlr_license_code} />
            )}
          </StyledLink>
        </>
      ) : (
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
          <StyledLink
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
            href={license.features?.dlr_license_url_en ?? ''}>
            {`${t('license.read_more')}: `}
            {license.features?.dlr_license_code?.replace(' 4.0', '').replace(' 1.0', '') && (
              <CClogoImage licenseCode={license.features.dlr_license_code} />
            )}
          </StyledLink>
        </div>
      )}
    </StyledWrapper>
  );
};

export default LicenseCard;
