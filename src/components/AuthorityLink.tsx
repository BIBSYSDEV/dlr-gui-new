import React, { FC } from 'react';
import { BIBSYS_AUTHORITY_URL } from '../utils/constants';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Authority } from '../types/authority.types';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
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
