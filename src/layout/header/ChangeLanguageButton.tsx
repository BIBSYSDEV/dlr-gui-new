import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Button, Menu, MenuItem } from '@material-ui/core';

const languageMenuId = 'language-menu';

const ChangeLanguageButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { i18n } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setLanguage = (languageCode: string) => {
    setAnchorEl(null);
    i18n.changeLanguage(languageCode);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        aria-controls={languageMenuId}
        startIcon={<LanguageIcon />}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={handleClick}>
        {i18n.language.toUpperCase()}
      </Button>
      <Menu id={languageMenuId} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => setLanguage('nob')}>Norsk - bokmål</MenuItem>
        <MenuItem onClick={() => setLanguage('eng')}>English</MenuItem>
      </Menu>
    </>
  );
};

export default ChangeLanguageButton;
