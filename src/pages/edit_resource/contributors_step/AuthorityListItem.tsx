import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { IconButton } from '@material-ui/core';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { Authority } from '../../../types/authority.types';
import styled from 'styled-components';

const StyledIconButton = styled(IconButton)`
  color: green !important;
`;

interface AuthorityListItemProps {
  authority: Authority;
  handleSelectedAuthorityChange: (identifier: string) => void;
  isSelected: boolean;
}

const AuthorityListItem: FC<AuthorityListItemProps> = ({ authority, handleSelectedAuthorityChange, isSelected }) => {
  return (
    <ListItem selected={isSelected}>
      <ListItemText
        primary={isSelected ? `${authority.name} (valgt)` : authority.name}
        secondary={
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://authority.bibsys.no/authority/rest/authorities/html/${authority.id}`}>
            les mer (ekstern side)
          </Link>
        }
      />
      {!isSelected && (
        <ListItemSecondaryAction>
          <IconButton onClick={() => handleSelectedAuthorityChange(authority.id)} edge="end" aria-label="comments">
            <HowToRegIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
      {isSelected && (
        <ListItemSecondaryAction>
          <StyledIconButton edge="end" disabled={true} aria-label="deselect or select">
            <HowToRegIcon />
          </StyledIconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default AuthorityListItem;
