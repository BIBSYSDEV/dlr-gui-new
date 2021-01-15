import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography, TypographyTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const StyledHeader: OverridableComponent<TypographyTypeMap<unknown, 'span'>> = styled(Typography)`
  border-bottom: 3px solid;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
`;

export const PageHeader: FC = ({ children }) => <StyledHeader variant="h1">{children}</StyledHeader>;
