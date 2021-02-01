import React, { FC, useState } from 'react';
import { Resource } from '../types/resource.types';
import { ListItem, ListItemText, TypographyTypeMap } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const StyledListItem: any = styled(ListItem)`
  justify-content: space-between;
  margin-right: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: block;
    width: 100vw;
  }
`;

const StyledDeleteButton = styled(Button)`
  min-width: 8rem;
  height: 2.25rem;
  align-self: flex-start;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 1.5rem;
  }
`;

const StyledEditButton = styled(Button)`
  min-width: 8rem;
  height: 2.25rem;
  align-self: flex-start;
`;

const StyledLinkButton: any = styled(Button)`
  flex-grow: 1;
`;

const StyledListItemText = styled(ListItemText)`
  padding-left: 16px;
`;

const StyledTypography: OverridableComponent<TypographyTypeMap<unknown, 'span'>> = styled(Typography)`
  margin-top: 16px;
`;

interface ResourceListItemProps {
  resource: Resource;
  showSubmitter?: boolean;
  showHandle?: boolean;
  showTimeCreated?: boolean;
  handleDelete?: () => void;
}

const ResourceListItem: FC<ResourceListItemProps> = ({
  resource,
  showSubmitter = false,
  showHandle = false,
  showTimeCreated = false,
  handleDelete,
}) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const history = useHistory();

  const handleClickEditButton = () => {
    history.push(`/editresource/${resource.identifier}`);
  };

  return (
    <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
      <StyledLinkButton component="a" href={`/resource/${resource.identifier}`}>
        <Thumbnail
          resourceIdentifier={resource.identifier}
          alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
        />
        <StyledListItemText
          primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
          secondary={
            <>
              {showSubmitter && resource.features.dlr_submitter_email && (
                <StyledTypography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                  {resource.features.dlr_submitter_email}
                </StyledTypography>
              )}
              {showTimeCreated && resource.features.dlr_time_created && (
                <StyledTypography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                  {resource.features.dlr_time_created}
                </StyledTypography>
              )}
              {resource.features.dlr_identifier_handle && showHandle && (
                <span>
                  {t('handle')}: {resource.features.dlr_identifier_handle}
                </span>
              )}
            </>
          }
        />
      </StyledLinkButton>
      {!resource.features.dlr_status_published && (
        <StyledEditButton
          data-testid={`edit-resource-button-${resource.identifier}`}
          color="primary"
          size="large"
          variant="outlined"
          onClick={handleClickEditButton}>
          {t('common.edit').toUpperCase()}
        </StyledEditButton>
      )}
      {handleDelete && (
        <>
          <StyledDeleteButton
            data-testid={`delete-my-resources-${resource.identifier}`}
            color="secondary"
            startIcon={<DeleteIcon fontSize="large" />}
            size="large"
            variant="outlined"
            onClick={() => setShowConfirmDialog(true)}>
            {t('common.delete').toUpperCase()}
          </StyledDeleteButton>
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
    </StyledListItem>
  );
};

export default ResourceListItem;
