import React, { FC, useState } from 'react';
import { Button } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useTranslation } from 'react-i18next';
import { getContentPresentationData } from '../api/resourceApi';
import { Content } from '../types/content.types';
import ErrorBanner from './ErrorBanner';
import { handlePotentialAxiosError } from '../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

interface DownloadButtonProps {
  content: Content;
}

const DownloadButton: FC<DownloadButtonProps> = ({ content }) => {
  const { t } = useTranslation();
  const [fetchingUrlError, setFetchingUrlError] = useState<Error | AxiosError>();

  const handleDownloadClick = async () => {
    try {
      setFetchingUrlError(undefined);
      const contentResponse = await getContentPresentationData(content.identifier); //acquire 10 seconds valid JWT token for download
      if (contentResponse.data.features.dlr_content_url) {
        window.open(contentResponse.data.features.dlr_content_url);
      } else {
        setFetchingUrlError(new Error('no url found'));
      }
    } catch (error) {
      setFetchingUrlError(handlePotentialAxiosError(error));
    }
  };

  return (
    <>
      <Button
        onClick={handleDownloadClick}
        size="large"
        startIcon={<CloudDownloadIcon />}
        variant="contained"
        color="primary">
        {t('resource.preview.link_to_content')}{' '}
        {content.features.dlr_content_size && ` (${content.features.dlr_content_size})`}
      </Button>
      {fetchingUrlError && <ErrorBanner error={fetchingUrlError} />}
    </>
  );
};

export default DownloadButton;
