import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { IconButton } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { Authority } from '../../../types/authority.types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BIBSYS_AUTHORITY_URL } from '../../../utils/constants';

const StyledIconButton = styled(IconButton)`
  color: green !important;
`;

interface AuthorityListItemProps {
  authority: Authority;
  handleSelectedAuthorityChange: (identifier: string) => void;
  isSelected: boolean;
}

const AuthorityListItem: FC<AuthorityListItemProps> = ({ authority, handleSelectedAuthorityChange, isSelected }) => {
  const { t } = useTranslation();
  return (
    <ListItem disableGutters selected={isSelected}>
      <ListItemText
        primary={isSelected ? `${authority.name} (${t('authority.selected').toLowerCase()})` : authority.name}
        secondary={
          <Link target="_blank" rel="noopener noreferrer" href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}>
            {`${t('license.read_more')} (${t('license.external_page').toLowerCase()})`}
          </Link>
        }
      />
      {!isSelected && (
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => handleSelectedAuthorityChange(authority.id)}
            edge="end"
            aria-label={t('authority.add_authority')}>
            <VerifiedUserIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
      {isSelected && (
        <ListItemSecondaryAction>
          <StyledIconButton edge="end" disabled={true} aria-label={t('authority.deselect_authority')}>
            <VerifiedUserIcon />
          </StyledIconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default AuthorityListItem;
