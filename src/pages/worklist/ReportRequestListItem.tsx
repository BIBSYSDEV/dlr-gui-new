import React, { FC, useState } from 'react';
import { WorklistRequest } from '../../types/Worklist.types';
import styled from 'styled-components';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import BlockIcon from '@material-ui/icons/Block';
import { useTranslation } from 'react-i18next';
import { deleteResource } from '../../api/resourceApi';
import { refuseComplaintReport } from '../../api/workListApi';
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

interface ReportListItem {
  reportWorkListRequest: WorklistRequest;
  setWorkListReport: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const ReportRequestListItem: FC<ReportListItem> = ({ reportWorkListRequest, setWorkListReport }) => {
  const [showDeleteRequestDialog, setShowDeleteRequestDialog] = useState(false);
  const [showDeleteResourceDialog, setShowDeleteResourceDialog] = useState(false);
  const [disableAllButtons, setDisableAllButtons] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [isDeletingResource, setIsDeletingResource] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const { t } = useTranslation();

  const handleDeleteReportRequest = async () => {
    try {
      setDisableAllButtons(true);
      setIsDeletingRequest(true);
      setError(undefined);
      await refuseComplaintReport(reportWorkListRequest.identifier);
      setWorkListReport((prevState) =>
        prevState.filter((work) => work.identifier !== reportWorkListRequest.identifier)
      );
    } catch (error) {
      setError(error);
    } finally {
      setIsDeletingRequest(false);
      setDisableAllButtons(false);
    }
  };

  const handleDeleteResource = async () => {
    try {
      setIsDeletingResource(true);
      setDisableAllButtons(true);
      setError(undefined);
      const deleteRequestPromise = refuseComplaintReport(reportWorkListRequest.identifier);
      await deleteResource(reportWorkListRequest.resourceIdentifier);
      setWorkListReport((prevState) =>
        prevState.filter((work) => work.resourceIdentifier !== reportWorkListRequest.resourceIdentifier)
      );
      await deleteRequestPromise;
    } catch (error) {
      setError(error);
    } finally {
      setIsDeletingResource(false);
      setDisableAllButtons(false);
    }
  };

  return (
    <>
      <StyledListItemWrapper backgroundColor={Colors.DLRColdGreen1}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <WorkListRequestMetaDataViewer workListRequest={reportWorkListRequest} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <Button
                  disabled={disableAllButtons}
                  href={`/editresource/${reportWorkListRequest.resourceIdentifier}`}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  color="primary">
                  Rediger ressurs
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={disableAllButtons}
                  onClick={() => setShowDeleteResourceDialog(true)}
                  startIcon={<DeleteIcon />}
                  endIcon={isDeletingResource && <CircularProgress size="1rem" />}
                  variant="outlined"
                  color="secondary">
                  Slett ressurs
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={disableAllButtons}
                  onClick={() => setShowDeleteRequestDialog(true)}
                  startIcon={<BlockIcon />}
                  endIcon={isDeletingRequest && <CircularProgress size="1rem" />}
                  variant="outlined"
                  color="secondary">
                  Slett rapportering
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {error && <ErrorBanner userNeedsToBeLoggedIn={true} />}
        </Grid>
      </StyledListItemWrapper>
      <Dialog
        onClose={() => setShowDeleteRequestDialog(false)}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreenDialog}
        open={showDeleteRequestDialog}>
        <DialogTitle id="form-dialog-title">Slett rapportering</DialogTitle>
        <DialogContent>
          <Typography>Dette sletter rapporteringen og ikke selve ressursen</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<BlockIcon />}
            data-testid={`confirm-delete-button`}
            variant="contained"
            onClick={() => {
              setShowDeleteRequestDialog(false);
              handleDeleteReportRequest();
            }}
            color="secondary">
            Slett rapportering
          </Button>
          <Button onClick={() => setShowDeleteRequestDialog(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={() => setShowDeleteResourceDialog(false)}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreenDialog}
        open={showDeleteResourceDialog}>
        <DialogTitle id="form-dialog-title">
          Slett
          {reportWorkListRequest.resource?.features.dlr_title
            ? ` "${reportWorkListRequest.resource.features.dlr_title}"`
            : ' ressursen'}
          ?
        </DialogTitle>
        <DialogContent>
          <Typography>NB! Dette sletter selve ressursen permanent</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DeleteIcon />}
            data-testid={`confirm-delete-button`}
            variant="contained"
            onClick={() => {
              setShowDeleteResourceDialog(false);
              handleDeleteResource();
            }}
            color="secondary">
            Slett ressurs
          </Button>
          <Button onClick={() => setShowDeleteResourceDialog(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportRequestListItem;
