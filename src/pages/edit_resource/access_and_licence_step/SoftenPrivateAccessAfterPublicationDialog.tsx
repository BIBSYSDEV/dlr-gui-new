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
import { useTranslation } from 'react-i18next';

const ConfirmDialogTitleId = 'confirm-dialog-title';
const ConfirmDialogDescriptionId = 'confirm-dialog-description';

interface SoftenPrivateAccessAfterPublicationDialogProps {
  accessType: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  softenPrivateAccess: () => void;
}

const SoftenPrivateAccessAfterPublicationDialog: FC<SoftenPrivateAccessAfterPublicationDialogProps> = ({
  accessType,
  open,
  softenPrivateAccess,
  setOpen,
}) => {
  const fullscreen = useMediaQuery(`(max-width:${DeviceWidths.md}px)`);
  const { t } = useTranslation();

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullscreen}
      onClose={onClose}
      open={open}
      aria-labelledby={`${accessType}-${ConfirmDialogTitleId}`}
      aria-describedby={`${accessType}-${ConfirmDialogDescriptionId}`}>
      <DialogTitle id={`${accessType}-${ConfirmDialogTitleId}`}>{t('access.confirm_change')}</DialogTitle>
      <DialogContent id={`${accessType}-${ConfirmDialogDescriptionId}`}>
        <DialogContentText>{t('access.are_your_sure_warning')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="confirm-dialog-button"
          autoFocus
          onClick={() => {
            onClose();
            softenPrivateAccess();
          }}
          variant="contained"
          color="primary">
          {t('common.confirm')}
        </Button>
        <Button onClick={onClose} variant="contained">
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoftenPrivateAccessAfterPublicationDialog;
