import React, { FC } from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';

const StyledPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.palette.separator.main};
  min-height: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
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
  const user = useSelector((state: RootState) => state.user);

  return (
    <StyledPageHeader>
      <StyledBurgerMenu>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </StyledBurgerMenu>
      <Logo />
      {user.id !== '' ? <div>{user.name} </div> : <Login />}
    </StyledPageHeader>
  );
};

export default Header;
