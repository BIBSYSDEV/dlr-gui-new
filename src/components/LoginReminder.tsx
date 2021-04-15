import React from 'react';
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

const StyledTypography = styled(Typography)`
  margin-bottom: 1rem;
`;

const LoginReminder = () => {
  const { t } = useTranslation();

  return (
    <StyledLoginReminder>
      <StyledTypography variant="h3">{t('dashboard.login_reminder')}</StyledTypography>
      <LoginButton variant="contained" />
    </StyledLoginReminder>
  );
};

export default LoginReminder;
