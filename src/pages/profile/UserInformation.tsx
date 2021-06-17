import React, { useEffect, useState } from 'react';
import { Chip, CircularProgress, Grid, List, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { User } from '../../types/user.types';
import { getUserAuthorizationCourses } from '../../api/userApi';
import { generateCourseSubjectTag, parseCourse } from '../../utils/course.utils';
import { Course } from '../../types/resourceReadAccess.types';
import ErrorBanner from '../../components/ErrorBanner';
import { useTranslation } from 'react-i18next';
import RolesDescriptionListItem from '../../components/RolesDescriptionListItem';

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
  height: auto;
  && {
    margin: 1rem 0.5rem 0 0;
    background-color: ${Colors.ChipBackground};
    color: ${Colors.Background};
    &:focus {
      color: ${Colors.PrimaryText};
      background-color: ${Colors.ChipBackgroundFocus};
    }
  }
`;
const StyledChipTypography = styled(Typography)`
  white-space: normal;
  color: white;
  padding: 0.25rem;
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
  const [errorLoadingCourses, setErrorLoadingCourses] = useState<Error | undefined>();
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
        setErrorLoadingCourses(error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      <StyledHeaderTypography variant="h2">{user.name}</StyledHeaderTypography>
      <StyledGridContainer container spacing={10}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('common.id')}</Typography>
                <Typography>
                  {user.id} {`(${t('profile.feide')})`}
                </Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('common.email')}</Typography>
                <Typography>{user.email}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">{t('profile.institution')}</Typography>
                <Typography>{user.institution.toUpperCase()}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>

            <Grid item>
              <Typography variant="h3">{t('profile.your_roles')}</Typography>

              <List>
                {user.institutionAuthorities?.isPublisher && (
                  <RolesDescriptionListItem
                    role={t('administrative.roles.publisher')}
                    description={t('administrative.roles.publisher_description')}
                  />
                )}
                {user.institutionAuthorities?.isAdministrator && (
                  <RolesDescriptionListItem
                    role={t('administrative.roles.administrator')}
                    description={t('administrative.roles.administrator_description')}
                  />
                )}
                {user.institutionAuthorities?.isCurator && (
                  <RolesDescriptionListItem
                    role={t('administrative.roles.curator')}
                    description={t('administrative.roles.curator_description')}
                  />
                )}
                {user.institutionAuthorities?.isEditor && (
                  <RolesDescriptionListItem
                    role={t('administrative.roles.editor')}
                    description={t('administrative.roles.editor_description')}
                  />
                )}
                {hasOnlyReadAccess(user) && (
                  <RolesDescriptionListItem
                    role={t('administrative.roles.only_read_access')}
                    description={t('administrative.roles.only_read_access_description')}
                  />
                )}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3">{t('profile.your_groups')}</Typography>

              <StyledChipContainer>
                <StyledChip
                  variant="outlined"
                  label={<StyledChipTypography>{user.institution.toUpperCase()}</StyledChipTypography>}
                />
                {courses
                  .filter((course) => !!course)
                  .map((course, index) => (
                    <StyledChip
                      key={index}
                      label={<StyledChipTypography>{generateCourseSubjectTag(course, user)}</StyledChipTypography>}
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
