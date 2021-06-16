import React from 'react';
import LoginButton from './LoginButton';
import Logo from './Logo';
import styled from 'styled-components';
import { Button, IconButton, Typography } from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import Logout from './Logout';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { Colors } from '../../themes/mainTheme';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChangeLanguageButton from './ChangeLanguageButton';
import AvatarButton from './AvatarButton';

const StyledPageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: ${Colors.HeaderBackground};
  min-height: 4rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    justify-content: flex-start;
  }
`;

const StyledBurgerMenu = styled.div`
  justify-self: left;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
`;

const StyledSecondaryButtonBar = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: none;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: contents;
  }
`;

const StyledLanguageButtonWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md - 1 + 'px'}) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const Header = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleBurgerMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleBurgerMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledPageHeader role="navigation">
      <StyledBurgerMenu>
        <IconButton onClick={handleBurgerMenuClick}>
          <MenuIcon />
        </IconButton>
      </StyledBurgerMenu>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleBurgerMenuClose}>
        {user.id && (
          <MenuItem onClick={handleBurgerMenuClose} component={Link} to="/registration">
            <AddIcon />
            <Typography variant="button">{t('resource.new_registration')}</Typography>
          </MenuItem>
        )}
        {user.id && (
          <MenuItem onClick={handleBurgerMenuClose} component={Link} to="/resources/user/current">
            <Typography variant="button">{t('resource.my_resources')}</Typography>
          </MenuItem>
        )}
        {(user.institutionAuthorities?.isCurator || user.institutionAuthorities?.isEditor) && (
          <MenuItem onClick={handleBurgerMenuClose} component={Link} to="/worklist">
            <Typography variant="button">{t('work_list.page_title')}</Typography>
          </MenuItem>
        )}
        {user.institutionAuthorities?.isAdministrator && (
          <MenuItem onClick={handleBurgerMenuClose} component={Link} to="/admin">
            <Typography variant="button">{t('administrative.page_heading')}</Typography>
          </MenuItem>
        )}
        {user.id && (
          <MenuItem onClick={handleBurgerMenuClose} component={Link} to="/profile">
            <Typography variant="button">Profile</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleBurgerMenuClose}>{user.id ? <Logout /> : <LoginButton />}</MenuItem>
      </Menu>
      <Logo />

      <StyledSecondaryButtonBar>
        {user.id && (
          <Button component={RouterLink} data-testid="new-registration-link" to="/registration" startIcon={<AddIcon />}>
            <Typography variant="button">{t('resource.new_registration')}</Typography>
          </Button>
        )}
        {user.id && (
          <Button color="primary" component={RouterLink} data-testid="my-resources-link" to="/resources/user/current">
            <Typography variant="button">{t('resource.my_resources')}</Typography>
          </Button>
        )}
        {(user.institutionAuthorities?.isCurator || user.institutionAuthorities?.isEditor) && (
          <Button color="primary" component={RouterLink} data-testid="work-list-link" to="/worklist">
            <Typography variant="button">{t('work_list.page_title')}</Typography>
          </Button>
        )}
        {user.institutionAuthorities?.isAdministrator && (
          <Button color="primary" component={RouterLink} data-testid="admin-link" to="/admin">
            <Typography variant="button">{t('administrative.page_heading')}</Typography>
          </Button>
        )}
      </StyledSecondaryButtonBar>
      <StyledLanguageButtonWrapper>
        <ChangeLanguageButton />
      </StyledLanguageButtonWrapper>

      <StyledSecondaryButtonBar>
        {user.id ? (
          <Typography variant="body1">
            <AvatarButton />
          </Typography>
        ) : (
          <LoginButton variant="outlined" />
        )}
      </StyledSecondaryButtonBar>
    </StyledPageHeader>
  );
};

export default Header;
