import React, { FC, useState } from 'react';
import { Resource } from '../../types/resource.types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogActions, DialogContent, TextField, Typography } from '@material-ui/core';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { reportResource } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';

const StyledButton = styled(Button)`
  min-width: 10rem;
`;

const StyledActionContentWrapper = styled.div`
  margin-top: 1rem;
`;

interface ResourceUsageProps {
  resource: Resource;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportText, setReportText] = useState('');
  const [sendReportError, setSendReportError] = useState<Error>();

  const handleReport = async () => {
    setSendReportError(undefined);
    try {
      await reportResource(resource.identifier, reportText);
      setShowReportDialog(false);
    } catch (error) {
      setSendReportError(error);
    }
  };

  const cancelReport = () => {
    setShowReportDialog(false);
    setReportText('');
  };

  return (
    <>
      <Typography variant="h2">{t('common.actions')}</Typography>
      <StyledActionContentWrapper>
        <StyledButton
          data-testid={`report-resource-button`}
          color="primary"
          startIcon={<ReportProblemIcon fontSize="large" />}
          variant="outlined"
          onClick={() => setShowReportDialog(true)}>
          {t('common.report').toUpperCase()}
        </StyledButton>
        <Dialog
          maxWidth={'sm'}
          fullWidth
          open={showReportDialog}
          aria-labelledby="dialog-title"
          data-testid={`report-dialog`}>
          <DialogTitle id="report-dialog-title">{t('resource.reporting.report_resource')}</DialogTitle>
          <DialogContent>
            <TextField
              id="report-text"
              fullWidth
              inputProps={{ 'data-testid': 'report-dialog-input' }}
              label={t('resource.reporting.report_text_label')}
              onChange={(event) => {
                setReportText(event.target.value);
              }}
              multiline
              rows={4}
              variant="outlined"
              value={reportText}
            />
          </DialogContent>
          <DialogActions>
            <Button data-testid={`report-dialog-cancel-button`} onClick={cancelReport} color="default">
              {t('common.cancel')}
            </Button>
            <Button
              disabled={!reportText}
              data-testid={`report-dialog-submit-button`}
              onClick={handleReport}
              color="primary"
              variant="contained"
              autoFocus>
              {t('common.report')}
            </Button>
          </DialogActions>
          {sendReportError && <ErrorBanner error={sendReportError} />}
        </Dialog>
      </StyledActionContentWrapper>
    </>
  );
};

export default ResourceUsage;
