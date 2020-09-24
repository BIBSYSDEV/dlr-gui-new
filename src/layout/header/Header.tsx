import React, { FC } from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const StyledPageHeader = styled.div`
  display: grid;
  grid-template-areas: 'logo shortcuts auth';
  grid-template-columns: 5rem auto auto;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.palette.separator.main};
  min-height: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'menu logo auth';
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0;
  }
`;

const StyledBurgerMenu = styled.div`
  grid-area: menu;
  justify-self: left;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const Header: FC = () => {
  return (
    <StyledPageHeader>
      <StyledBurgerMenu>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </StyledBurgerMenu>
      <Logo />
      <Login />
    </StyledPageHeader>
  );
};

export default Header;
