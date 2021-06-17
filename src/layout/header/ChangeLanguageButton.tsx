import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Button, Menu, MenuItem } from '@material-ui/core';

const languageMenuId = 'language-menu';

const ChangeLanguageButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { t, i18n } = useTranslation();

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
        data-testid="language-button"
        aria-controls={languageMenuId}
        startIcon={<LanguageIcon />}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={handleClick}>
        {i18n.language.toUpperCase()}
      </Button>
      <Menu id={languageMenuId} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem data-testid="nb-no-button" onClick={() => setLanguage('nb-no')}>
          {`${t('localization.norwegian_bokmaal')} `} (<abbr>{t('localization.norwegian_language_code')}</abbr>)
        </MenuItem>
        <MenuItem data-testid="eng-button" onClick={() => setLanguage('eng')}>
          {`${t('localization.english')} `}(<abbr>{t('localization.english_language_code')}</abbr>)
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChangeLanguageButton;
