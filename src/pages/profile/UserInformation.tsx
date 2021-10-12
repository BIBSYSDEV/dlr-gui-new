import React, { useEffect, useState } from 'react';
import { Chip, CircularProgress, Grid, List, Typography } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { User } from '../../types/user.types';
import { getUserAuthorizationCourses } from '../../api/userApi';
import { parseCourse } from '../../utils/course.utils';
import { Course } from '../../types/resourceReadAccess.types';
import ErrorBanner from '../../components/ErrorBanner';
import { useTranslation } from 'react-i18next';
import RolesDescriptionListItem from '../../components/RolesDescriptionListItem';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledHeaderTypography = styled(Typography)`
  margin-bottom: 1rem;
`;

const StyledMetadataInformationWrapper = styled.div`
  margin-right: 3rem;
`;

const StyledGridContainer = styled(Grid)`
  max-width: 100vw;
`;

const StyledChip = styled(Chip)`
  && {
    margin: 1rem 0.5rem 0 0;
  }
`;

const StyledChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const hasOnlyReadAccess = (user: User) => {
  return (
    !user.institutionAuthorities?.isAdministrator &&
    !user.institutionAuthorities?.isCurator &&
    !user.institutionAuthorities?.isEditor &&
    !user.institutionAuthorities?.isPublisher
  );
};

const UserInformation = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [errorLoadingCourses, setErrorLoadingCourses] = useState<Error | AxiosError>();
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setErrorLoadingCourses(undefined);
        const coursesResponse = await getUserAuthorizationCourses();
        if (coursesResponse.data.length > 0) {
          const coursesTemp: Course[] = [];

          coursesResponse.data.forEach((subject) => {
            const course = parseCourse(subject);
            if (course !== null) {
              coursesTemp.push(course);
            }
          });

          setCourses(coursesTemp);
        }
      } catch (error) {
        setErrorLoadingCourses(handlePotentialAxiosError(error));
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      <StyledHeaderTypography variant="h2" data-testid="profile-name">
        {user.name}
      </StyledHeaderTypography>
      <StyledGridContainer container spacing={10}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('common.id')}</Typography>
                <Typography data-testid="profile-id">
                  {user.id} {`(${t('profile.feide')})`}
                </Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('common.email')}</Typography>
                <Typography data-testid="profile-email">{user.email}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('profile.institution')}</Typography>
                <Typography data-testid="profile-institution">{user.institution.toUpperCase()}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid item>
                  <Typography variant="h3">{t('profile.your_roles')}</Typography>

                  <List>
                    {user.institutionAuthorities?.isPublisher && (
                      <RolesDescriptionListItem
                        dataTestId="role-publisher"
                        role={t('administrative.roles.publisher')}
                        description={t('administrative.roles.publisher_description')}
                      />
                    )}
                    {user.institutionAuthorities?.isAdministrator && (
                      <RolesDescriptionListItem
                        dataTestId="role-admin"
                        role={t('administrative.roles.administrator')}
                        description={t('administrative.roles.administrator_description')}
                      />
                    )}
                    {user.institutionAuthorities?.isCurator && (
                      <RolesDescriptionListItem
                        dataTestId="role-curator"
                        role={t('administrative.roles.curator')}
                        description={t('administrative.roles.curator_description')}
                      />
                    )}
                    {user.institutionAuthorities?.isEditor && (
                      <RolesDescriptionListItem
                        dataTestId="role-editor"
                        role={t('administrative.roles.editor')}
                        description={t('administrative.roles.editor_description')}
                      />
                    )}
                    {hasOnlyReadAccess(user) && (
                      <RolesDescriptionListItem
                        dataTestId="role-read-only"
                        role={t('administrative.roles.only_read_access')}
                        description={t('administrative.roles.only_read_access_description')}
                      />
                    )}
                  </List>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3">{t('profile.your_groups')}</Typography>

              <StyledChipContainer>
                <StyledChip color="primary" label={user.institution.toUpperCase()} />
                {courses
                  .filter((course) => !!course)
                  .map((course, index) => (
                    <StyledChip
                      key={index}
                      color="primary"
                      data-testid={`profile-group-${index}`}
                      label={`${course.features.code} ${course.features.year} ${t(
                        `access.season.${course.features.season_nr}`
                      )}`}
                    />
                  ))}
              </StyledChipContainer>
              {loadingCourses && <CircularProgress size="2rem" />}
            </Grid>
            {errorLoadingCourses && (
              <Grid item xs={12}>
                <ErrorBanner userNeedsToBeLoggedIn={true} error={errorLoadingCourses} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </StyledGridContainer>
    </>
  );
};

export default UserInformation;
