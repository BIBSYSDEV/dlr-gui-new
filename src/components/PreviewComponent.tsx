import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Preview } from '../pages/ResourcePage';

const imageType = 'image';
const videoType = 'video';

interface PreviewComponentProps {
  preview: Preview;
}

const PreviewComponent: FC<PreviewComponentProps> = ({ preview }) => {
  const { t } = useTranslation();

  const getPreviewModeBaseOnType = () => {
    //todo: inline i JSX
    if (preview.type === imageType) {
      return (
        <>
          <img src={preview.url} width="400px" height="300px" alt="Preview of resource" />
        </>
      );
    } else if (preview.type === videoType) {
      return (
        <>
          <video width="400px" height="300px" src={preview.url} controls />
        </>
      );
    } else {
      return <h3>{t('resource.preview_not_supported_filetype')}</h3>;
    }
  };

  return <div style={{ minHeight: '300px', border: '1px solid red' }}>{getPreviewModeBaseOnType()}</div>;
};

export default PreviewComponent;
