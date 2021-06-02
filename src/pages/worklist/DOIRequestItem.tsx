import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
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
  const [updateError, setUpdateError] = useState<Error>();
  const [deleteComment, setDeleteComment] = useState('');
  const { t } = useTranslation();

  const deleteRequest = async (ResourceIdentifier: string, comment: string) => {
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

  const contactApiForDoi = async (ResourceIdentifier: string) => {
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
                <Link href={`/resource/${workListRequestDOI.resourceIdentifier}`}>
                  {workListRequestDOI.resource?.features.dlr_title ?? workListRequestDOI.resourceIdentifier}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitter')}</Typography>
              <Typography>{workListRequestDOI.submitter}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitted')}</Typography>
              <Typography>{format(new Date(workListRequestDOI.submittedDate), 'dd.MM.yyyy')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption">{t('work_list.comment')}</Typography>
              {workListRequestDOI.description.length >= 150 && !showLongText && (
                <>
                  <Typography>{workListRequestDOI.description.slice(0, 150)}...</Typography>
                  <Button color="primary" onClick={() => setShowLongText(true)}>
                    {t('work_list.read_more')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length >= 150 && showLongText && (
                <>
                  <Typography>{workListRequestDOI.description}</Typography>
                  <Button color="primary" onClick={() => setShowLongText(false)}>
                    {t('work_list.hide')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length < 150 && <Typography>{workListRequestDOI.description}</Typography>}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container>
            <Grid item xs={5}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  contactApiForDoi(workListRequestDOI.resourceIdentifier);
                }}>
                {t('work_list.create_doi')}
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
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
        open={showConfirmDeleteDialog}
        onClose={() => setShowConfirmDeleteDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('work_list.delete_request')}</DialogTitle>
        <DialogContent>
          <DialogContentText>Here you can write a comment to why the request is being dismissed.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            multiline
            fullWidth
            value={deleteComment}
            onChange={(event) => setDeleteComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>Cancel</Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => {
              setShowConfirmDeleteDialog(false);
              deleteRequest(workListRequestDOI.resourceIdentifier, deleteComment);
            }}
            color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {updateError && <ErrorBanner />}
    </StyledListItemWrapper>
  );
};

export default DOIRequestItem;
