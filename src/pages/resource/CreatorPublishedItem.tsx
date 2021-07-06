import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Grid, Link, Typography } from '@material-ui/core';
import Thumbnail from '../../components/Thumbnail';
import ResourceTypeInfo from '../../components/ResourceTypeInfo';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { getLMSSearchParams } from '../../utils/lmsService';
import { resourcePath } from '../../utils/constants';

const StyledThumbnailWrapper = styled.div`
  background-color: ${Colors.DescriptionPageGradientColor1};
  width: 11rem;
`;

const StyledMaxTwoLinesTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show. Not IE */
  -webkit-box-orient: vertical;
`;

const StyledGridContainer = styled.div`
  background-color: ${Colors.DLRGray};
  padding: 1rem;
  width: 12.9rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'}) {
    padding: 0.3rem;
    width: 12rem;
  }
  height: 100%;
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
    <StyledGridContainer data-testid="creator-published-item">
      <Grid container spacing={3}>
        <Grid item>
          <StyledThumbnailWrapper>
            <Thumbnail
              institution={resource.features.dlr_storage_id}
              resourceOrContentIdentifier={resource.identifier}
              alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
            />
            <ResourceTypeInfo resource={resource} />
          </StyledThumbnailWrapper>
        </Grid>
        <Grid item>
          <StyledLinkTypography variant="subtitle2" gutterBottom>
            <Link href={generateURL(resource)}>{resource.features.dlr_title}</Link>
          </StyledLinkTypography>
          <Typography gutterBottom variant="body2">
            {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
          </Typography>
          <StyledMaxTwoLinesTypography variant="body2" gutterBottom>
            {resource.features.dlr_description}
          </StyledMaxTwoLinesTypography>
        </Grid>
      </Grid>
    </StyledGridContainer>
  );
};

export default CreatorPublishedItem;
