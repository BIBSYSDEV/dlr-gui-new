import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';

const StyledErrorDiv = styled.div`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.danger.light};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

interface ErrorBannerProps {
  userNeedsToBeLoggedIn?: boolean;
  error?: Error;
}

const ErrorBanner: FC<ErrorBannerProps> = ({ userNeedsToBeLoggedIn = false, error }) => {
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
    <StyledErrorDiv>
      <Typography>{getErrorMessage()}</Typography>
      {error && <Typography variant="caption">(Feilmelding: {error.message})</Typography>}
    </StyledErrorDiv>
  );
};

export default ErrorBanner;
