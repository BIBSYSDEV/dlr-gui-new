import React, { FC } from 'react';
import { Link, Typography } from '@material-ui/core';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';
// import { useTranslation } from 'react-i18next';
import CClogoImage from './CClogoImage';
import { Colors } from '../themes/mainTheme';

const StyledWrapper = styled.div``;

const StyledLink = styled(Link)`
  color: ${Colors.Primary};
  margin-left: -0.3rem;
  display: flex;
  align-items: flex-start;
`;
interface LicenseProps {
  license: License;
}

enum langCodes {
  NO = 'no',
  EN = 'en',
}

const LicenseCard2: FC<LicenseProps> = ({ license }) => {
  const langCode: string = i18next.language.includes('nb') ? langCodes.NO : langCodes.EN;
  // const { t } = useTranslation();

  // const generateLicenseName = () => {
  //   const licenseName = langCodes.NO ? license.features?.dlr_license_name_no : license.features?.dlr_license_name_en;
  //   return licenseName ?? license.features?.dlr_license_name;
  // };

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
    <StyledWrapper lang={langCode}>
      <StyledLink gutterBottom target="_blank" rel="noopener noreferrer" href={generateLicenseUrl()}>
        {license.features?.dlr_license_code && <CClogoImage licenseCode={license.features.dlr_license_code} />}
      </StyledLink>
      {/*<Typography variant="h6">{generateLicenseName()}</Typography>*/}
      <Typography variant="overline">{generateLicenseDescription()}</Typography>
    </StyledWrapper>
  );
};

export default LicenseCard2;
