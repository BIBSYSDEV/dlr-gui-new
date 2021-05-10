import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrivateRoute from '../../utils/routes/PrivateRoute';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge, StyledProgressWrapper } from '../../components/styled/Wrappers';
import { CircularProgress, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { DLR_Institution_Roles, getInstitutionAuthorizations } from '../../api/institutionAuthorizationsApi';

const AdminPage = () => {
  const { t } = useTranslation();
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [administrators, setAdministrators] = useState<string[]>([]);
  const [curators, setCurators] = useState([]);
  const [editors, setEditors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingUsers(true);
        setLoadingError(undefined);
        setAdministrators((await getInstitutionAuthorizations(DLR_Institution_Roles.Administrator)).data);
        setCurators((await getInstitutionAuthorizations(DLR_Institution_Roles.Curator)).data);
        setEditors((await getInstitutionAuthorizations(DLR_Institution_Roles.Editor)).data);
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchData();
  }, []);

  const RoleCard = (title: string, users: string[]) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography gutterBottom variant="h6" component="h3">
        {title}
      </Typography>
      <List>
        {users.map((email) => (
          <ListItem>
            <ListItemText>{email}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Grid>
  );

  return (
    <StyledContentWrapperLarge>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}
      <PageHeader>{t('Administrativt')}</PageHeader>
      <Typography gutterBottom variant="h2">
        Roller
      </Typography>
      <Grid container spacing={6}>
        {administrators && RoleCard(t('administrator'), administrators)}
        {curators && RoleCard(t('curator'), curators)}
        {editors && RoleCard(t('editor'), editors)}
      </Grid>
      {isLoadingUsers && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default PrivateRoute(AdminPage);
