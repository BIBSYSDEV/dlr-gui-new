import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { DeviceWidths } from '../../themes/mainTheme';

interface DeleteRequestDialogProps {
  showConfirmDeleteDialog: boolean;
  setShowConfirmDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFunction: (deleteComment: string) => void;
}

const DeleteRequestDialog: FC<DeleteRequestDialogProps> = ({
  showConfirmDeleteDialog,
  setShowConfirmDeleteDialog,
  deleteFunction,
}) => {
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const [deleteComment, setDeleteComment] = useState('');
  const { t } = useTranslation();
  return (
    <Dialog
      fullScreen={fullScreenDialog}
      open={showConfirmDeleteDialog}
      onClose={() => setShowConfirmDeleteDialog(false)}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('work_list.delete_request')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('work_list.comment_explanation')}.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="comment-text-field"
          label={t('work_list.comment')}
          multiline
          rows={4}
          fullWidth
          required
          value={deleteComment}
          inputProps={{ 'data-testid': `delete-request-comment` }}
          onChange={(event) => setDeleteComment(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowConfirmDeleteDialog(false)}>{t('common.cancel')}</Button>
        <Button
          startIcon={<DeleteIcon />}
          disabled={deleteComment.length < 1}
          data-testid={`confirm-delete-request-button`}
          onClick={() => {
            setShowConfirmDeleteDialog(false);
            deleteFunction(deleteComment);
          }}
          color="secondary">
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRequestDialog;
