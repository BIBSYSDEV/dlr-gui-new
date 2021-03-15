import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';

const StyledHeader = styled(Typography)`
  border-bottom: 3px solid;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
`;

interface PageHeaderProps {
  children: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ children }) => <StyledHeader variant="h1">{children}</StyledHeader>;
