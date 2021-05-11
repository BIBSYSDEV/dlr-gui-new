import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledSearchWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const RoleSetter = () => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState('');

  const handleUserTextFieldChange = (event: any) => {
    setUserEmail(event.target.value);
  };

  const handleSearchForUser = () => {
    console.log('SEARCH', userEmail);
    //https://api-dev.dlr.aws.unit.no/dlr-gui-backend-institution-user-authorizations/v1/institutions/current/authorizations/users/ao@unit.no
    //response : {"time":"2021-05-11T13:09:11.002Z","institution":"unit","user":"ao@unit.no","profiles":[]}
  };

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('administrative.set_roles_heading')}
      </Typography>
      <StyledSearchWrapper>
        <TextField onChange={handleUserTextFieldChange}></TextField>
        <Button variant="contained" color="primary" onClick={handleSearchForUser}>
          Søk bruker
        </Button>
      </StyledSearchWrapper>
    </>
  );
};

export default RoleSetter;
