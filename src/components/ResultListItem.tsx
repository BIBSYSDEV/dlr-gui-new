import React, { FC, useState } from 'react';
import { Resource } from '../types/resource.types';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../themes/mainTheme';
import { format } from 'date-fns';
import { Button, Chip } from '@mui/material';
import CClogoImage from './CClogoImage';
import Link from '@mui/material/Link';
import { SearchParameters } from '../types/search.types';
import ResourceTypeInfo from './ResourceTypeInfo';
import { getLMSSearchParams } from '../utils/lmsService';
import { localeSort, StringArrayToSetStringArray } from '../utils/StringArray';
import { resourcePath } from '../utils/constants';
import institutions from '../resources/assets/institutions.json';

const StyledListItem: any = styled.li`
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.Background};
  margin-bottom: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: left;
  flex-direction: row;
  align-items: start;
  max-width: ${StyleWidths.width4};
  min-height: 10rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: block;
  }
`;

const StyledFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 11rem;
`;

const StyledThumbnailWrapper = styled.div`
  background-color: ${Colors.DescriptionPageGradientColor1};
`;

const StyledTimeCreatedTypography = styled(Typography)`
  min-width: 6rem;
`;

const StyledMaxTwoLinesTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show. Not IE */
  -webkit-box-orient: vertical;
`;

const StyledMaxOneLineTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show. Not IE */
  -webkit-box-orient: vertical;
`;

const StyledLicense = styled.div`
  margin-top: 1rem;
`;

const StyledSecondColumn = styled.div`
  padding-left: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 10rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-left: 0;
    padding-top: 1rem;
    min-height: inherit;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
  }
`;

const StyledChip: any = styled(Chip)`
  margin-right: 0.5rem;
  margin-top: 0.5rem;
`;

const generateURL = (resource: Resource) => {
  const LMSSearchParams = getLMSSearchParams();
  return `${resourcePath}/${resource.identifier}${LMSSearchParams.toString().length > 0 ? `?${LMSSearchParams}` : ''}`;
};

const TagsDisplayThreshold = 10;

interface ResultListItemProps {
  resource: Resource;
}

const ResultListItem: FC<ResultListItemProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [displayTags, setDisplayTags] = useState(
    resource.tags ? StringArrayToSetStringArray(localeSort(resource.tags)).slice(0, TagsDisplayThreshold) : []
  );
  const [showAllTags, setShowAllTags] = useState(!(resource.tags && resource.tags.length > TagsDisplayThreshold));

  const handleShowAllTagsClick = () => {
    setDisplayTags(resource.tags ? StringArrayToSetStringArray(localeSort(resource.tags)) : []);
    setShowAllTags(true);
  };

  return (
    <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
      <StyledFirstColumn>
        <StyledThumbnailWrapper>
          <Link data-testid={`thumbnail-link-to-resource-${resource.identifier}`} href={generateURL(resource)}>
            <Thumbnail
              institution={resource.features.dlr_storage_id}
              resourceOrContentIdentifier={resource.identifier}
              alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
            />
          </Link>
          <ResourceTypeInfo resource={resource} />
        </StyledThumbnailWrapper>

        <StyledLicense>
          {resource.features.dlr_rights_license_name && (
            <CClogoImage licenseCode={resource.features.dlr_rights_license_name} />
          )}
        </StyledLicense>
      </StyledFirstColumn>

      <StyledSecondColumn>
        <div>
          <StyledHeader>
            <StyledMaxTwoLinesTypography variant="h4">
              <Link
                underline="hover"
                data-testid={`link-to-resource-${resource.identifier}`}
                href={generateURL(resource)}>
                {resource.features.dlr_title}
              </Link>
            </StyledMaxTwoLinesTypography>
            <StyledTimeCreatedTypography variant="body1">
              {format(new Date(resource.features.dlr_time_created), 'dd.MM.yyyy')}
            </StyledTimeCreatedTypography>
          </StyledHeader>

          {resource.creators && resource.creators.length !== 0 && (
            <StyledMaxOneLineTypography variant="body1">
              {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
            </StyledMaxOneLineTypography>
          )}

          {resource.contributors && resource.contributors.length !== 0 && (
            <StyledMaxOneLineTypography variant="body1">
              {resource.contributors
                .map(
                  (contributor) =>
                    institutions.find(
                      (institution) =>
                        institution.toLowerCase() === contributor.features.dlr_contributor_name?.toLowerCase()
                    ) ?? contributor.features.dlr_contributor_name
                )
                .join(', ')}
            </StyledMaxOneLineTypography>
          )}

          {resource.features.dlr_description && (
            <StyledMaxTwoLinesTypography variant="body1">
              {resource.features.dlr_description}
            </StyledMaxTwoLinesTypography>
          )}
        </div>
        <div>
          {resource.tags && resource.tags.length !== 0 && (
            <div data-testid="resource-tags">
              {displayTags.map((tag, index) => (
                <StyledChip
                  component="a"
                  href={`/?${SearchParameters.tag}=${tag}`}
                  key={index}
                  data-testid={`tag-chip-${index}`}
                  clickable
                  size="medium"
                  label={tag}
                />
              ))}
              {!showAllTags && (
                <Button data-testid="show-all-tags" onClick={handleShowAllTagsClick} color="primary">
                  {t('resource.show_all_tags')}
                </Button>
              )}
            </div>
          )}
        </div>
      </StyledSecondColumn>
    </StyledListItem>
  );
};

export default ResultListItem;
