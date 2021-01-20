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

interface ConfirmDeleteDialogProps {
  resourceIdentifier: string;
  open: boolean;
  confirmedDelete: () => void;
  abortDelete: () => void;
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({
  resourceIdentifier,
  open,
  abortDelete,
  confirmedDelete,
}) => {
  const { t } = useTranslation();
  const [deleteErrorOccured, seDeleteErrorOccured] = useState(false);

  const performDeletion = async () => {
    try {
      await deleteResource(resourceIdentifier);
      seDeleteErrorOccured(false);
      confirmedDelete();
    } catch (error) {
      seDeleteErrorOccured(true);
    }
  };

  const performAbort = () => {
    abortDelete();
    seDeleteErrorOccured(false);
  };

  return (
    <Dialog
      open={open}
      onClose={performAbort}
      aria-labelledby="alert-dialog-title"
      data-testid={`delete-confirm-dialog`}>
      <DialogTitle id="alert-dialog-title">{`${t('resource.delete_resource_confirmation')}?`}</DialogTitle>
      <DialogContent>
        {!deleteErrorOccured && (
          <DialogContentText id="alert-dialog-description">
            {t('resource.delete_resource_description')}
          </DialogContentText>
        )}
        {deleteErrorOccured && <ErrorBanner />}
      </DialogContent>
      <DialogActions>
        <Button
          data-testid={`delete-confirm-dialog-abort-button-${resourceIdentifier}`}
          onClick={performAbort}
          color="primary">
          {t('common.cancel')}
        </Button>
        {!deleteErrorOccured && (
          <Button
            data-testid={`delete-confirm-dialog-confirm-button-${resourceIdentifier}`}
            onClick={performDeletion}
            color="primary"
            autoFocus>
            {t('common.delete')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
