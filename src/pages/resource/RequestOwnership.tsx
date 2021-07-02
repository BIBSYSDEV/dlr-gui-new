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
import ErrorBanner from '../../components/ErrorBanner';
import { DeviceWidths } from '../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { Resource } from '../../types/resource.types';
import { requestOwnershipFromCurator } from '../../api/workListApi';

const DialogTitleId = 'ownership-dialog-title';

interface RequestOwnershipProps {
  resource: Resource;
  setRequestSentSuccess: (success: boolean) => void;
}

const RequestOwnership: FC<RequestOwnershipProps> = ({ resource, setRequestSentSuccess }) => {
  const { t } = useTranslation();
  const [showRequestOwnershipDialog, setShowRequestOwnershipDialog] = useState(false);
  const [ownershipComment, setOwnershipComment] = useState('');
  const [ownershipRequestError, setOwnershipRequestError] = useState<Error | undefined>();
  const useFullScreen = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);

  const askForOwnership = async () => {
    try {
      setRequestSentSuccess(false);
      setOwnershipRequestError(undefined);
      await requestOwnershipFromCurator(resource.identifier, ownershipComment);
      setShowRequestOwnershipDialog(false);
      setRequestSentSuccess(true);
    } catch (error) {
      setOwnershipRequestError(error);
    }
  };

  return (
    <>
      <Button
        data-testid="request-ownership-button"
        color="primary"
        variant="outlined"
        onClick={() => setShowRequestOwnershipDialog(true)}>
        Be om overføring av eierskap
      </Button>
      <Dialog
        maxWidth={'sm'}
        fullWidth
        fullScreen={useFullScreen}
        open={showRequestOwnershipDialog}
        aria-labelledby={DialogTitleId}
        data-testid={`ownership-dialog`}>
        <DialogTitle id={DialogTitleId}>Be om overføring av eierskap</DialogTitle>
        <DialogContent>
          <Typography>
            Skriv inn relevant informasjon om forespørselen til kurator. Du kan be om at eierskap kan overføres til noen
            andre enn deg selv.
          </Typography>
          <TextField
            required
            multiline
            rows={4}
            id="ownership-comment-text-field"
            fullWidth
            value={ownershipComment}
            onChange={(event) => setOwnershipComment(event.target.value)}
            inputProps={{ 'data-testid': 'ownership-dialog-input' }}
            label="kommentar"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            data-testid="ownership-dialog-cancel-button"
            onClick={() => setShowRequestOwnershipDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={!ownershipComment}
            autoFocus
            variant="contained"
            data-testid="ownership-dialog-submit-button"
            color="primary"
            onClick={() => askForOwnership()}>
            Send forespørsel
          </Button>
        </DialogActions>
        {ownershipRequestError && <ErrorBanner userNeedsToBeLoggedIn={true} error={ownershipRequestError} />}
      </Dialog>
    </>
  );
};

export default RequestOwnership;
