import React, { FC } from 'react';
import styled from 'styled-components';
import { Container, Typography } from '@material-ui/core';
import { Colors } from '../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import LoginButton from '../layout/header/LoginButton';

const StyledLoginReminder = styled(Container)`
  padding: 2rem;
  margin: 2rem 0;
  background-color: ${Colors.UnitTurquoise_20percent};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTypography: any = styled(Typography)`
  margin-bottom: 1rem;
`;

interface LoginReminderProps {
  customMessage?: string;
}

const LoginReminder: FC<LoginReminderProps> = ({ customMessage }) => {
  const { t } = useTranslation();

  return (
    <StyledLoginReminder>
      <StyledTypography variant="h3" component="span">
        {customMessage ?? t('dashboard.login_reminder')}
      </StyledTypography>
      <LoginButton variant="contained" />
    </StyledLoginReminder>
  );
};

export default LoginReminder;
