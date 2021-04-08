import React, { FC, useState } from 'react';
import { Resource, ResourceFeatureTypes } from '../types/resource.types';
import { ListItemText, TypographyTypeMap } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { Colors, StyleWidths } from '../themes/mainTheme';
import { format } from 'date-fns';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import VideocamIcon from '@material-ui/icons/Videocam';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

const StyledListItemWrapper: any = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width5};
  background-color: ${Colors.ResultListBackground};
  margin-bottom: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const StyledListItem: any = styled.li`
  width: 100%;
  max-width: ${StyleWidths.width4};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledMetaDataColumn = styled.div`
  padding-left: 1rem;
  flex: 1;
  //border: 1px solid blue;
`;

const StyledActions: any = styled.div`
  //border: 1px solid red;
  min-width: 17rem;
  display: flex;
  justify-content: flex-end;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-bottom: 3rem;
  }
`;

const StyledFileName = styled(Typography)`
  max-width: 6rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledActionButton = styled(Button)`
  height: 2.25rem;
  align-self: flex-start;
  margin-left: 1.5rem;
`;
const StyledFileTypeIcon = styled.span`
  margin: 0.5rem 0.3rem 0.5rem 0.5rem;
`;
const StyledTypography: OverridableComponent<TypographyTypeMap<unknown, 'span'>> = styled(Typography)`
  margin-top: 1rem;
`;

interface ResourceListItemProps {
  resource: Resource;
  handleDelete?: () => void;
  fallbackInstitution?: string;
}

const ResourceListItem: FC<ResourceListItemProps> = ({ resource, handleDelete, fallbackInstitution = '' }) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const history = useHistory();

  const handleClickEditButton = () => {
    history.push(`/editresource/${resource.identifier}`);
  };

  //todo: Extract
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
    <StyledListItemWrapper>
      <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
        <Thumbnail
          institution={resource.features.dlr_storage_id ?? fallbackInstitution}
          resourceOrContentIdentifier={resource.identifier}
          alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
        />
        <StyledMetaDataColumn>
          <Typography variant="h4">{`${resource.features.dlr_title}`}</Typography>
          {resource.features.dlr_type && (
            <StyledFileTypeIcon>{getStyledFileTypeIcon(resource.features.dlr_type)}</StyledFileTypeIcon>
          )}
          <StyledFileName display="inline" variant="body2">
            {resource.features.dlr_title}
          </StyledFileName>
          {resource.features.dlr_time_published && (
            <StyledTypography variant="body2" color="textPrimary">
              {t('Published')}: {format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}
            </StyledTypography>
          )}
          {resource.features.dlr_access && <StyledTypography>{resource.features.dlr_access}</StyledTypography>}
        </StyledMetaDataColumn>
        <StyledActions>
          {!resource.features.dlr_status_published && (
            <StyledActionButton
              data-testid={`edit-resource-button-${resource.identifier}`}
              color="primary"
              size="large"
              variant="outlined"
              onClick={handleClickEditButton}>
              {t('common.edit').toUpperCase()}
            </StyledActionButton>
          )}
          {handleDelete && (
            <>
              <StyledActionButton
                data-testid={`delete-my-resources-${resource.identifier}`}
                color="secondary"
                startIcon={<DeleteIcon fontSize="large" />}
                size="large"
                variant="outlined"
                onClick={() => setShowConfirmDialog(true)}>
                {t('common.delete').toUpperCase()}
              </StyledActionButton>
              <ConfirmDeleteDialog
                data-testid={`delete-my-resource-confirm-dialog-${resource.identifier}`}
                resourceIdentifier={resource.identifier}
                open={showConfirmDialog}
                resourceTitle={resource.features.dlr_title}
                confirmedDelete={() => {
                  setShowConfirmDialog(false);
                  handleDelete();
                }}
                abortDelete={() => {
                  setShowConfirmDialog(false);
                }}
              />
            </>
          )}
        </StyledActions>
      </StyledListItem>
    </StyledListItemWrapper>
  );
};

export default ResourceListItem;
