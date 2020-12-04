import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusCode } from '../utils/constants';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledErrorDiv = styled.div`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.danger.light};
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

interface ErrorBannerProps {
  statusCode: number;
}

const ErrorBanner: FC<ErrorBannerProps> = ({ statusCode }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    switch (statusCode) {
      case StatusCode.UNAUTHORIZED:
        setMessage(t('error.401_page'));
        break;
      default:
        setMessage(t('error.500_page'));
        break;
    }
  }, [statusCode]);

  return (
    <StyledErrorDiv>
      <Typography>{message}</Typography>
    </StyledErrorDiv>
  );
};

export default ErrorBanner;
