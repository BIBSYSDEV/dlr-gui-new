import React, { FC, useState } from 'react';
import { Resource, UserAuthorizationProfileForResource } from '../../types/resource.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import ReportResource from './ReportResource';
import RequestDOI from './RequestDOI';
import { Alert, AlertTitle } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import RequestOwnership from './RequestOwnership';
import ErrorBanner from '../../components/ErrorBanner';

const StyledActionContentWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ResourceUsageProps {
  resource: Resource;
  userResourceAuthorization: UserAuthorizationProfileForResource;
  errorLoadingAuthorization: Error | undefined;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource, userResourceAuthorization, errorLoadingAuthorization }) => {
  const { t } = useTranslation();
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const [requestDoiSentSuccess, setDoiRequestSentSuccess] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const canRequestChangeInOwnership =
    userResourceAuthorization.isConsumer && !!user.institutionAuthorities?.isPublisher;

  return (
    <>
      <Typography variant="h2">{t('common.actions')}</Typography>
      <StyledActionContentWrapper>
        <Grid container spacing={3}>
          <Grid item>
            <ReportResource setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
          </Grid>
          {(userResourceAuthorization.isOwner ||
            userResourceAuthorization.isCurator ||
            userResourceAuthorization.isEditor ||
            userResourceAuthorization.isAdmin) && (
            <Grid item>
              <RequestDOI setDoiRequestSentSuccess={setDoiRequestSentSuccess} resource={resource} />
            </Grid>
          )}
          {canRequestChangeInOwnership && (
            <Grid item>
              <RequestOwnership setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
            </Grid>
          )}
        </Grid>
        {requestSentSuccess && (
          <StyledAlert severity="info">
            <AlertTitle data-testid="request-sent-info">{t('resource.reporting.report_sent_feedback')}</AlertTitle>
          </StyledAlert>
        )}
        {requestDoiSentSuccess && (
          <StyledAlert severity="info">
            <AlertTitle data-testid="request-doi-sent-info">
              {t('resource.reporting.doi_request_sent_feedback')}
            </AlertTitle>
          </StyledAlert>
        )}
      </StyledActionContentWrapper>
      {errorLoadingAuthorization && <ErrorBanner error={errorLoadingAuthorization} />}
    </>
  );
};

export default ResourceUsage;
