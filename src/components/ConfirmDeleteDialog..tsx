import React, { FC, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ErrorBanner from './ErrorBanner';
import { useTranslation } from 'react-i18next';
import { deleteResource } from '../api/resourceApi';
import DeleteIcon from '@material-ui/icons/Delete';

interface ConfirmDeleteDialogProps {
  resourceIdentifier: string;
  resourceTitle: string;
  open: boolean;
  confirmedDelete: () => void;
  abortDelete: () => void;
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
  resourceIdentifier,
  open,
  abortDelete,
  confirmedDelete,
  resourceTitle,
}) => {
  const { t } = useTranslation();
  const [deleteErrorOccured, seDeleteErrorOccured] = useState<Error>();

  const performDeletion = async () => {
    try {
      seDeleteErrorOccured(undefined);
      await deleteResource(resourceIdentifier);
      confirmedDelete();
    } catch (error) {
      seDeleteErrorOccured(error);
    }
  };

  const performAbort = () => {
    abortDelete();
    seDeleteErrorOccured(undefined);
  };

  return (
    <Dialog
      open={open}
      onClose={performAbort}
      aria-labelledby="alert-dialog-title"
      data-testid={`delete-confirm-dialog`}>
      <DialogTitle id="alert-dialog-title">{`${t(
        'resource.delete_resource_confirmation'
      )} "${resourceTitle}"?`}</DialogTitle>
      <DialogContent>
        {!deleteErrorOccured && (
          <DialogContentText id="alert-dialog-description">
            {t('resource.delete_resource_description')}
          </DialogContentText>
        )}
        {deleteErrorOccured && <ErrorBanner error={deleteErrorOccured} />}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          data-testid={`delete-confirm-dialog-abort-button-${resourceIdentifier}`}
          onClick={performAbort}
          color="primary">
          {t('common.cancel')}
        </Button>
        {!deleteErrorOccured && (
          <Button
            data-testid={`delete-confirm-dialog-confirm-button-${resourceIdentifier}`}
            onClick={performDeletion}
            startIcon={<DeleteIcon />}
            color="secondary"
            variant="contained"
            autoFocus>
            {t('common.delete')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
