import React, { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { requestDOIFromCurator } from '../../api/workListApi';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';

interface RequestDOIProps {
  resource: Resource;
  setRequestSentSuccess: (success: boolean) => void;
}

const RequestDOI: FC<RequestDOIProps> = ({ resource, setRequestSentSuccess }) => {
  const { t } = useTranslation();
  const [showRequestDOIDialog, setShowRequestDOIDialog] = useState(false);
  const [DOIComment, setDOIComment] = useState('');
  const useFullScreen = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const [doiRequestFailureError, setDoiRequestFailureError] = useState<Error | undefined>();

  const askForDoi = async () => {
    try {
      setRequestSentSuccess(false);
      setDoiRequestFailureError(undefined);
      await requestDOIFromCurator(resource.identifier, DOIComment);
      setRequestSentSuccess(true);
      setShowRequestDOIDialog(false);
    } catch (error) {
      setDoiRequestFailureError(error);
    }
  };

  return (
    <>
      <Button
        data-testid="request-doi-button"
        color="primary"
        variant="outlined"
        onClick={() => setShowRequestDOIDialog(true)}>
        {t('resource.doi.request_doi')}
      </Button>
      <Dialog
        maxWidth={'sm'}
        fullWidth
        fullScreen={useFullScreen}
        open={showRequestDOIDialog}
        aria-labelledby="DOI-dialog-title"
        data-testid={`DOI-dialog`}>
        <DialogTitle id="report-dialog-title">{t('resource.doi.request_doi_long')}</DialogTitle>
        <DialogContent>
          <Typography>{t('resource.doi.write_comment')}</Typography>
          <TextField
            required
            multiline
            rows={4}
            id="DOI-comment-text-field"
            fullWidth
            value={DOIComment}
            onChange={(event) => setDOIComment(event.target.value)}
            inputProps={{ 'data-testid': 'doi-dialog-input' }}
            label={t('resource.doi.comment')}
          />
        </DialogContent>
        <DialogActions>
          <Button data-testid={`doi-dialog-cancel-button`} onClick={() => setShowRequestDOIDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={!DOIComment}
            autoFocus
            variant="contained"
            data-testid={`doi-dialog-submit-button`}
            color="primary"
            onClick={() => {
              askForDoi();
            }}>
            {t('resource.doi.request_doi')}
          </Button>
        </DialogActions>
        {doiRequestFailureError && <ErrorBanner error={doiRequestFailureError} />}
      </Dialog>
    </>
  );
};

export default RequestDOI;
