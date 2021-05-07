import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { useTranslation } from 'react-i18next';

interface DownloadButtonProps {
  contentURL: string;
  contentSize: string | undefined;
  fileName: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({ contentURL, contentSize, fileName }) => {
  const { t } = useTranslation();

  return (
    <Button
      href={contentURL}
      download={fileName}
      target="_blank"
      rel="noopener norefferer"
      size="large"
      startIcon={<CloudDownloadIcon />}
      variant="contained"
      color="primary">
      {t('resource.preview.open_in_new_tag')} {contentSize && ` (${contentSize})`}
    </Button>
  );
};

export default DownloadButton;
