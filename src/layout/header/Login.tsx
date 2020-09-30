import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { setUser } from '../../state/userSlice';
import { useDispatch } from 'react-redux';

const StyledLoginComponent = styled.div`
  grid-area: auth;
  justify-self: right;
`;

const Login: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function handleLogin() {
    dispatch(setUser({ id: '123', name: 'test@unit.no' }));
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
