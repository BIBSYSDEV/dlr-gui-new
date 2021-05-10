import React, { FC } from 'react';
import { Content } from '../types/content.types';
import { Resource } from '../types/resource.types';
import { useTranslation } from 'react-i18next';
import ContentIframe from './ContentIframe';
import { MICROSOFT_DOCUMENT_VIEWER } from '../utils/constants';
import DownloadButton from './DownloadButton';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';

const InformationAndDownloadWrapper = styled.div`
  display: block;
  width: 27rem;
  text-align: center;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 2rem;
`;

const windowsMaxRenderSize = 10000000;

interface DocumentPreviewProps {
  defaultContent: Content | null;
  resource: Resource;
  usageURL: string;
}

const DocumentPreview: FC<DocumentPreviewProps> = ({ defaultContent, resource, usageURL }) => {
  const { t } = useTranslation();
  return (
    <>
      {parseInt(
        defaultContent?.features.dlr_content_size_bytes ??
          '' + resource.contents.masterContent.features.dlr_content_size_bytes
      ) < windowsMaxRenderSize ? (
        <ContentIframe src={`${MICROSOFT_DOCUMENT_VIEWER}?src=${usageURL}`} />
      ) : (
        <InformationAndDownloadWrapper>
          <StyledAlert severity="info">{t('resource.preview.file_to_big')}</StyledAlert>
          <DownloadButton
            contentURL={usageURL}
            contentSize={resource.contents.masterContent.features.dlr_content_size}
          />
        </InformationAndDownloadWrapper>
      )}
    </>
  );
};

export default DocumentPreview;
