import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledErrorDiv = styled.div`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.danger.light};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ErrorBanner: FC = () => {
  const { t } = useTranslation();
  return (
    <StyledErrorDiv>
      <Typography>{t('error.generic')}</Typography>
    </StyledErrorDiv>
  );
};

export default ErrorBanner;
