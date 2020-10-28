import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import constants, { API_URL } from '../../utils/constants';

const Login: FC = () => {
  const { t } = useTranslation();

  function handleLogin() {
    let currentUrl = encodeURIComponent(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    );
    window.location.href = `${API_URL}${constants.guiBackendLoginPath}/feideLogin?target=${currentUrl}/loginRedirect`;
  }

  return (
    <Button color="primary" variant="contained" data-testid="menu-login-button" onClick={handleLogin}>
      {t('login')}
    </Button>
  );
};

export default Login;
