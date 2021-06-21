import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress, Switch, Typography } from '@material-ui/core';
import { getEmailNotificationStatus, putEmailNotificationStatus } from '../../api/userApi';
import ErrorBanner from '../../components/ErrorBanner';
import { Error } from '@material-ui/icons';

const StyledBoxWrapper = styled.div`
  display: box;
`;

const StyledFlexWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const StyledSwitchTypography = styled(Typography)`
  margin-right: 1rem;
`;

const StyledSwitch = styled(Switch)`
  margin-right: 1rem;
`;

//TODO: cypress-tests
//TODO: translations
//TODO: aria-labels & WCAG

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const EmailNotificationSetting = () => {
  const [wantsToBeNotifiedByEmail, setWantsToBeNotifiedByEmail] = useState(false);
  const [loadingEmailNotificationSettingError, setLoadingEmailNotificationSettingError] = useState<Error | undefined>();
  const [savingEmailNotificationSettingError, setSavingEmailNotificationSettingError] = useState<Error | undefined>();
  const [loadingEmailNotificationSetting, setLoadingEmailNotificationSetting] = useState(false);
  const [savingEmailNotificationSetting, setSavingEmailNotificationSetting] = useState(false);

  useEffect(() => {
    const getEmailNotificationFromApi = async () => {
      try {
        setLoadingEmailNotificationSetting(true);
        setLoadingEmailNotificationSettingError(undefined);
        const status = await getEmailNotificationStatus();
        setWantsToBeNotifiedByEmail(status);
        await sleep(1000);
      } catch (error) {
        setLoadingEmailNotificationSettingError(error);
      } finally {
        setLoadingEmailNotificationSetting(false);
      }
    };
    getEmailNotificationFromApi();
  }, []);

  const handleEmailSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const status = event.target.checked;
      setSavingEmailNotificationSettingError(undefined);
      setSavingEmailNotificationSetting(true);
      await putEmailNotificationStatus(status);
      setWantsToBeNotifiedByEmail(status);
      await sleep(1000);
    } catch (error) {
      setSavingEmailNotificationSettingError(error);
    } finally {
      setSavingEmailNotificationSetting(false);
    }
  };

  return (
    <>
      <StyledBoxWrapper>
        <Typography gutterBottom variant="h3">
          Varsler
        </Typography>
      </StyledBoxWrapper>

      {loadingEmailNotificationSetting ? (
        <CircularProgress size="1.5rem" />
      ) : (
        <StyledFlexWrapper>
          {loadingEmailNotificationSettingError && (
            <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingEmailNotificationSettingError} />
          )}
          <StyledSwitchTypography>Motta varsler på epost</StyledSwitchTypography>
          <StyledSwitch
            checked={wantsToBeNotifiedByEmail}
            name="email"
            onChange={handleEmailSwitchChange}
            color="primary"
          />
          {savingEmailNotificationSetting && <CircularProgress size="1.5rem" />}
          {savingEmailNotificationSettingError && (
            <ErrorBanner userNeedsToBeLoggedIn={true} error={savingEmailNotificationSettingError} />
          )}
        </StyledFlexWrapper>
      )}
    </>
  );
};

export default EmailNotificationSetting;
