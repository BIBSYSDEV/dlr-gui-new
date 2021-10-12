import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledFeatureWrapper } from '../../components/styled/Wrappers';
import CClogoImage from '../../components/CClogoImage';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import i18next from 'i18next';

const StyledLink = styled(Link)`
  & .MuiTypography-body1 {
    color: ${Colors.Link};
  }
  margin-left: -0.3rem;
  display: flex;
  align-items: flex-start;
`;

enum langCodes {
  NO = 'no',
  EN = 'en',
}

interface ResourceLicenseProps {
  resource: Resource;
}

const ResourceLicense: FC<ResourceLicenseProps> = ({ resource }) => {
  const { t } = useTranslation();
  const license = resource.licenses[0];
  const langCode: string =
    i18next.language.includes('nb') || i18next.language.includes('nob') ? langCodes.NO : langCodes.EN;

  const generateLicenseDescription = () => {
    const description = langCodes.NO
      ? license.features?.dlr_license_description_no
      : license.features?.dlr_license_description_en;
    return description ?? license.features?.dlr_license_description;
  };

  const generateLicenseUrl = () => {
    const link = langCodes.NO ? license.features?.dlr_license_url_no : license.features?.dlr_license_url_en;
    return link ?? license.features?.dlr_license_url;
  };

  return (
    <>
      {license && license.identifier.length > 0 && (
        <StyledFeatureWrapper data-testid="resource-license">
          <Typography gutterBottom variant="h2">
            {t('resource.metadata.license')}
          </Typography>
          <div lang={langCode}>
            <StyledLink gutterBottom target="_blank" rel="noopener noreferrer" href={generateLicenseUrl()}>
              {license.features?.dlr_license_code && <CClogoImage licenseCode={license.features.dlr_license_code} />}
            </StyledLink>
            <Typography variant="overline">{generateLicenseDescription()}</Typography>
          </div>
        </StyledFeatureWrapper>
      )}
    </>
  );
};

export default ResourceLicense;
