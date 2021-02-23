import React, { FC } from 'react';
import { Resource, ResourceFeatureTypes } from '../types/resource.types';
import { ListItemText } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Colors, StyleWidths } from '../themes/mainTheme';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import CClogoImage from './CClogoImage';

const StyledListItem: any = styled.li`
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.Background};
  margin-bottom: 0.5rem;
`;

const StyledLinkButton: any = styled(Button)`
  padding: 1rem;
  display: flex;
  max-width: ${StyleWidths.width4};
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: block;
  }
`;

const StyledFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 0 0.3rem;
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

const StyledListItemText = styled(ListItemText)`
  padding-left: 1rem;
`;

const StyledTypography = styled(Typography)`
  margin-top: 1rem;
`;

interface ResultListItemProps {
  resource: Resource;
}

const ResultListItem: FC<ResultListItemProps> = ({ resource }) => {
  const { t } = useTranslation();

  return (
    <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
      <StyledLinkButton component="a" href={`/resource/${resource.identifier}`}>
        <StyledFirstColumn>
          <StyledThumbnailWrapper>
            <Thumbnail
              resourceOrContentIdentifier={resource.identifier}
              alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
            />
            <StyledThumbnailMetadata>
              {resource.features.dlr_type && (
                <StyledFileTypeIcon>
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.audio.toUpperCase() && (
                    <VolumeUpIcon />
                  )}
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.image.toUpperCase() && (
                    <PhotoOutlinedIcon />
                  )}
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.presentation.toUpperCase() && (
                    <SlideshowIcon />
                  )}
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.simulation.toUpperCase() && (
                    <SlideshowIcon />
                  )}
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.video.toUpperCase() && (
                    <VideocamIcon />
                  )}
                  {resource.features.dlr_type.toUpperCase() === ResourceFeatureTypes.document.toUpperCase() && (
                    <DescriptionOutlinedIcon />
                  )}
                </StyledFileTypeIcon>
              )}
              <StyledFileName display="inline" variant="body2">
                {resource.features.dlr_title}
              </StyledFileName>
            </StyledThumbnailMetadata>
          </StyledThumbnailWrapper>
          <StyledLicense>
            <CClogoImage licenseCode={'CC BY 4.0'} />
          </StyledLicense>
        </StyledFirstColumn>
        <StyledListItemText
          primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
          secondary={
            <>
              {resource.features.dlr_submitter_email && (
                <StyledTypography variant="body2">{resource.features.dlr_submitter_email}</StyledTypography>
              )}
              {resource.features.dlr_time_created && (
                <StyledTypography variant="body2">{resource.features.dlr_time_created}</StyledTypography>
              )}
              {resource.features.dlr_identifier_handle && (
                <span>
                  {t('handle')}: {resource.features.dlr_identifier_handle}
                </span>
              )}
            </>
          }
        />
      </StyledLinkButton>
    </StyledListItem>
  );
};

export default ResultListItem;
