import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledHeader = styled(Typography)`
  border-bottom: 3px solid;
  margin-top: 4.6rem;
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
