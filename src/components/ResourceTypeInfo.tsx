import React, { FC } from 'react';
import styled from 'styled-components';
import { getStyledFileTypeIcon } from './FileTypeIcon';
import { Resource, ResourceCreationType } from '../types/resource.types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

const StyledThumbnailMetadataWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 1.5rem;
`;

const StyledFileTypeIcon = styled.span`
  margin: 0.7rem 0.3rem 0.5rem 0.5rem;
`;

const StyledFileName = styled(Typography)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

interface ResourceTypeInfoProps {
  resource: Resource;
}

const ResourceTypeInfo: FC<ResourceTypeInfoProps> = ({ resource }) => {
  const { t } = useTranslation();
  return (
    <StyledThumbnailMetadataWrapper>
      {resource.features.dlr_type && (
        <StyledFileTypeIcon>{getStyledFileTypeIcon(resource.features.dlr_type)}</StyledFileTypeIcon>
      )}
      <StyledFileName display="inline" variant="body2">
        {t(`resource.type.${resource.features.dlr_type?.toLowerCase()}`)}
        {resource.features.dlr_content_type === ResourceCreationType.LINK && ' (' + t('resource.metadata.link') + ')'}
      </StyledFileName>
    </StyledThumbnailMetadataWrapper>
  );
};

export default ResourceTypeInfo;
