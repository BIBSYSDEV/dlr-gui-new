import React, { FC } from 'react';
import { Link, Typography } from '@mui/material';
import { SupportedFileTypes } from '../types/content.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Resource } from '../types/resource.types';

const StyledBlockWrapper = styled.div`
  display: block;
`;

interface LinkPreviewNotPossibleProps {
  resource: Resource;
  presentationMode: string;
}

const LinkPreviewNotPossible: FC<LinkPreviewNotPossibleProps> = ({ resource, presentationMode }) => {
  const { t } = useTranslation();

  const hrefLinkUrl = (
    <Link
      underline="hover"
      target="_blank"
      rel="noopener noreferrer"
      href={resource.contents.masterContent.features.dlr_content}>
      {resource.contents.masterContent.features.dlr_content} ({t('resource.preview.open_in_new_tag')})
    </Link>
  );

  return (
    <StyledBlockWrapper>
      <Typography gutterBottom variant="body1">
        {t('resource.preview.external_page')}: {hrefLinkUrl}
      </Typography>
      {presentationMode === SupportedFileTypes.LinkSchemeHttp && (
        <Typography variant="body1">{t('resource.preview.no_preview_security_reasons')}</Typography>
      )}
      {presentationMode === SupportedFileTypes.LinkXFrameOptionsPresent && (
        <Typography variant="body1">{t('resource.preview.no_preview_support_reasons')}</Typography>
      )}
    </StyledBlockWrapper>
  );
};

export default LinkPreviewNotPossible;
