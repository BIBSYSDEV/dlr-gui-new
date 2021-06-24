import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { StyledContentWrapperMedium, StyledSchemaPartColored } from '../../components/styled/Wrappers';
import { Colors } from '../../themes/mainTheme';
import { Chip, Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SearchParameters } from '../../types/search.types';
import { getLMSSearchParams } from '../../utils/lmsService';
import { getResourceViews } from '../../api/resourceApi';

const StyledChip: any = styled(Chip)`
  && {
    margin: 0.5rem 0.5rem 0 0;
  }
`;

const StyledFeatureWrapper = styled.div`
  padding: 0.5rem 0;
`;

const StyledCaption = styled(Typography)`
  display: block;
`;

const StyledBoldTypography = styled(Typography)`
  font-weight: 700;
`;

interface ResourceMetadataProps {
  resource: Resource;
  isPreview?: boolean;
}

const ResourceMetadata: FC<ResourceMetadataProps> = ({ resource, isPreview = false }) => {
  const { t } = useTranslation();
  const [views, setViews] = useState('');
  const sortedContributorList = resource.contributors.sort((contributorA, contributorB) => {
    if (contributorA.features.dlr_contributor_type && contributorB.features.dlr_contributor_type) {
      return contributorA.features.dlr_contributor_type.localeCompare(contributorB.features.dlr_contributor_type);
    }
    return 0;
  });

  useEffect(() => {
    const fetchResourceUsage = async () => {
      try {
        setViews((await getResourceViews(resource.identifier)).data.features.dlr_statistics_delivery_count || '');
      } catch (error) {
        //ignores error. not important
      }
    };
    fetchResourceUsage();
  }, [resource.identifier]);

  return (
    <StyledSchemaPartColored color={Colors.DLRYellow1}>
      <StyledContentWrapperMedium>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            {resource.creators && resource.creators.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-creators">
                <Typography variant="h2">
                  {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.contributors && resource.contributors.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-contributors">
                <Typography variant="body1" gutterBottom>
                  {sortedContributorList
                    .map(
                      (contributor) =>
                        `${t(`resource.contributor_type.${contributor.features.dlr_contributor_type ?? ''}`)}: ${
                          contributor.features.dlr_contributor_name
                        }`
                    )
                    .join(', ')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.features.dlr_time_published && (
              <Typography data-testid="resource-time-published" variant="body1">
                {t('resource.metadata.published')}
                {': '}
                {format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}
              </Typography>
            )}

            {resource.features.dlr_time_created && (
              <Typography gutterBottom data-testid="resource-time-created" variant="body1">
                {t('resource.metadata.created')}
                {': '}
                {format(new Date(resource.features.dlr_time_created), 'dd.MM.yyyy')}
              </Typography>
            )}
            {views && !isPreview && (
              <StyledBoldTypography gutterBottom variant="body2" data-testid="resource-views">
                {views} {t('resource.views')}
              </StyledBoldTypography>
            )}

            {resource.features.dlr_description && (
              <StyledFeatureWrapper data-testid="resource-description">
                <StyledCaption variant="caption">{t('resource.metadata.description')}</StyledCaption>
                <Typography variant="body1">{resource.features.dlr_description}</Typography>
              </StyledFeatureWrapper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {resource.tags && resource.tags.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-tags">
                <Typography gutterBottom variant="h2">
                  {t('resource.metadata.tags')}
                </Typography>
                {resource.tags.map((tag, index) => (
                  <StyledChip
                    href={`/?${SearchParameters.tag}=${tag}${
                      getLMSSearchParams().toString().length > 0 ? `&${getLMSSearchParams()}` : ''
                    }`}
                    component="a"
                    key={index}
                    size="medium"
                    color="primary"
                    label={tag}
                    data-testid={`tag-chip-${index}`}
                    clickable
                  />
                ))}
              </StyledFeatureWrapper>
            )}
          </Grid>
        </Grid>
      </StyledContentWrapperMedium>
    </StyledSchemaPartColored>
  );
};

export default ResourceMetadata;
