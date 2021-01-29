import React, { FC, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { User } from '../types/user.types';

const StyledErrorDiv = styled.div`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.danger.light};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ErrorBannerProps {
  userNeedsToBeLoggedIn?: boolean;
}

const getErrorMessage = (userNeedsToBeLoggedIn: boolean, user: User, t: TFunction<string>) => {
  if (userNeedsToBeLoggedIn && user.id.length === 0) {
    return t('error.403_page');
  } else {
    return t('error.generic');
  }
};

const ErrorBanner: FC<ErrorBannerProps> = ({ userNeedsToBeLoggedIn = false }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [errorMessage] = useState<string>(getErrorMessage(userNeedsToBeLoggedIn, user, t));

  return (
    <StyledErrorDiv>
      <Typography>{errorMessage}</Typography>
    </StyledErrorDiv>
  );
};

export default ErrorBanner;
