import React, { FC, useState } from 'react';
import { Resource } from '../types/resource.types';
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
import { StyleWidths } from '../themes/mainTheme';

const StyledListItem: any = styled.li`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: block;
  }
`;

const StyledLinkButton: any = styled(Button)`
  flex-grow: 1;
  justify-content: space-between;
  margin-right: 2rem;
  max-width: ${StyleWidths.width3};
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: block;
    margin: 0 1rem;
  }
`;

const StyledActions: any = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-bottom: 3rem;
  }
`;

const StyledActionButton = styled(Button)`
  min-width: 8rem;
  height: 2.25rem;
  align-self: flex-start;
  margin-left: 1.5rem;
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
  );
};

export default ResourceListItem;
