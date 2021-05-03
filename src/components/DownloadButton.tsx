import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { useTranslation } from 'react-i18next';

interface DownloadButtonProps {
  contentURL: string;
  contentSize: string | undefined;
}

const DownloadButton: FC<DownloadButtonProps> = ({ contentURL, contentSize }) => {
  const { t } = useTranslation();
  return (
    <Button href={contentURL} size="large" startIcon={<CloudDownloadIcon />} variant="contained" color="primary">
      {t('common.download')} {contentSize && ` (${contentSize})`}
    </Button>
  );
};

export default DownloadButton;
