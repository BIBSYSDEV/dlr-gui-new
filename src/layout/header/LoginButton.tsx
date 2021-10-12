import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { getPackedUrlCurrentPathForFeideLogin } from '../../utils/rewriteSearchParams';

interface LoginButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
}

const LoginButton: FC<LoginButtonProps> = ({ variant }) => {
  const { t } = useTranslation();

  function handleLogin() {
    window.location.href = getPackedUrlCurrentPathForFeideLogin();
  }

  return (
    <Button color="primary" variant={variant} data-testid="menu-login-button" onClick={handleLogin}>
      {t('common.login')}
    </Button>
  );
};

export default LoginButton;
