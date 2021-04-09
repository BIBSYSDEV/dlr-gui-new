import React, { FC, useState } from 'react';
import { Resource, ResourceCreationType } from '../types/resource.types';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { Colors, StyleWidths } from '../themes/mainTheme';
import { format } from 'date-fns';
import { getStyledFileTypeIcon } from './FileTypeIcon';

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

const StyledResourceTypeTypography = styled(Typography)`
  margin: 0.5rem 0 1rem 0;
`;

const StyledActionButton = styled(Button)`
  height: 2.25rem;
  align-self: flex-start;
  margin-left: 1.5rem;
`;
const StyledFileTypeIcon = styled.span`
  margin: 0.5rem 0.3rem 0.5rem 0.5rem;
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

  return (
    <StyledListItemWrapper>
      <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
        <Thumbnail
          institution={resource.features.dlr_storage_id ?? fallbackInstitution}
          resourceOrContentIdentifier={resource.identifier}
          alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
        />
        {/*//todo: mobilbisning*/}
        {/*//TODO: mangler data for last edit, filnavn og hvilke tilganger når begrenset*/}
        <StyledMetaDataColumn>
          <Typography variant="h4">{`${resource.features.dlr_title}`}</Typography>
          {resource.features.dlr_type && (
            <StyledFileTypeIcon>{getStyledFileTypeIcon(resource.features.dlr_type)}</StyledFileTypeIcon>
          )}
          <StyledResourceTypeTypography variant="body2">
            {resource.features.dlr_content_type === ResourceCreationType.FILE
              ? t('resource.metadata.file')
              : t('resource.metadata.link')}
          </StyledResourceTypeTypography>
          {resource.features.dlr_status_published
            ? resource.features.dlr_time_published && (
                <Typography variant="body1" color="textPrimary">
                  {t('resource.metadata.published')}:{' '}
                  {format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}
                </Typography>
              )
            : resource.features.dlr_time_created && (
                <Typography variant="body1" color="textPrimary">
                  {t('resource.metadata.created')}: {format(new Date(resource.features.dlr_time_created), 'dd.MM.yyyy')}
                </Typography>
              )}

          {resource.features.dlr_access && (
            <Typography variant="body1">{t(`resource.access_types.${resource.features.dlr_access}`)}</Typography>
          )}
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
