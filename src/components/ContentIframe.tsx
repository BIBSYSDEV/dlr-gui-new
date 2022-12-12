import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TransistorDefaultSizes } from '../utils/Preview.utils';
import { SupportedFileTypes } from '../types/content.types';

const StyledSixteenNineAspectRatioIframe = styled.iframe`
  border: 0;
  aspect-ratio: 16 /9;
  width: 100%;
`;

const TransistorIframeFixedHeight = styled.iframe`
  border: 0;
  height: ${TransistorDefaultSizes.medium.height};
  width: 100%;
`;

const DefaultIframeStyling = styled.iframe`
  border: 0;
  height: 100%;
  width: 100%;
`;

interface ContentIframeProps {
  src: string;
  presentationMode: SupportedFileTypes | undefined;
}

const ContentIframe: FC<ContentIframeProps> = ({ src, presentationMode }) => {
  const { t } = useTranslation();

  switch (presentationMode) {
    case SupportedFileTypes.Panopto:
      return (
        <StyledSixteenNineAspectRatioIframe
          title={t('resource.preview.preview_of_master_content') ?? ''}
          src={src}
          allowFullScreen
        />
      );
    case SupportedFileTypes.Transistor:
      return (
        <TransistorIframeFixedHeight
          title={t('resource.preview.preview_of_master_content') ?? ''}
          src={src}
          allowFullScreen
        />
      );
    default:
      return <DefaultIframeStyling title={t('resource.preview.preview_of_master_content') ?? ''} src={src} allowFullScreen />;
  }
};

export default ContentIframe;
