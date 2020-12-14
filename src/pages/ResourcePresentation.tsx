import React, { FC } from 'react';
import { Resource } from '../types/resource.types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Preview } from './ResourcePage';
import styled from 'styled-components';
import { StyledContentWrapper } from '../components/styled/Wrappers';
import ContentPreview from '../components/ContentPreview';

interface ResourcePresentationProps {
  resource: Resource;
  preview: Preview;
}

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

const ResourcePresentation: FC<ResourcePresentationProps> = ({ resource, preview }) => {
  const { t } = useTranslation();

  return (
    resource && (
      <StyledPresentationWrapper>
        <Typography variant="h1">{resource.features?.dlr_title}</Typography>

        <PreviewComponentWrapper>
          <ContentPreview preview={preview} />
        </PreviewComponentWrapper>

        <StyledFeatureWrapper>
          <Typography variant="h4">
            {resource.creators &&
              resource.creators.length !== 0 &&
              resource.creators.map((creator) => creator.features.dlr_creator_name).join(',')}
          </Typography>
        </StyledFeatureWrapper>

        <StyledFeatureWrapper>
          <Typography variant="h4">
            {resource.contributors &&
              resource.contributors.length !== 0 &&
              resource.contributors.map((contributor) => contributor.features.dlr_contributor_name).join(',')}
          </Typography>
        </StyledFeatureWrapper>

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
            <Typography variant="body2">{t('resource.metadata.owner}')}</Typography>
            <Typography variant="h6">{resource.features.dlr_submitter_email}</Typography>
          </StyledFeatureWrapper>
        )}
        {resource.features.dlr_description && (
          <StyledFeatureWrapper>
            <Typography variant="body2">{t('resource.metadata.description')}</Typography>
            <Typography variant="h6">{resource.features.dlr_description}</Typography>
          </StyledFeatureWrapper>
        )}

        {/*<ResourceMetadata*/}
        {/*  type={preview.type}*/}
        {/*  category={resource?.features.dlr_subject_nsi_id ? resource.features.dlr_subject_nsi_id : ''}*/}
        {/*  tags={resource.tags}*/}
        {/*/>*/}
        {/*{resource.licenses && resource.licenses.length !== 0 &&*/}
        {/*resource.licenses.map((license) => {*/}
        {/*  return <LicenseCard key={license.identifier} license={license} />;*/}
        {/*});*/}
        {/*}*/}
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
