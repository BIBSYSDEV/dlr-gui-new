import React, { FC, useEffect, useState } from 'react';
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
`;

interface ErrorBannerProps {
  userNeedsToBeLoggedIn?: boolean;
}

const ErrorBanner: FC<ErrorBannerProps> = ({ userNeedsToBeLoggedIn = false }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [errorMessage, setErrorMessage] = useState<string>(t('error.generic'));

  useEffect(() => {
    if (userNeedsToBeLoggedIn) {
      if (user.id.length === 0) {
        setErrorMessage(t('error.403_page'));
      }
    }
  }, [userNeedsToBeLoggedIn, user]);

  return (
    <StyledErrorDiv>
      <Typography>{errorMessage}</Typography>
    </StyledErrorDiv>
  );
};

export default ErrorBanner;
