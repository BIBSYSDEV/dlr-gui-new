import React, { FC, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Grid, Typography } from '@material-ui/core';
import ReportResource from './ReportResource';
import RequestDOI from './RequestDOI';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';

const StyledActionContentWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ResourceUsageProps {
  resource: Resource;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const isAuthor = () => resource.features.dlr_submitter_email === user.id;

  return (
    <>
      <Typography variant="h2">{t('common.actions')}</Typography>
      <StyledActionContentWrapper>
        <Grid container spacing={3}>
          <Grid item>
            <ReportResource setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
          </Grid>
          {isAuthor() && (
            <Grid item>
              <RequestDOI setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
            </Grid>
          )}
        </Grid>
        {requestSentSuccess && (
          <StyledAlert severity="info">
            <AlertTitle>{t('resource.reporting.report_sent_feedback')}</AlertTitle>
          </StyledAlert>
        )}
      </StyledActionContentWrapper>
    </>
  );
};

export default ResourceUsage;
