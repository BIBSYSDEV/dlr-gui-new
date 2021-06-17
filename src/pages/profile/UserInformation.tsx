import React, { useEffect, useState } from 'react';
import { Chip, CircularProgress, Divider, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { User } from '../../types/user.types';
import { getUserAuthorizationCourses } from '../../api/userApi';
import { generateCourseSubjectTag, parseCourse } from '../../utils/course.utils';
import { Course } from '../../types/resourceReadAccess.types';
import ErrorBanner from '../../components/ErrorBanner';

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
                <Typography variant="caption">Id</Typography>
                <Typography>{user.id} (feide)</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">Epost</Typography>
                <Typography>{user.email}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>
            <Grid item>
              <StyledMetadataInformationWrapper>
                <Typography variant="caption">Institusjon</Typography>
                <Typography>{user.institution.toUpperCase()}</Typography>
              </StyledMetadataInformationWrapper>
            </Grid>

            <Grid item>
              <Typography variant="h3">Dine Roller:</Typography>

              <List>
                {user.institutionAuthorities?.isPublisher && (
                  <ListItem>
                    <ListItemText
                      primary="Publisere"
                      secondary="Brukeren får tilgang til å tildele roller innenfor egen institusjon"
                    />
                  </ListItem>
                )}
                {user.institutionAuthorities?.isEditor && (
                  <>
                    <Divider variant="fullWidth" component="li" />
                    <ListItem>
                      <ListItemText
                        primary="Admin"
                        secondary="Brukeren får tilgang til å tildele roller innenfor egen institusjon"
                      />
                    </ListItem>
                  </>
                )}
                {user.institutionAuthorities?.isCurator && (
                  <>
                    <Divider variant="fullWidth" component="li" />
                    <ListItem>
                      <ListItemText
                        primary="Kurator"
                        secondary="Brukeren får tilgang til å tildele roller innenfor egen institusjon"
                      />
                    </ListItem>
                  </>
                )}
                {user.institutionAuthorities?.isAdministrator && (
                  <>
                    <Divider variant="fullWidth" component="li" />
                    <ListItem>
                      <ListItemText
                        primary="Redaktør"
                        secondary="Brukeren får tilgang til å tildele roller innenfor egen institusjon"
                      />
                    </ListItem>
                    <Divider variant="fullWidth" component="li" />
                  </>
                )}
                {hasOnlyReadAccess(user) && (
                  <ListItem>
                    <ListItemText
                      primary="Lesetilgang"
                      secondary="Brukeren har kun lesetilgang til offentlige ressurser og ressurser med bla blah"
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3">Dine gruppetilknytninger:</Typography>

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
