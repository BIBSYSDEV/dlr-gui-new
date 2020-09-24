import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
`;

const Login: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledLoginComponent>
      <Button color="primary" variant="contained" data-testid="menu-login-button">
        {t('login')}
      </Button>
    </StyledLoginComponent>
  );
};

export default Login;
