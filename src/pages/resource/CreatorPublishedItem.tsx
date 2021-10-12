import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Link, Typography } from '@mui/material';
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
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'}) {
    margin-right: 1rem;
  }
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
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  margin-left: 1rem;
  @media (max-width: 74rem) and (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 0;
    padding: 1rem;
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
  height: auto;
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
  testId?: string;
}

const CreatorPublishedItem: FC<CreatorPublishedItemProps> = ({ resource, testId }) => {
  const { t } = useTranslation();

  return (
    <StyledGridContainer data-testid={testId}>
      <StyledThumbnailWrapper>
        <Thumbnail
          institution={resource.features.dlr_storage_id}
          resourceOrContentIdentifier={resource.identifier}
          alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
        />
        <ResourceTypeInfo resource={resource} />
      </StyledThumbnailWrapper>
      <div>
        <StyledLinkTypography variant="subtitle2" gutterBottom>
          <Link href={generateURL(resource)}>{resource.features.dlr_title}</Link>
        </StyledLinkTypography>
        <Typography gutterBottom variant="body2">
          {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
        </Typography>
        <StyledMaxTwoLinesTypography variant="body2" gutterBottom>
          {resource.features.dlr_description}
        </StyledMaxTwoLinesTypography>
      </div>
    </StyledGridContainer>
  );
};

export default CreatorPublishedItem;
