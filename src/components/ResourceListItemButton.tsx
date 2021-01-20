import React, { FC, useState } from 'react';
import { Resource } from '../types/resource.types';
import { ListItem, ListItemText, TypographyTypeMap } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import Button from '@material-ui/core/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledListItemText = styled(ListItemText)`
  padding-left: 16px;
`;

const StyledTypography: OverridableComponent<TypographyTypeMap<unknown, 'span'>> = styled(Typography)`
  margin-top: 16px;
`;

const StyledListItem: any = styled(ListItem)`
  display: flex;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 45rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: block;
  }
`;

const StyledDeleteButton = styled(Button)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 16px;
  }
`;

interface ResourceListItemButtonProps {
  resource: Resource;
  showSubmitter?: boolean;
  showHandle?: boolean;
  showTimeCreated?: boolean;
  handleDelete?: () => void;
}

const ResourceListItemButton: FC<ResourceListItemButtonProps> = ({
  resource,
  showSubmitter = false,
  showHandle = false,
  showTimeCreated = false,
  handleDelete,
}) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
      <Button component="a" href={`/resource/${resource.identifier}`}>
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
      </Button>
      {handleDelete && (
        <>
          <StyledDeleteButton
            data-testid={`delete-my-resources-${resource.identifier}`}
            color="secondary"
            startIcon={<DeleteIcon fontSize="large" />}
            size="large"
            onClick={() => setShowConfirmDialog(true)}>
            {t('common.delete')} {window.innerWidth < 600 && resource.features.dlr_title}
          </StyledDeleteButton>
          <ConfirmDeleteDialog
            data-testid={`delete-my-resource-confirm-dialog-${resource.identifier}`}
            resourceIdentifier={resource.identifier}
            open={showConfirmDialog}
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

export default ResourceListItemButton;
