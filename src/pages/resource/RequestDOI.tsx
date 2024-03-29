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
} from '@mui/material';
import { DeviceWidths } from '../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { requestDOIFromCurator } from '../../api/workListApi';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const DialogTitleId = 'doi-dialog-title';

interface RequestDOIProps {
  resource: Resource;
  setDoiRequestSentSuccess: (success: boolean) => void;
}

const RequestDOI: FC<RequestDOIProps> = ({ resource, setDoiRequestSentSuccess }) => {
  const { t } = useTranslation();
  const [showRequestDOIDialog, setShowRequestDOIDialog] = useState(false);
  const [DOIComment, setDOIComment] = useState('');
  const useFullScreen = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const [DOIRequestFailureError, setDOIRequestFailureError] = useState<Error | AxiosError>();

  const askForDoi = async () => {
    try {
      setDoiRequestSentSuccess(false);
      setDOIRequestFailureError(undefined);
      await requestDOIFromCurator(resource.identifier, DOIComment);
      setDoiRequestSentSuccess(true);
      setShowRequestDOIDialog(false);
    } catch (error) {
      setDOIRequestFailureError(handlePotentialAxiosError(error));
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
        aria-labelledby={DialogTitleId}
        data-testid={`doi-dialog`}>
        <DialogTitle id={DialogTitleId}>{t('resource.doi.request_doi_long')}</DialogTitle>
        <DialogContent>
          <Typography>{t('resource.doi.write_comment')}</Typography>
          <TextField
            required
            multiline
            rows={4}
            id="doi-comment-text-field"
            fullWidth
            value={DOIComment}
            onChange={(event) => setDOIComment(event.target.value)}
            inputProps={{ 'data-testid': 'doi-dialog-input' }}
            label={t('resource.doi.comment')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            data-testid="doi-dialog-cancel-button"
            onClick={() => setShowRequestDOIDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={!DOIComment}
            autoFocus
            variant="contained"
            data-testid="doi-dialog-submit-button"
            color="primary"
            onClick={() => askForDoi()}>
            {t('resource.doi.request_doi')}
          </Button>
        </DialogActions>
        {DOIRequestFailureError && <ErrorBanner error={DOIRequestFailureError} />}
      </Dialog>
    </>
  );
};

export default RequestDOI;
