import React, { FC } from 'react';
import Card from './Card';

import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { License } from '../types/license.types';
import i18next from 'i18next';

interface LicenseProps {
  license: License;
}

const LicenseCard: FC<LicenseProps> = (props) => {
  const { t } = useTranslation();
  const language = i18next.language;
  return (
    <>
      <Card>
        <Typography variant="h6"> {t('license.license_information')}</Typography>
        <div>
          <span>
            <Typography variant="body2">{t('license.published_with')}</Typography>
          </span>
        </div>
        {language.includes('NO') && (
          <>
            <Link to={props.license.features?.dlr_license_url_no ? props.license.features.dlr_license_url_no : ''}>
              <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            </Link>
            <Typography variant="caption">{props.license.features?.dlr_license_description_no}</Typography>
          </>
        )}
        {!language.includes('NO') && (
          <>
            <Link to={props.license.features?.dlr_license_url_en ? props.license.features.dlr_license_url_en : ''}>
              <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
            </Link>
            <Typography variant="caption">{props.license.features?.dlr_license_description_en}</Typography>
          </>
        )}
      </Card>
    </>
  );
};

export default LicenseCard;
