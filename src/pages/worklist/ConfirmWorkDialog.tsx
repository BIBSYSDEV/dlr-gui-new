import React, { FC } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, useMediaQuery } from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';

interface ConfirmWorkDialogProps {
  dialogTitle: string;
  setShowDeleteDialog: (status: boolean) => void;
  showDeleteDialog: boolean;
  dialogWarning: string;
}

const ConfirmWorkDialog: FC<ConfirmWorkDialogProps> = ({
  dialogWarning,
  setShowDeleteDialog,
  children,
  dialogTitle,
  showDeleteDialog,
}) => {
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  return (
    <Dialog
      onClose={() => setShowDeleteDialog(false)}
      aria-labelledby="form-dialog-title"
      fullScreen={fullScreenDialog}
      open={showDeleteDialog}>
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <Typography>{dialogWarning}</Typography>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  );
};

export default ConfirmWorkDialog;
