import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const StyledHeader = styled(Typography)`
  margin-top: 4.6rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-top: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  border-bottom: 3px solid;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
`;

interface PageHeaderProps {
  children: ReactNode;
  testId?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ children, testId }) => (
  <StyledHeader data-testid={testId} variant="h1">
    {children}
  </StyledHeader>
);
