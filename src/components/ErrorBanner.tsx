import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { Alert, AlertTitle } from '@material-ui/lab';

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ErrorBannerProps {
  userNeedsToBeLoggedIn?: boolean;
  error?: Error;
  customErrorMessage?: string;
  useFulToTryAgain?: boolean;
}

const ErrorBanner: FC<ErrorBannerProps> = ({
  userNeedsToBeLoggedIn = false,
  error,
  customErrorMessage,
  useFulToTryAgain = true,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const getErrorMessage = () => {
    if (userNeedsToBeLoggedIn && user.id.length === 0) {
      return t('error.403_page');
    } else if (useFulToTryAgain) {
      return t('error.generic');
    } else {
      return t('error.generic_try_again_false');
    }
  };

  return (
    <StyledAlert severity="error">
      <AlertTitle>{customErrorMessage ?? getErrorMessage()}</AlertTitle>
      {error && <Typography variant="caption">(Feilmelding: {error.message})</Typography>}
    </StyledAlert>
  );
};

export default ErrorBanner;
