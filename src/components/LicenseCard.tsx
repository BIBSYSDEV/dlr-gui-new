import React, { FC } from 'react';
import Card from './Card';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { License } from '../types/license.types';
import i18next from 'i18next';
import styled from 'styled-components';

interface LicenseProps {
  license: License;
}

const StyledCard = styled(Card)`
  padding-top: 1rem;
`;

const LicenseCard: FC<LicenseProps> = (props) => {
  const language = i18next.language;
  return (
    <StyledCard>
      <div>
        {props.license.features?.dlr_license_code && (
          <Typography variant="h6">{props.license.features.dlr_license_code}</Typography>
        )}
      </div>
      {language.includes('NO') && (
        <>
          <div>
            <a href={props.license.features?.dlr_license_url_no ? props.license.features.dlr_license_url_no : ''}>
              <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            </a>
          </div>
          <Typography variant="body1">{props.license.features?.dlr_license_description_no}</Typography>
        </>
      )}
      {!language.includes('NO') && (
        <>
          <div>
            <Link to={props.license.features?.dlr_license_url_en ? props.license.features.dlr_license_url_en : ''}>
              <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            </Link>
          </div>
          <Typography variant="caption">{props.license.features?.dlr_license_description_en}</Typography>
        </>
      )}
    </StyledCard>
  );
};

export default LicenseCard;
