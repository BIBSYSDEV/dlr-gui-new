import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CircularProgress, Switch, Typography } from '@material-ui/core';
import { getEmailNotificationStatus, putEmailNotificationStatus } from '../../api/userApi';

const StyledBoxWrapper = styled.div`
  display: box;
`;

const StyledFlexWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  margin-bottom: 1rem;
`;

const EmailNotificationSetting = () => {
  const [wantsToBeNotifiedByEmail, setWantsToBeNotifiedByEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEmailNotificationFromApi = async () => {
      try {
        setLoading(true);
        const status = await getEmailNotificationStatus();
        setWantsToBeNotifiedByEmail(status);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getEmailNotificationFromApi();
  }, []);

  const handleEmailSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const status = event.target.checked;
      setLoading(true);
      await putEmailNotificationStatus(status);
      setWantsToBeNotifiedByEmail(status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledBoxWrapper>
        <Typography gutterBottom variant="h3">
          Varsler
        </Typography>
      </StyledBoxWrapper>
      <StyledFlexWrapper>
        <Typography>Motta varsler på epost</Typography>
        {loading && <CircularProgress size="1rem" />}
        <Switch checked={wantsToBeNotifiedByEmail} name="email" onChange={handleEmailSwitchChange} color="primary" />
      </StyledFlexWrapper>
    </>
  );
};

export default EmailNotificationSetting;
