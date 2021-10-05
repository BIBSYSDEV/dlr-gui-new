import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from '@material-ui/core';
import { DeviceWidths } from '../../../themes/mainTheme';

const ConfirmDialogTitleId = 'confirm-dialog-title';
const ConfirmDialogDescriptionId = 'confirm-dialog-description';

interface SoftenPrivateAccessAfterPublicationDialogProps {
  type: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  softenPrivateAccess: () => void;
}

const SoftenPrivateAccessAfterPublicationDialog: FC<SoftenPrivateAccessAfterPublicationDialogProps> = ({
  type,
  open,
  softenPrivateAccess,
  setOpen,
}) => {
  const fullscreen = useMediaQuery(`(max-width:${DeviceWidths.md}px)`);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullscreen}
      onClose={onClose}
      open={open}
      aria-labelledby={`${type}-${ConfirmDialogTitleId}`}
      aria-describedby={`${type}-${ConfirmDialogDescriptionId}`}>
      <DialogTitle id={`${type}-${ConfirmDialogTitleId}`}>Confirm change in access</DialogTitle>
      <DialogContent id={`${type}-${ConfirmDialogDescriptionId}`}>
        <DialogContentText>Er du sikker på denne endringen? Dette kan ikke reverseres</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            onClose();
            softenPrivateAccess();
          }}
          variant="contained"
          color="primary">
          Confirm
        </Button>
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoftenPrivateAccessAfterPublicationDialog;
