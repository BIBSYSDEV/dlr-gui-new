import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { StyledContentWrapperMedium, StyledSchemaPartColored } from '../../components/styled/Wrappers';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { Chip, Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SearchParameters } from '../../types/search.types';

const StyledChip: any = styled(Chip)`
  max-width: 13rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md - 1 + 'px'}) {
    max-width: ${StyleWidths.width3};
  }
  && {
    margin: 0.5rem 0.5rem 0 0;
    background-color: ${Colors.ChipBackground};
    color: ${Colors.Background};
    &:focus {
      color: ${Colors.PrimaryText};
      background-color: ${Colors.ChipBackgroundFocus};
    }
  }
`;

const StyledFeatureWrapper = styled.div`
  padding: 0.5rem 0;
`;

const StyledCaption = styled(Typography)`
  display: block;
`;

interface ResourceMetadataProps {
  resource: Resource;
}

const ResourceMetadata: FC<ResourceMetadataProps> = ({ resource }) => {
  const { t } = useTranslation();
  const sortedContributorList = resource.contributors.sort((contributorA, contributorB) => {
    if (contributorA.features.dlr_contributor_type && contributorB.features.dlr_contributor_type) {
      return contributorA.features.dlr_contributor_type.localeCompare(contributorB.features.dlr_contributor_type);
    }
    return 0;
  });

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
                    href={`/?${SearchParameters.tag}=${tag}`}
                    component="a"
                    key={index}
                    size="medium"
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
