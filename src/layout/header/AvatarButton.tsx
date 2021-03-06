import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { Button, Menu, MenuItem } from '@material-ui/core';
import Logout from './Logout';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AvatarButton = () => {
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = !!anchorEl;

  return (
    <>
      <Button
        data-testid="avatar-button"
        onClick={handleClick}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
        {user.name}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          {t('profile.profile').toUpperCase()}
        </MenuItem>
        {user.institutionAuthorities?.isAdministrator && (
          <MenuItem data-testid="admin-link" onClick={handleClose} component={Link} to="/admin">
            {t('administrative.page_heading').toUpperCase()}
          </MenuItem>
        )}
        {(user.institutionAuthorities?.isCurator || user.institutionAuthorities?.isEditor) && (
          <MenuItem onClick={handleClose} component={Link} to="/worklist">
            {t('work_list.page_title').toUpperCase()}
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <Logout />
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarButton;
