import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Chip, Grid, Link, Typography } from '@material-ui/core';
import Thumbnail from '../../components/Thumbnail';
import ResourceTypeInfo from '../../components/ResourceTypeInfo';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { getLMSSearchParams } from '../../utils/lmsService';
import { resourcePath } from '../../utils/constants';
import { SearchParameters } from '../../types/search.types';

const StyledThumbnailWrapper = styled.div`
  background-color: ${Colors.DescriptionPageGradientColor1};
  width: 7.85rem;
`;

const StyledMaxTwoLinesTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show. Not IE */
  -webkit-box-orient: vertical;
`;

const StyledGridContainer = styled.div`
  background-color: rgba(242, 242, 242, 1);
  padding: 1rem;
  width: 12.9rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    width: 100%;
  }
  height: 100%;
`;

const StyledChip: any = styled(Chip)`
  margin-right: 0.5rem;
  margin-top: 0.5rem;
`;

const StyledLinkTypography = styled(Typography)`
  hyphens: auto;
`;

const generateURL = (resource: Resource) => {
  const LMSSearchParams = getLMSSearchParams();
  return `${resourcePath}/${resource.identifier}${LMSSearchParams.toString().length > 0 ? `?${LMSSearchParams}` : ''}`;
};

interface CreatorPublishedItemProps {
  resource: Resource;
}

const CreatorPublishedItem: FC<CreatorPublishedItemProps> = ({ resource }) => {
  const { t } = useTranslation();

  return (
    <StyledGridContainer>
      <Grid container spacing={3}>
        <Grid item alignItems="center">
          <StyledThumbnailWrapper>
            <Thumbnail
              small={true}
              institution={resource.features.dlr_storage_id}
              resourceOrContentIdentifier={resource.identifier}
              alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
            />
            <ResourceTypeInfo resource={resource} />
          </StyledThumbnailWrapper>
        </Grid>
        <Grid item>
          <StyledLinkTypography gutterBottom variant="h3">
            <Link href={generateURL(resource)}>{resource.features.dlr_title}</Link>
          </StyledLinkTypography>
          <Typography gutterBottom>
            {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
          </Typography>
          <StyledMaxTwoLinesTypography gutterBottom>{resource.features.dlr_description}</StyledMaxTwoLinesTypography>
          {resource.tags?.map((tag, index) => (
            <StyledChip
              key={index}
              color="primary"
              component="a"
              href={`/?${SearchParameters.tag}=${tag}`}
              clickable
              size="medium"
              label={tag}
            />
          ))}
        </Grid>
      </Grid>
    </StyledGridContainer>
  );
};

export default CreatorPublishedItem;
