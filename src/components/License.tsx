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
  return (
    <>
      <Card>
        <Typography variant="h6"> {t('license.license_information')}</Typography>
        <div>
          <span>
            <Typography variant="body2">{t('license.published_with')}</Typography>
          </span>

          <Link to={props.license.features?.dlr_license_url ? props.license.features.dlr_license_url : ''}>
            <img src={props.license.features?.dlr_license_url_image} alt={props.license.features?.dlr_license_code} />
          </Link>
        </div>
        <Typography variant="caption">{props.license.features?.dlr_license_description_no}</Typography>
      </Card>
    </>
  );
};

export default LicenseCard;
