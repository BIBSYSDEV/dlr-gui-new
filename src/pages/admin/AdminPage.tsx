import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge, StyledProgressWrapper } from '../../components/styled/Wrappers';
import { CircularProgress, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { getInstitutionAuthorizations } from '../../api/institutionAuthorizationsApi';
import { InstitutionProfilesNames } from '../../types/user.types';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import AdminRoute from '../../utils/routes/AdminRoute';
import RoleSetter from './RoleSetter';

const StyledWrapper = styled(Grid)`
  background-color: ${Colors.UnitTurquoise_20percent};
  padding: 1rem 1rem 2rem 1rem;
  margin-top: 2rem;
`;

const StyledWrapper2 = styled(Grid)`
  background-color: ${Colors.UnitTurquoise_30percent};
  padding: 1rem;
  margin-bottom: 2rem;
`;

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
        const promiseArray: Promise<any>[] = [];
        promiseArray.push(getInstitutionAuthorizations(InstitutionProfilesNames.administrator));
        promiseArray.push(getInstitutionAuthorizations(InstitutionProfilesNames.curator));
        promiseArray.push(getInstitutionAuthorizations(InstitutionProfilesNames.editor));
        const results = await Promise.all(promiseArray);
        setAdministrators(results[0].data);
        setCurators(results[1].data);
        setEditors(results[2].data);
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchData();
  }, []);

  const RoleCard = (title: string, users: string[], testId: string) => (
    <Grid item xs={12} sm={6} md={4} data-testid={testId}>
      <Typography gutterBottom variant="h6" component="h3">
        {title}
      </Typography>
      <List dense>
        {users.map((email, index) => (
          <ListItem key={index}>
            <ListItemText>{email}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Grid>
  );

  return (
    <StyledContentWrapperLarge>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}
      <PageHeader>{t('administrative.page_heading')}</PageHeader>
      <StyledWrapper>
        <RoleSetter />
      </StyledWrapper>
      <StyledWrapper2>
        <Typography gutterBottom variant="h2">
          {t('administrative.roles_heading')}
        </Typography>
        <Grid container spacing={6}>
          {RoleCard(t('administrative.role_header.administrators'), administrators, 'administrator-list')}
          {RoleCard(t('administrative.role_header.curators'), curators, 'curator-list')}
          {RoleCard(t('administrative.role_header.editors'), editors, 'editor-list')}
        </Grid>
        {isLoadingUsers && (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        )}
      </StyledWrapper2>
    </StyledContentWrapperLarge>
  );
};

export default AdminRoute(AdminPage);
