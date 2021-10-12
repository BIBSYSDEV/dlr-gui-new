import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress, FormControlLabel, Switch, Typography } from '@mui/material';
import { getEmailNotificationStatus, putEmailNotificationStatus } from '../../api/userApi';
import ErrorBanner from '../../components/ErrorBanner';
import { Error } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../themes/mainTheme';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledBoxWrapper = styled.div`
  display: box;
`;

const StyledFlexWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

//with yellow background it's impossible to see the default focus styling for Material-ui Switch.
const StyledSwitch: any = styled(Switch)`
  margin-left: 1.5rem;
  .Mui-focusVisible {
    background-color: ${Colors.BlackOpaque25};
  }
  .Mui-focusVisible.Mui-checked {
    background-color: ${Colors.PrimaryOpaque20};
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 1rem;
  margin-left: 0;
`;

const emailNotificationLabel = 'email-notification-label';

const EmailNotificationSetting = () => {
  const user = useSelector((state: RootState) => state.user);
  const [wantsToBeNotifiedByEmail, setWantsToBeNotifiedByEmail] = useState(false);
  const [loadingEmailNotificationSettingError, setLoadingEmailNotificationSettingError] = useState<
    Error | AxiosError
  >();
  const [savingEmailNotificationSettingError, setSavingEmailNotificationSettingError] = useState<Error | AxiosError>();
  const [loadingEmailNotificationSetting, setLoadingEmailNotificationSetting] = useState(false);
  const [savingEmailNotificationSetting, setSavingEmailNotificationSetting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const getEmailNotificationFromApi = async () => {
      try {
        setLoadingEmailNotificationSetting(true);
        setLoadingEmailNotificationSettingError(undefined);
        const status = await getEmailNotificationStatus();
        setWantsToBeNotifiedByEmail(status);
      } catch (error) {
        setLoadingEmailNotificationSettingError(handlePotentialAxiosError(error));
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
    } catch (error) {
      setSavingEmailNotificationSettingError(handlePotentialAxiosError(error));
    } finally {
      setSavingEmailNotificationSetting(false);
    }
  };

  return (
    <>
      <StyledBoxWrapper>
        <Typography gutterBottom variant="h3">
          {t('profile.notifications')}
        </Typography>
      </StyledBoxWrapper>

      {loadingEmailNotificationSetting ? (
        <CircularProgress size="1.5rem" />
      ) : (
        <StyledFlexWrapper>
          {loadingEmailNotificationSettingError && (
            <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingEmailNotificationSettingError} />
          )}
          <StyledFormControlLabel
            labelPlacement="start"
            control={
              <StyledSwitch
                inputProps={{
                  'aria-labelledby': emailNotificationLabel,
                  'data-testid': 'email-notifications-checkbox',
                }}
                checked={wantsToBeNotifiedByEmail}
                onChange={handleEmailSwitchChange}
                name="email"
                color="primary"
              />
            }
            label={
              <>
                <Typography>{t('profile.receive_notifications_email', { email: user.email })}</Typography>
                <Typography variant="body2">
                  {t('profile.receive_notifications_email_details_least_privilege')}.
                </Typography>
                {user.institutionAuthorities?.isCurator && (
                  <Typography variant="body2">{t('profile.receive_notifications_email_details_curator')}.</Typography>
                )}
                {user.institutionAuthorities?.isEditor && (
                  <Typography variant="body2">{t('profile.receive_notifications_email_details_editor')}.</Typography>
                )}
              </>
            }
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
