import React, { FC, useEffect, useState } from 'react';
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
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import { createDOI, refuseDoiRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import { getAuthoritiesForResourceCreatorOrContributor } from '../../api/authoritiesApi';

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
  const [isCreatingDOi, setIsCreatingDOi] = useState(false);
  const [busySearchingForAuthorities, setBusySearchingForAuthorities] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showConfirmCreateDOIDialog, setShowConfirmCreateDOIDialog] = useState(false);
  const [updateError, setUpdateError] = useState<Error>();
  const [searchingForAuthoritiesError, setSearchingForAuthoritiesError] = useState<Error>();
  const [deleteComment, setDeleteComment] = useState('');
  const [canCreateDOI, setCanCreateDOI] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const { t } = useTranslation();

  const handleDeleteDoiRequest = async (ResourceIdentifier: string, comment: string) => {
    try {
      setIsDeletingRequest(true);
      setUpdateError(undefined);
      await refuseDoiRequest(ResourceIdentifier, comment);
      setWorkListDoi((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(error);
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const handleCreateDoi = async (ResourceIdentifier: string) => {
    try {
      setIsCreatingDOi(true);
      setUpdateError(undefined);
      await createDOI(ResourceIdentifier);
      setWorkListDoi((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(error);
      setIsCreatingDOi(false);
    }
  };

  useEffect(() => {
    const isCreatorsVerified = async () => {
      if (workListRequestDOI.resource?.creators) {
        try {
          setBusySearchingForAuthorities(true);
          setSearchingForAuthoritiesError(undefined);
          const promiseArray: Promise<any>[] = [];
          workListRequestDOI.resource.creators.map((creator) => {
            return promiseArray.push(
              getAuthoritiesForResourceCreatorOrContributor(workListRequestDOI.resourceIdentifier, creator.identifier)
            );
          });
          const creatorAuthoritiesArray = await Promise.all(promiseArray);
          for (let i = 0; i < creatorAuthoritiesArray.length; i++) {
            if (creatorAuthoritiesArray[i].length > 0) {
              setCanCreateDOI(true);
            } else {
              setCanCreateDOI(false);
            }
          }
        } catch (error) {
          setSearchingForAuthoritiesError(error);
        } finally {
          setBusySearchingForAuthorities(false);
        }
      }
    };
    isCreatorsVerified();
  }, [workListRequestDOI]);

  return (
    <StyledListItemWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <WorkListRequestMetaDataViewer workListRequest={workListRequestDOI} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                href={`/editresource/${workListRequestDOI.resourceIdentifier}`}
                startIcon={<EditIcon />}
                variant="outlined"
                data-testid={`edit-resoirce-button-${workListRequestDOI.resourceIdentifier}`}
                color="primary">
                {t('resource.edit_resource')}
              </Button>
            </Grid>
            {!busySearchingForAuthorities && !canCreateDOI && (
              <Grid item xs={12}>
                <Typography variant="body2">{t('work_list.doi_verify_resource')}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                disabled={!canCreateDOI}
                data-testid={`create-doi-button-${workListRequestDOI.resourceIdentifier}`}
                variant="outlined"
                color="primary"
                endIcon={busySearchingForAuthorities && <CircularProgress size="1rem" />}
                onClick={() => {
                  setShowConfirmCreateDOIDialog(true);
                }}>
                {t('work_list.create_doi')}
              </Button>
            </Grid>
            {searchingForAuthoritiesError && (
              <Grid item xs={12}>
                <ErrorBanner userNeedsToBeLoggedIn={true} error={searchingForAuthoritiesError}></ErrorBanner>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                data-testid={`show-delete-dialog-${workListRequestDOI.resourceIdentifier}`}
                startIcon={<BlockIcon />}
                endIcon={isDeletingRequest && <CircularProgress size="1rem" />}
                onClick={() => {
                  setShowConfirmDeleteDialog(true);
                }}>
                {t('work_list.delete_request')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {isCreatingDOi && (
          <Grid xs={1} item>
            <CircularProgress size="1rem" />
          </Grid>
        )}
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
