import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const DOIRequestList = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('work_list.doi_request_list')}
      </Typography>
    </>
  );
};

export default DOIRequestList;
