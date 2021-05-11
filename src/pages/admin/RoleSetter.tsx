import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Switch, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { getRolesForUser } from '../../api/institutionAuthorizationsApi';
import { InstitutionAuthorities, User } from '../../types/user.types';

const StyledSearchWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const RoleSetter = () => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<User>();

  const handleUserTextFieldChange = (event: any) => {
    setUserEmail(event.target.value);
  };

  const handleSearchForUser = async () => {
    const user = await getRolesForUser(userEmail);
    setUser(user.data);
  };

  const handleChangeIsAdmin = async () => {
    console.log(user?.institutionAuthorities?.isAdministrator);
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
      {user && (
        <Card>
          Admin:{' '}
          <Switch checked={user.institutionAuthorities?.isAdministrator} onChange={handleChangeIsAdmin} name="admin" />
        </Card>
      )}
      <pre style={{ maxWidth: '90%' }}>PER: {JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default RoleSetter;
