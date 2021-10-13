import React, { FC } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { Authority } from '../../../types/authority.types';
import { useTranslation } from 'react-i18next';
import { BIBSYS_AUTHORITY_URL } from '../../../utils/constants';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { Divider } from '@mui/material';

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
            <Link
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
              href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}>
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
