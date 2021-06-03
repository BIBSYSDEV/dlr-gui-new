import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import { WorklistDOIRequest } from '../../types/Worklist.types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { createDOI, refuseDoiRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';

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
  workListRequestDOI: WorklistDOIRequest;
  setWorkListDoi: React.Dispatch<React.SetStateAction<WorklistDOIRequest[]>>;
}

const DOIRequestItem: FC<DOIRequestItemProps> = ({ workListRequestDOI, setWorkListDoi }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [showLongText, setShowLongText] = useState(false);
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3">
                <Link
                  href={`/resource/${workListRequestDOI.resourceIdentifier}`}
                  data-testid={`doi-request-item-title-${workListRequestDOI.resourceIdentifier}`}>
                  {workListRequestDOI.resource?.features.dlr_title ?? workListRequestDOI.resourceIdentifier}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitter')}</Typography>
              <Typography data-testid={`doi-request-item-submitter-${workListRequestDOI.resourceIdentifier}`}>
                {workListRequestDOI.submitter}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitted')}</Typography>
              <Typography data-testid={`doi-request-item-submitted-${workListRequestDOI.resourceIdentifier}`}>
                {format(new Date(workListRequestDOI.submittedDate), 'dd.MM.yyyy')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption">{t('work_list.comment')}</Typography>
              {workListRequestDOI.description.length >= 150 && !showLongText && (
                <>
                  <Typography data-testid={`doi-request-item-comment-short-${workListRequestDOI.resourceIdentifier}`}>
                    {workListRequestDOI.description.slice(0, 150)}...
                  </Typography>
                  <Button
                    data-testid={`doi-request-item-comment-read-more-button-${workListRequestDOI.resourceIdentifier}`}
                    color="primary"
                    onClick={() => setShowLongText(true)}>
                    {t('work_list.read_more')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length >= 150 && showLongText && (
                <>
                  <Typography data-testid={`doi-request-item-comment-long-${workListRequestDOI.resourceIdentifier}`}>
                    {workListRequestDOI.description}
                  </Typography>
                  <Button
                    aria-label={t('work_list.shorten_comments')}
                    color="primary"
                    onClick={() => setShowLongText(false)}>
                    {t('work_list.hide')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length < 150 && (
                <Typography data-testid={`doi-request-item-comment-long-${workListRequestDOI.resourceIdentifier}`}>
                  {workListRequestDOI.description}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <Button
                variant="outlined"
                data-testid={`create-doi-button-${workListRequestDOI.resourceIdentifier}`}
                color="primary"
                onClick={() => {
                  setShowConfirmCreateDOIDialog(true);
                }}>
                {t('work_list.create_doi')}
              </Button>
            </Grid>

            <Grid item xs={11} md={6}>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
                data-testid={`show-delete-dialog-${workListRequestDOI.resourceIdentifier}`}
                onClick={() => {
                  setShowConfirmDeleteDialog(true);
                }}>
                {t('work_list.delete_request')}
              </Button>
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
            inputProps={{ 'data-testid': `delete-doi-request-comment-${workListRequestDOI.resourceIdentifier}` }}
            onChange={(event) => setDeleteComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button
            startIcon={<DeleteIcon />}
            disabled={deleteComment.length < 1}
            data-testid={`confirm-delete-doi-button-${workListRequestDOI.resourceIdentifier}`}
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
            data-testid={`confirm-create-doi-button-${workListRequestDOI.resourceIdentifier}`}
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
