import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
`;

const Login: FC = () => {
  const { t } = useTranslation();

  function handleLogin() {
    toast.error('Not implemented');
  }

  return (
    <StyledLoginComponent>
      <Button color="primary" variant="contained" data-testid="menu-login-button" onClick={handleLogin}>
        {t('login')}
      </Button>
    </StyledLoginComponent>
  );
};

export default Login;
