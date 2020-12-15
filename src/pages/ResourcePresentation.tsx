import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../types/resource.types';
import { Chip, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { StyledContentWrapper } from '../components/styled/Wrappers';
import ContentPreview from '../components/ContentPreview';
import LicenseCard from '../components/License';
import { API_PATHS, API_URL } from '../utils/constants';
import { emptyPreview } from '../types/content.types';

const PreviewComponentWrapper = styled.div`
  margin: 1rem 0;
  height: 15rem;
  max-height: 15rem;
  max-width: 100%;
`;

const StyledPresentationWrapper = styled(StyledContentWrapper)`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const StyledFeatureWrapper = styled.div`
  padding: 0.5rem 0;
`;

const StyledChip = styled(Chip)`
  margin-right: 0.5rem;
  margin-top: 0.5rem;
`;

interface ResourcePresentationProps {
  resource: Resource;
}

const ResourcePresentation: FC<ResourcePresentationProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(emptyPreview);

  useEffect(() => {
    if (resource.contents) {
      const masterContent = resource.contents.find((content) => content.features.dlr_content_default === 'true');
      if (masterContent) {
        const type = masterContent.features.dlr_content_content_type ?? '';
        setPreview({
          type,
          url: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${masterContent.identifier}/delivery?jwt=${localStorage.token}`,
        });
      }
    }
  }, [resource.contents]);

  return (
    resource && (
      <StyledPresentationWrapper>
        <Typography variant="h1">{resource.features?.dlr_title}</Typography>

        {preview && (
          <PreviewComponentWrapper>
            <ContentPreview preview={preview} />
          </PreviewComponentWrapper>
        )}

        {resource.creators && resource.creators.length !== 0 && (
          <StyledFeatureWrapper>
            <Typography variant="h4">
              {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
            </Typography>
          </StyledFeatureWrapper>
        )}

        {resource.contributors && resource.contributors.length !== 0 && (
          <StyledFeatureWrapper>
            <Typography variant="h4">
              {resource.contributors.map((contributor) => contributor.features.dlr_contributor_name).join(', ')}
            </Typography>
          </StyledFeatureWrapper>
        )}

        {resource.features.dlr_time_published && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.published')}</Typography>
            <Typography variant="h6">{resource.features.dlr_time_published}</Typography>
          </StyledFeatureWrapper>
        )}

        {resource.features.dlr_time_created && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.created')}</Typography>
            <Typography variant="h6">{resource.features.dlr_time_created}</Typography>
          </StyledFeatureWrapper>
        )}

        {resource.features.dlr_submitter_email && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.owner')}</Typography>
            <Typography variant="h6">{resource.features.dlr_submitter_email}</Typography>
          </StyledFeatureWrapper>
        )}

        {resource.features.dlr_description && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.description')}</Typography>
            <Typography variant="h6">{resource.features.dlr_description}</Typography>
          </StyledFeatureWrapper>
        )}

        {resource.tags && resource.tags.length !== 0 && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.tags')}</Typography>
            {resource.tags.map((tag, index) => (
              <StyledChip key={index} size="medium" label={tag} />
            ))}
          </StyledFeatureWrapper>
        )}

        {resource.licenses && resource.licenses.length !== 0 && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.license')}</Typography>
            {resource.licenses.map((license) => (
              <LicenseCard key={license.identifier} license={license} />
            ))}
          </StyledFeatureWrapper>
        )}
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
