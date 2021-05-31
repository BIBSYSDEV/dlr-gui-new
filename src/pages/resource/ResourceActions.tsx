import React, { FC, useState } from 'react';
import { Resource } from '../../types/resource.types';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogActions, DialogContent, TextField, Typography } from '@material-ui/core';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

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

  const handleReport = () => {
    console.log('report');
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
          aria-labelledby="alert-dialog-title"
          data-testid={`delete-confirm-dialog`}>
          <DialogTitle id="alert-dialog-title">{t('report_resource')}</DialogTitle>
          <DialogContent>
            <TextField
              id="report-text"
              fullWidth
              label={t('report_text')}
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
              data-testid={`report-dialog-report-button`}
              onClick={handleReport}
              color="primary"
              variant="contained"
              autoFocus>
              {t('common.report')}
            </Button>
          </DialogActions>
        </Dialog>{' '}
      </StyledActionContentWrapper>
    </>
  );
};

export default ResourceUsage;
