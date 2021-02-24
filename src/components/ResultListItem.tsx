import React, { FC } from 'react';
import { Resource, ResourceFeatureTypes } from '../types/resource.types';
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
import { format } from 'date-fns';

const StyledListItem: any = styled.li`
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.Background};
  margin-bottom: 0.5rem;
`;

const StyledLinkButton: any = styled(Button)`
  padding: 1rem;
  display: flex;
  justify-content: left;
  flex-direction: row;
  align-items: start;
  max-width: ${StyleWidths.width4};
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

const StyledSecondColumn = styled.div`
  padding-left: 1rem;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-left: 0;
    padding-top: 1rem;
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

interface ResultListItemProps {
  resource: Resource;
}

const ResultListItem: FC<ResultListItemProps> = ({ resource }) => {
  const { t } = useTranslation();

  const getStyledFileTypeIcon = (type: string) => (
    <>
      {type.toUpperCase() === ResourceFeatureTypes.audio.toUpperCase() && <VolumeUpIcon />}
      {type.toUpperCase() === ResourceFeatureTypes.image.toUpperCase() && <PhotoOutlinedIcon />}
      {type.toUpperCase() === ResourceFeatureTypes.presentation.toUpperCase() && <SlideshowIcon />}
      {type.toUpperCase() === ResourceFeatureTypes.simulation.toUpperCase() && <SlideshowIcon />}
      {type.toUpperCase() === ResourceFeatureTypes.video.toUpperCase() && <VideocamIcon />}
      {type.toUpperCase() === ResourceFeatureTypes.document.toUpperCase() && <DescriptionOutlinedIcon />}
    </>
  );

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
                <StyledFileTypeIcon>{getStyledFileTypeIcon(resource.features.dlr_type)}</StyledFileTypeIcon>
              )}
              <StyledFileName display="inline" variant="body2">
                {resource.features.dlr_title}
              </StyledFileName>
            </StyledThumbnailMetadata>
          </StyledThumbnailWrapper>
          <StyledLicense>
            {/*todo:ekte data*/}
            <CClogoImage licenseCode={'CC BY 4.0'} />
          </StyledLicense>
        </StyledFirstColumn>
        <StyledSecondColumn>
          <StyledHeader>
            <Typography variant="h4">{resource.features.dlr_title}</Typography>
            <Typography variant="body1">{format(resource.features.dlr_time_created, 'DD.MM.YYYY')}</Typography>
          </StyledHeader>

          {resource.creators && resource.creators.length !== 0 && (
            <Typography variant="body1">
              {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
              {/*todo:max lengde*/}
            </Typography>
          )}

          {resource.contributors && resource.contributors.length !== 0 && (
            <Typography variant="body1">
              {resource.contributors.map((creator) => creator.features.dlr_contributor_name).join(', ')}
              {/*todo:max lengde*/}
            </Typography>
          )}

          {resource.features.dlr_description && (
            <Typography variant="body1">{resource.features.dlr_description}</Typography>
          )}
          {/*todo:keywords*/}
        </StyledSecondColumn>
      </StyledLinkButton>
    </StyledListItem>
  );
};

export default ResultListItem;
