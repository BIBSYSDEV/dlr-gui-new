import React, { FC } from 'react';
import { BIBSYS_AUTHORITY_URL } from '../utils/constants';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Authority } from '../types/authority.types';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

const StyledLinkButton: any = styled(Button)`
  color: green;
`;

const StyledHowToRegIcon = styled(VerifiedUserIcon)`
  color: darkgreen;
`;

interface AuthorityLinkProps {
  authority: Authority;
}

const AuthorityLink: FC<AuthorityLinkProps> = ({ authority }) => {
  return (
    <StyledLinkButton
      data-testid="authority-link-button"
      target="_blank"
      rel="noopener noreferrer"
      href={`${BIBSYS_AUTHORITY_URL}/${authority.id}`}
      startIcon={<StyledHowToRegIcon />}>
      {authority.name}
    </StyledLinkButton>
  );
};

export default AuthorityLink;
