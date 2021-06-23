import React, { FC } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Authority } from '../../../types/authority.types';
import { useTranslation } from 'react-i18next';
import { BIBSYS_AUTHORITY_URL } from '../../../utils/constants';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { Divider } from '@material-ui/core';

const StyledListItem: any = styled(ListItemText)`
  & .MuiListItemText-primary {
    max-width: 80%;
  }
  & .MuiListItemText-secondary {
    max-width: 80%;
  }
`;

interface AuthorityListItemProps {
  authority: Authority;
  handleSelectedAuthorityChange: (authority: Authority) => void;
}

const AuthorityListItem: FC<AuthorityListItemProps> = ({ authority, handleSelectedAuthorityChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <ListItem disableGutters alignItems="flex-start" data-testid={`authority-list-item-${authority.id}`}>
        <StyledListItem
          primary={authority.name}
          secondary={
            <Link target="_blank" rel="noopener noreferrer" href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}>
              {`${t('license.read_more')} (${t('license.external_page').toLowerCase()})`}
            </Link>
          }
        />
        <ListItemSecondaryAction>
          <Button
            variant="outlined"
            data-testid={`add-verify-authority-${authority.id}`}
            onClick={() => handleSelectedAuthorityChange(authority)}>
            {t('common.select')}
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  );
};

export default AuthorityListItem;
