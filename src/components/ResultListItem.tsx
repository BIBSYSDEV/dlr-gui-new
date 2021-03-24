import React, { FC } from 'react';
import { Resource, ResourceFeatureTypes } from '../types/resource.types';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../themes/mainTheme';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import { format } from 'date-fns';
import { Chip } from '@material-ui/core';
import CClogoImage from './CClogoImage';
import Link from '@material-ui/core/Link';
import { SearchParameters } from '../types/search.types';

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

const StyledThumbnailMetadata = styled.div`
  display: flex;
  align-items: center;
  height: 1.5rem;
`;

const StyledFileTypeIcon = styled.span`
  margin: 0.5rem 0.3rem 0.5rem 0.5rem;
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

const StyledFileName = styled(Typography)`
  max-width: 6rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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

const StyledLink = styled(Link)`
  color: black;
`;

interface ResultListItemProps {
  resource: Resource;
}

const ResultListItem: FC<ResultListItemProps> = ({ resource }) => {
  const { t } = useTranslation();

  const getStyledFileTypeIcon = (type: string) => {
    if (type.toUpperCase() === ResourceFeatureTypes.audio.toUpperCase()) return <VolumeUpIcon />;
    if (type.toUpperCase() === ResourceFeatureTypes.image.toUpperCase()) return <PhotoOutlinedIcon />;
    if (type.toUpperCase() === ResourceFeatureTypes.presentation.toUpperCase()) return <SlideshowIcon />;
    if (type.toUpperCase() === ResourceFeatureTypes.simulation.toUpperCase()) return <SlideshowIcon />;
    if (type.toUpperCase() === ResourceFeatureTypes.video.toUpperCase()) return <VideocamIcon />;
    if (type.toUpperCase() === ResourceFeatureTypes.document.toUpperCase()) return <DescriptionOutlinedIcon />;
    return <DescriptionOutlinedIcon />; //default
  };

  return (
    <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
      <StyledFirstColumn>
        <StyledThumbnailWrapper>
          <Thumbnail
            institution={resource.features.dlr_storage_id}
            resourceOrContentIdentifier={resource.identifier}
            alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
          />
          <StyledThumbnailMetadata>
            {resource.features.dlr_type && (
              <StyledFileTypeIcon>{getStyledFileTypeIcon(resource.features.dlr_type)}</StyledFileTypeIcon>
            )}
            <StyledFileName display="inline" variant="body2">
              {resource.features.dlr_title}
            </StyledFileName>
          </StyledThumbnailMetadata>
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
              <StyledLink href={`/resource/${resource.identifier}`}>{resource.features.dlr_title}</StyledLink>
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
              {resource.contributors.map((creator) => creator.features.dlr_contributor_name).join(', ')}
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
              {resource.tags.map((tag, index) => (
                <StyledChip
                  clickable
                  component="a"
                  href={`/?${SearchParameters.tag}=${tag}`}
                  key={index}
                  size="medium"
                  label={tag}
                />
              ))}
            </div>
          )}
        </div>
      </StyledSecondColumn>
    </StyledListItem>
  );
};

export default ResultListItem;
