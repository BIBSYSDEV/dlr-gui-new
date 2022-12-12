import React from 'react';
import LoginButton from './LoginButton';
import Logo from './Logo';
import styled from 'styled-components';
import { Button, IconButton, Typography, useMediaQuery } from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import Logout from './Logout';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChangeLanguageButton from './ChangeLanguageButton';
import AvatarButton from './AvatarButton';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { resourcePath } from '../../utils/constants';
import { generateNewUrlAndRetainLMSParams } from '../../utils/lmsService';

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
`;

const StyledLanguageButtonWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md - 1 + 'px'}) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const StyledLanguageButtonUserIsNotLoggedInVariant = styled.div`
  width: 85%;
  display: flex;
  justify-content: flex-end;
`;

const Header = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMediumOrSmallerScreen = useMediaQuery(`(max-width:${DeviceWidths.md}px)`);

  const handleBurgerMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleBurgerMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledPageHeader data-testid="navigation-bar" role="navigation">
      {isMediumOrSmallerScreen && (
        <>
          <StyledBurgerMenu>
            <IconButton
              aria-label={t('header.show_navigation_menu') ?? ''}
              data-testid="navbar-burger-menu-button"
              onClick={handleBurgerMenuClick}
              size="large">
              <MenuIcon />
            </IconButton>
          </StyledBurgerMenu>
          <Menu
            data-testid="navbar-burger-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleBurgerMenuClose}>
            {user.id && (
              <MenuItem
                onClick={handleBurgerMenuClose}
                component={Link}
                to={generateNewUrlAndRetainLMSParams('/registration')}>
                <AddIcon />
                <Typography variant="button">{t('resource.new_registration')}</Typography>
              </MenuItem>
            )}
            {user.id && (
              <MenuItem
                onClick={handleBurgerMenuClose}
                component={Link}
                to={generateNewUrlAndRetainLMSParams(`${resourcePath}/user/current`)}>
                <DescriptionOutlinedIcon />
                <Typography variant="button">{t('resource.my_resources')}</Typography>
              </MenuItem>
            )}
            {(user.institutionAuthorities?.isCurator || user.institutionAuthorities?.isEditor) && (
              <MenuItem
                onClick={handleBurgerMenuClose}
                component={Link}
                to={generateNewUrlAndRetainLMSParams('/worklist')}>
                <Typography variant="button">{t('work_list.page_title')}</Typography>
              </MenuItem>
            )}
            {user.institutionAuthorities?.isAdministrator && (
              <MenuItem
                onClick={handleBurgerMenuClose}
                component={Link}
                to={generateNewUrlAndRetainLMSParams('/admin')}>
                <Typography variant="button">{t('administrative.page_heading')}</Typography>
              </MenuItem>
            )}
            {user.id && (
              <MenuItem
                onClick={handleBurgerMenuClose}
                component={Link}
                to={generateNewUrlAndRetainLMSParams('/profile')}>
                <Typography variant="button">{t('profile.profile')}</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleBurgerMenuClose}>{user.id ? <Logout /> : <LoginButton />}</MenuItem>
          </Menu>
        </>
      )}

      <Logo />

      {!isMediumOrSmallerScreen && user.id && (
        <>
          <Button
            color="neutral"
            component={RouterLink}
            data-testid="new-registration-link"
            to={generateNewUrlAndRetainLMSParams('/registration')}
            startIcon={<AddIcon />}>
            <Typography variant="button">{t('resource.new_registration')}</Typography>
          </Button>

          <Button
            color="neutral"
            startIcon={<DescriptionOutlinedIcon />}
            component={RouterLink}
            data-testid="my-resources-link"
            to={generateNewUrlAndRetainLMSParams(`${resourcePath}/user/current`)}>
            <Typography variant="button">{t('resource.my_resources')}</Typography>
          </Button>
        </>
      )}

      {user.id ? (
        <StyledLanguageButtonWrapper>
          <ChangeLanguageButton />
        </StyledLanguageButtonWrapper>
      ) : (
        <StyledLanguageButtonUserIsNotLoggedInVariant>
          <ChangeLanguageButton />
        </StyledLanguageButtonUserIsNotLoggedInVariant>
      )}

      {!isMediumOrSmallerScreen &&
        (user.id ? (
          <Typography variant="body1">
            <AvatarButton />
          </Typography>
        ) : (
          <LoginButton variant="outlined" />
        ))}
    </StyledPageHeader>
  );
};

export default Header;
