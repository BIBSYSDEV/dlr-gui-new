import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { Alert, AlertTitle } from '@mui/material';
import axios, { AxiosError } from 'axios';

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ErrorBannerProps {
  userNeedsToBeLoggedIn?: boolean;
  error?: Error | AxiosError;
  customErrorMessage?: string;
  showAxiosStatusCode?: boolean;
}

const ErrorBanner: FC<ErrorBannerProps> = ({
  userNeedsToBeLoggedIn = false,
  error,
  customErrorMessage,
  showAxiosStatusCode = false,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const getErrorMessage = () => {
    if (userNeedsToBeLoggedIn && user.id.length === 0) {
      return t('error.403_page');
    } else {
      return t('error.generic');
    }
  };

  return (
    <StyledAlert severity="error">
      <AlertTitle>{customErrorMessage ?? getErrorMessage()}</AlertTitle>
      {error && (
        <Typography variant="caption">
          {axios.isAxiosError(error) &&
            showAxiosStatusCode &&
            error.response?.status &&
            `${t('error.error_status')}: ${error.response.status} `}
          {t('error.error_message')}: {error.message})
        </Typography>
      )}
    </StyledAlert>
  );
};

export default ErrorBanner;
