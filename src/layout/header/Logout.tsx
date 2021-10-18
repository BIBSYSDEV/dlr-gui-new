import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { API_PATHS, API_URL } from '../../utils/constants';
import { logout } from '../../api/userApi';

export function handleLogout() {
  logout().then(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('anonymousToken');
    window.location.href = `${API_URL}${API_PATHS.guiBackendLoginPath}/dataportenLogout`;
  });
}

const Logout = () => {
  const { t } = useTranslation();

  return (
    <Button color="primary" variant="contained" data-testid="logout-button" onClick={handleLogout}>
      {t('common.logout')}
    </Button>
  );
};

export default Logout;
