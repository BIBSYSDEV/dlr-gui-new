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
      <Button color="primary" variant="outlined" onClick={() => setShowRequestDOIDialog(true)}>
        Request DOI
      </Button>
      <Dialog
        maxWidth={'sm'}
        fullWidth
        fullScreen={useFullScreen}
        open={showRequestDOIDialog}
        aria-labelledby="DOI-dialog-title"
        data-testid={`DOI-dialog`}>
        <DialogTitle id="report-dialog-title">{t('Forespør DOI')}</DialogTitle>
        <DialogContent>
          <Typography>{t('Skriv inn relevant informasjon om forespørselen')}</Typography>
          <TextField
            multiline
            rows={4}
            id="DOI-comment-text-field"
            fullWidth
            value={DOIComment}
            onChange={(event) => setDOIComment(event.target.value)}
            inputProps={{ 'data-testid': 'DOI-dialog-input' }}
            label={t('Kommentar')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            data-testid={`report-dialog-submit-button`}
            color="primary"
            onClick={() => {
              askForDoi();
            }}>
            Be om DOI
          </Button>
          <Button data-testid={`DOI-dialog-cancel-button`} onClick={() => setShowRequestDOIDialog(false)}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
        {doiRequestFailureError && <ErrorBanner error={doiRequestFailureError} />}
      </Dialog>
    </>
  );
};

export default RequestDOI;
