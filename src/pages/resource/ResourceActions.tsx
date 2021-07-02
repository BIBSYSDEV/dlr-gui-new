import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Grid, Typography } from '@material-ui/core';
import ReportResource from './ReportResource';
import RequestDOI from './RequestDOI';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { getMyUserAuthorizationProfileForResource } from '../../api/resourceApi';
import { ResourceAuthorizationProfilesName } from '../../types/user.types';
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
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [requestSentSuccess, setRequestSentSuccess] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const isAuthor = () => resource.features.dlr_submitter_email === user.id;
  const [isConsumer, setIsConsumer] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [errorLoadingAuthorization, setErrorLoadingAuthorization] = useState<Error | undefined>();

  useEffect(() => {
    const fetchAuthorization = async () => {
      if (user.id) {
        try {
          const authorizationProfiles = (await getMyUserAuthorizationProfileForResource(resource.identifier)).data;
          setIsConsumer(
            authorizationProfiles.profiles.some(
              (profile) => profile.name === ResourceAuthorizationProfilesName.CONSUMER
            )
          );
          setIsOwner(
            authorizationProfiles.profiles.some((profile) => profile.name === ResourceAuthorizationProfilesName.OWNER)
          );
        } catch (error) {
          setErrorLoadingAuthorization(error);
        }
      }
    };
    fetchAuthorization();
  }, [resource.identifier, user.id]);

  return (
    <>
      <Typography variant="h2">{t('common.actions')}</Typography>
      <StyledActionContentWrapper>
        <Grid container spacing={3}>
          <Grid item>
            <ReportResource setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
          </Grid>
          {(isAuthor() || isOwner) && (
            <Grid item>
              <RequestDOI setRequestSentSuccess={setRequestSentSuccess} resource={resource} />
            </Grid>
          )}
          {isConsumer && (
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
      </StyledActionContentWrapper>
      {errorLoadingAuthorization && <ErrorBanner error={errorLoadingAuthorization} />}
    </>
  );
};

export default ResourceUsage;
