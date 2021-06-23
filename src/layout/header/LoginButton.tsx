import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { API_PATHS, API_URL } from '../../utils/constants';

interface LoginButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
}

const LoginButton: FC<LoginButtonProps> = ({ variant }) => {
  const { t } = useTranslation();

  function handleLogin() {
    const currentUrl = encodeURIComponent(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    );
    window.location.href = `${API_URL}${API_PATHS.guiBackendLoginPath}/feideLogin?target=${currentUrl}/loginRedirect`;
  }

  return (
    <Button color="primary" variant={variant} data-testid="menu-login-button" onClick={handleLogin}>
      {t('common.login').toUpperCase()}
    </Button>
  );
};

export default LoginButton;
