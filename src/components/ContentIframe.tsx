import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ContentIframeProps {
  src: string;
}

const ContentIframe: FC<ContentIframeProps> = ({ src }) => {
  const { t } = useTranslation();
  return (
    <iframe
      title={t('resource.preview.preview_of_master_content')}
      src={src}
      frameBorder="0"
      allowFullScreen
      height={'100%'}
      width={'100%'}
    />
  );
};

export default ContentIframe;
