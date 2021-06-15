import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import { WorklistRequest } from '../../types/Worklist.types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import { createDOI, refuseDoiRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';

const StyledButton = styled(Button)`
  min-width: 7rem;
`;

interface Props {
  backgroundColor: string;
}

const StyledListItemWrapper: any = styled.li<Props>`
  width: 100%;
  max-width: ${StyleWidths.width5};
  background-color: ${(props: any) => props.backgroundColor || Colors.UnitTurquoise_20percent};
  padding: 1rem;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

interface DOIRequestItemProps {
  workListRequestDOI: WorklistRequest;
  setWorkListDoi: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const DOIRequestItem: FC<DOIRequestItemProps> = ({ workListRequestDOI, setWorkListDoi }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showConfirmCreateDOIDialog, setShowConfirmCreateDOIDialog] = useState(false);
  const [updateError, setUpdateError] = useState<Error>();
  const [deleteComment, setDeleteComment] = useState('');
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const { t } = useTranslation();

  const handleDeleteDoiRequest = async (ResourceIdentifier: string, comment: string) => {
    try {
      setIsBusy(true);
      setUpdateError(undefined);
      await refuseDoiRequest(ResourceIdentifier, comment);
      setWorkListDoi((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreateDoi = async (ResourceIdentifier: string) => {
    try {
      setIsBusy(true);
      setUpdateError(undefined);
      await createDOI(ResourceIdentifier);
      setWorkListDoi((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(error);
      setIsBusy(false);
    }
  };

  return (
    <StyledListItemWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <WorkListRequestMetaDataViewer workListRequest={workListRequestDOI} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <StyledButton
                variant="outlined"
                data-testid={`create-doi-button-${workListRequestDOI.resourceIdentifier}`}
                color="primary"
                onClick={() => {
                  setShowConfirmCreateDOIDialog(true);
                }}>
                {t('work_list.create_doi')}
              </StyledButton>
            </Grid>

            <Grid item xs={11} md={6}>
              <StyledButton
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
                data-testid={`show-delete-dialog-${workListRequestDOI.resourceIdentifier}`}
                onClick={() => {
                  setShowConfirmDeleteDialog(true);
                }}>
                {t('work_list.delete_request')}
              </StyledButton>
            </Grid>
            {isBusy && (
              <Grid xs={1} item>
                <CircularProgress size="1rem" />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
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
            inputProps={{ 'data-testid': `delete-doi-request-comment` }}
            onChange={(event) => setDeleteComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button
            startIcon={<DeleteIcon />}
            disabled={deleteComment.length < 1}
            data-testid={`confirm-delete-doi-button`}
            onClick={() => {
              setShowConfirmDeleteDialog(false);
              handleDeleteDoiRequest(workListRequestDOI.resourceIdentifier, deleteComment);
            }}
            color="secondary">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreenDialog}
        open={showConfirmCreateDOIDialog}
        onClose={() => setShowConfirmCreateDOIDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('work_list.are_you_sure')}?</DialogTitle>
        <DialogActions>
          <Button
            data-testid={`confirm-create-doi-button`}
            variant="contained"
            onClick={() => {
              setShowConfirmCreateDOIDialog(false);
              handleCreateDoi(workListRequestDOI.resourceIdentifier);
            }}
            color="primary">
            {t('work_list.create_doi')}
          </Button>
          <Button onClick={() => setShowConfirmCreateDOIDialog(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
      {updateError && <ErrorBanner />}
    </StyledListItemWrapper>
  );
};

export default DOIRequestItem;
