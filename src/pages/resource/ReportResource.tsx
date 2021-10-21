import React, { FC, useState } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions, DialogContent, TextField, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import ErrorBanner from '../../components/ErrorBanner';
import { useTranslation } from 'react-i18next';
import { DeviceWidths } from '../../themes/mainTheme';
import { reportResource } from '../../api/workListApi';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledButton = styled(Button)`
  min-width: 10rem;
`;

interface ReportResourceProps {
  resource: Resource;
  setRequestSentSuccess: (success: boolean) => void;
}

const ReportResource: FC<ReportResourceProps> = ({ resource, setRequestSentSuccess }) => {
  const { t } = useTranslation();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportText, setReportText] = useState('');
  const [sendReportError, setSendReportError] = useState<Error | AxiosError>();
  const useFullScreen = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);

  const handleReport = async () => {
    setSendReportError(undefined);
    setRequestSentSuccess(false);
    try {
      await reportResource(resource.identifier, reportText);
      setShowReportDialog(false);
      setRequestSentSuccess(true);
    } catch (error) {
      setSendReportError(handlePotentialAxiosError(error));
    }
  };

  const cancelReport = () => {
    setShowReportDialog(false);
    setReportText('');
  };
  return (
    <>
      <StyledButton
        data-testid={`report-resource-button`}
        color="primary"
        startIcon={<ReportProblemIcon fontSize="large" />}
        variant="outlined"
        onClick={() => setShowReportDialog(true)}>
        {t('common.report')}
      </StyledButton>
      <Dialog
        maxWidth={'sm'}
        fullWidth
        fullScreen={useFullScreen}
        open={showReportDialog}
        aria-labelledby="report-dialog-title"
        data-testid="report-dialog">
        <DialogTitle id="report-dialog-title">{t('resource.reporting.report_resource')}</DialogTitle>
        <DialogContent>
          <TextField
            id="report-text"
            fullWidth
            required
            inputProps={{ 'data-testid': 'report-dialog-input' }}
            label={t('resource.reporting.report_text_label')}
            onChange={(event) => setReportText(event.target.value)}
            multiline
            rows={4}
            variant="outlined"
            value={reportText}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" data-testid="report-dialog-cancel-button" onClick={cancelReport} color="primary">
            {t('common.cancel')}
          </Button>
          <Button
            disabled={!reportText}
            data-testid="report-dialog-submit-button"
            onClick={handleReport}
            color="primary"
            variant="contained"
            autoFocus>
            {t('common.report')}
          </Button>
        </DialogActions>
        {sendReportError && <ErrorBanner error={sendReportError} />}
      </Dialog>
    </>
  );
};

export default ReportResource;
