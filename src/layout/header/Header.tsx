import React, { FC } from 'react';
import Login from './Login';
import Logo from './Logo';
import styled from 'styled-components';
import { Button, IconButton, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import Logout from './Logout';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { Colors } from '../../themes/mainTheme';

const StyledPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: ${Colors.HeaderBackground};
  min-height: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0;
  }
`;

const StyledBurgerMenu = styled.div`
  justify-self: left;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const Header: FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  return (
    <StyledPageHeader>
      <StyledBurgerMenu>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </StyledBurgerMenu>
      <Logo />
      {user.id && (
        <Button
          color="primary"
          component={RouterLink}
          data-testid="new-publication"
          to="/registration"
          startIcon={<AddIcon />}>
          <Typography variant="button">{t('resource.new_registration')}</Typography>
        </Button>
      )}
      {user.id && (
        <Button color="primary" component={RouterLink} data-testid="my-resources" to="/resources/user/current">
          <Typography variant="button">{t('resource.my_resources')}</Typography>
        </Button>
      )}
      {user.id ? (
        <div>
          {t('user.logged_in_as')} {user.name} <Logout />
        </div>
      ) : (
        <Login />
      )}
    </StyledPageHeader>
  );
};

export default Header;
