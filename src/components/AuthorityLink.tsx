import React, { FC } from 'react';
import { BIBSYS_AUTHORITY_URL } from '../utils/constants';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Authority } from '../types/authority.types';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Colors } from '../themes/mainTheme';
import { useTranslation } from 'react-i18next';

const StyledHowToRegIcon = styled(VerifiedUserIcon)`
  color: ${Colors.AuthorityBadge};
`;

interface AuthorityLinkProps {
  authority: Authority;
}

const AuthorityLink: FC<AuthorityLinkProps> = ({ authority }) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outlined"
      size="small"
      data-testid="authority-link-button"
      target="_blank"
      rel="noopener noreferrer"
      href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}
      startIcon={<StyledHowToRegIcon />}>
      {t('authority.verified')}
    </Button>
  );
};

export default AuthorityLink;
