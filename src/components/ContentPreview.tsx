import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Preview } from '../pages/ResourcePage';
import { Typography } from '@material-ui/core';
import placeholderImage from '../resources/images/placeholder.png';
import { resourceType } from '../types/content.types';
import styled from 'styled-components';

const ImageWrapper = styled.img`
  height: 100%;
`;

const VideoWrapper = styled.video`
  height: 100%;
`;

const ContentPreview: FC<{ preview: Preview }> = ({ preview }) => {
  const { t } = useTranslation();

  const unknownPreviewType = (type: string) => {
    if (type === resourceType.IMAGE || type === resourceType.VIDEO) return false;
  };

  return (
    <>
      {/*{preview.type === resourceType.IMAGE && <img src={preview.url} alt="Preview of resource" />}*/}
      {preview.type === resourceType.IMAGE && <ImageWrapper src={placeholderImage} alt="Preview of resource" />}
      {preview.type === resourceType.VIDEO && <VideoWrapper src={preview.url} controls />}
      {unknownPreviewType(preview.type) && <Typography>{t('resource.preview_not_supported_filetype')}</Typography>}
    </>
  );
};

export default ContentPreview;
