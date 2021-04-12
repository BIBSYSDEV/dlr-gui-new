import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { IconButton } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { Authority } from '../../../types/authority.types';
import { useTranslation } from 'react-i18next';
import { BIBSYS_AUTHORITY_URL } from '../../../utils/constants';

interface AuthorityListItemProps {
  authority: Authority;
  handleSelectedAuthorityChange: (authority: Authority) => void;
}

const AuthorityListItem: FC<AuthorityListItemProps> = ({ authority, handleSelectedAuthorityChange }) => {
  const { t } = useTranslation();
  return (
    <ListItem disableGutters>
      <ListItemText
        primary={authority.name}
        secondary={
          <Link target="_blank" rel="noopener noreferrer" href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}>
            {`${t('license.read_more')} (${t('license.external_page').toLowerCase()})`}
          </Link>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          data-testid={`add-verify-authority-${authority.id}`}
          onClick={() => handleSelectedAuthorityChange(authority)}
          edge="end"
          aria-label={t('authority.add_authority')}>
          <VerifiedUserIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AuthorityListItem;
