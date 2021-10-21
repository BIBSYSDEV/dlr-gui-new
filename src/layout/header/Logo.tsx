import React from 'react';
import styled from 'styled-components';
import { Divider, Link, Typography } from '@mui/material';
import { generateNewUrlAndRetainLMSParams } from '../../utils/lmsService';

const StyledLogo = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: logo;
  justify-content: center;
`;

const StyledDivider = styled(Divider)`
  margin-left: 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const Logo = () => (
  <StyledLogo data-testid="logo">
    <Link href={generateNewUrlAndRetainLMSParams('/')} underline="none">
      <Typography variant="h3" component="div">
        DLR
      </Typography>
    </Link>
    <StyledDivider orientation="vertical" flexItem />
  </StyledLogo>
);

export default Logo;
