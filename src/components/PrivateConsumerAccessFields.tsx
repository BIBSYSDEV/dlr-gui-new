import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course, ResourceReadAccess, ResourceReadAccessNames } from '../types/resourceReadAccess.types';
import styled from 'styled-components';
import {
  Chip,
  CircularProgress,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ErrorBanner from './ErrorBanner';
import AddIcon from '@material-ui/icons/Add';
import Popover from '@material-ui/core/Popover';
import ClearIcon from '@material-ui/icons/Clear';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import {
  deleteAdditionalUserConsumerAccess,
  deleteCourseConsumerAccess,
  deleteCurrentUserInstitutionConsumerAccess,
  getCoursesForInstitution,
  getResourceReaders,
  postAdditionalUserConsumerAccess,
  postCourseConsumerAccess,
  postCurrentUserInstitutionConsumerAccess,
} from '../api/sharingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import { useFormikContext } from 'formik';
import { Resource } from '../types/resource.types';
import { Colors, StyleWidths } from '../themes/mainTheme';
import CancelIcon from '@material-ui/icons/Cancel';

const StyledPrivateAccessFields = styled.div`
  margin-top: 2.5rem;
`;

const StyledChipWrapper = styled.div`
  display: block;
`;

const StyledChip = styled(Chip)`
  && {
    margin-top: 1rem;
    margin-right: 0.5rem;
    height: 100%;
    color: ${Colors.Background};
    background-color: ${Colors.ChipAccessBackground};

    &:focus {
      color: ${Colors.PrimaryText} !important;
      background-color: ${Colors.ChipAccessBackgroundFocus};
      color: ${Colors.PrimaryText};
      color: ${Colors.PrimaryText} !important;
    }
  }
`;

const StyledCancelIcon = styled(CancelIcon)`
  color: ${Colors.ChipAccessIconBackground};
`;

const StyledChipLabelTypography = styled(Typography)`
  padding: 0.3rem;
  white-space: normal;
  color: inherit;
`;

const StyledAccessButtonWrapper = styled.div`
  margin-top: 2.5rem;
  display: block;
`;

const StyledAddAccessButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledCancelButton = styled(Button)`
  align-self: flex-end;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

const StyledConfirmButton = styled(Button)`
  margin-left: 1rem;
  align-self: flex-end;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

const StyledFieldsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 2.5rem;
`;

const StyledFormControl = styled(FormControl)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width1};
  }
`;

const StyledCourseAutocomplete: any = styled(Autocomplete)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width1};
  }
`;

const PrivateConsumerAccessFields = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const { values } = useFormikContext<Resource>();
  const [privateAccessList, setPrivateAccessList] = useState<ResourceReadAccess[]>([]);
  const [updatingPrivateAccessList, setUpdatingPrivateAccessList] = useState(false);
  const [showAddAccessPopover, setShowAddAccessPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showPersonAccessField, setShowPersonAccessField] = useState(false);
  const [personAccessTextFieldValue, setPersonAccessFieldTextValue] = useState('');
  const [personAccessTextFieldValueError, setPersonAccessTextFieldValueError] = useState(false);
  const [savePrivateAccessNetworkError, setSavePrivateAccessNetworkError] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [waitingForCourses, setWaitingForCourses] = useState(false);
  const [showCourseAutoComplete, setShowCourseAutocomplete] = useState(false);
  const [courseAutocompleteValue, setCourseAutocompleteValue] = useState<Course | null>();
  const [courseAutocompleteTypedValue, setCourseAutocompleteTypedValue] = useState('');

  const addInstitutionPrivateConsumerAccess = async () => {
    await postCurrentUserInstitutionConsumerAccess(values.identifier);
    if (privateAccessList.findIndex((privateAccess) => privateAccess.subject === user.institution) === -1) {
      setPrivateAccessList((prevState) => [
        ...prevState,
        {
          subject: user.institution,
          profiles: [{ name: ResourceReadAccessNames.Institution }],
        },
      ]);
    }
  };

  useEffect(() => {
    const getPrivateAccessList = async () => {
      const resourceReadAccessListResponse = await getResourceReaders(values.identifier);
      setPrivateAccessList(resourceReadAccessListResponse.data);
    };
    getPrivateAccessList();
  }, [values.identifier]);

  const deleteAccess = async (access: ResourceReadAccess) => {
    try {
      let deleteAPISuccessful = false;
      if (access.profiles[0].name === ResourceReadAccessNames.Institution) {
        setUpdatingPrivateAccessList(true);
        await deleteCurrentUserInstitutionConsumerAccess(values.identifier);
        deleteAPISuccessful = true;
      } else if (access.profiles[0].name === ResourceReadAccessNames.Person) {
        setUpdatingPrivateAccessList(true);
        await deleteAdditionalUserConsumerAccess(values.identifier, access.subject);
        deleteAPISuccessful = true;
      } else if (access.profiles[0].name === ResourceReadAccessNames.Course) {
        setUpdatingPrivateAccessList(true);
        const tempCourse = access.subject.split(':: ');
        deleteAPISuccessful = true;
        //tempCourse[0]: courseCode, tempCourse[1]: institution, tempCourse[2]: year, tempCourse[3]: Season
        if (tempCourse[0]?.trim().length > 0 && tempCourse[2]?.trim().length > 0 && tempCourse[3]?.trim().length > 0) {
          await deleteCourseConsumerAccess(
            values.identifier,
            tempCourse[0].trim(),
            tempCourse[2].trim(),
            tempCourse[3].trim()
          );
          deleteAPISuccessful = true;
        }
      }
      if (deleteAPISuccessful) {
        setPrivateAccessList((prevState) => prevState.filter((accessState) => accessState !== access));
        setSavePrivateAccessNetworkError(false);
      }
    } catch (error) {
      setSavePrivateAccessNetworkError(true);
    } finally {
      setUpdatingPrivateAccessList(false);
    }
  };

  const generateChipLabel = (access: ResourceReadAccess): string => {
    if (access.profiles[0].name === ResourceReadAccessNames.Person) {
      return access.subject;
    } else if (access.profiles[0].name === ResourceReadAccessNames.Institution) {
      return `${t('access.everyone_at')} ${access.subject}`;
    } else {
      const courseTemp = access.subject.split(' :: ');
      if (courseTemp[0]) {
        courseTemp[0] = courseTemp[0].toUpperCase();
      }
      if (courseTemp[3]) {
        courseTemp[3] = t(`access.season.${courseTemp[3].trim()}`);
      }
      return `${t('access.everyone_participating_in')} ${courseTemp.join(' - ')}`;
    }
  };

  const handlePopoverClose = () => {
    setShowAddAccessPopover(false);
    setAnchorEl(null);
  };

  const handleAddAccessButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowAddAccessPopover(true);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverCourseClick = async () => {
    setShowAddAccessPopover(false);
    setAnchorEl(null);
    setWaitingForCourses(true);
    try {
      if (courses.length === 0) {
        const courseResponse = await getCoursesForInstitution(user.institution);
        setCourses(courseResponse.data);
        setSavePrivateAccessNetworkError(false);
      }
    } catch (error) {
      setSavePrivateAccessNetworkError(true);
    } finally {
      setWaitingForCourses(false);
      setShowCourseAutocomplete(true);
    }
  };

  const savePersonConsumerAccess = async () => {
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const accessUsers = personAccessTextFieldValue.split(/[,;\s]/g);
    let errorOccurred = false;
    let errorList = '';
    try {
      const alreadysavedEmails: string[] = [];
      for (let i = 0; i < accessUsers.length; i++) {
        if (accessUsers[i].length > 0 && !emailRegex.test(accessUsers[i])) {
          errorOccurred = true;
          errorList += ' ' + accessUsers[i] + ' ';
        } else if (alreadysavedEmails.includes(accessUsers[i])) {
          errorOccurred = true;
          errorList += ' ' + accessUsers[i] + ' ';
        } else if (
          !privateAccessList.find((access) => access.subject === accessUsers[i]) &&
          accessUsers[i].length > 3
        ) {
          setUpdatingPrivateAccessList(true);
          await postAdditionalUserConsumerAccess(values.identifier, accessUsers[i]);
          alreadysavedEmails.push(accessUsers[i]);
          setPrivateAccessList((prevState) => [
            ...prevState,
            { subject: accessUsers[i], profiles: [{ name: ResourceReadAccessNames.Person }] },
          ]);
        }
      }
      setPersonAccessFieldTextValue(errorList);
      setPersonAccessTextFieldValueError(errorOccurred);
      setSavePrivateAccessNetworkError(false);
    } catch (error) {
      setPersonAccessTextFieldValueError(true);
      setSavePrivateAccessNetworkError(true);
    } finally {
      setUpdatingPrivateAccessList(false);
    }
  };

  const addCourseConsumerAccess = async (course: Course | undefined | null) => {
    if (course) {
      try {
        setPersonAccessTextFieldValueError(true);
        await postCourseConsumerAccess(values.identifier, course);
        setPrivateAccessList((prevState) => [
          ...prevState,
          {
            subject: generateCourseSubjectTag(course),
            profiles: [{ name: ResourceReadAccessNames.Course }],
          },
        ]);
        setSavePrivateAccessNetworkError(false);
        setCourseAutocompleteValue(null);
        setCourseAutocompleteTypedValue('');
      } catch (error) {
        setSavePrivateAccessNetworkError(true);
      } finally {
        setUpdatingPrivateAccessList(false);
      }
    }
  };

  const generateCourseSubjectTag = (course: Course): string => {
    return `${course.features.code} :: ${user.institution.toLowerCase()} :: ${course.features.year} :: ${
      course.features.season_nr
    }`;
  };

  return (
    <StyledPrivateAccessFields>
      <Typography variant="subtitle1">{`${t('access.who_got_access')}:`}</Typography>
      <StyledChipWrapper>
        {privateAccessList.map((access, index) => (
          <StyledChip
            data-testid={`private-consumer-access-chip-${index}`}
            key={index}
            deleteIcon={<StyledCancelIcon data-testid={`delete-private-consumer-access-chip-${index}`} />}
            label={
              <StyledChipLabelTypography variant="subtitle1">{generateChipLabel(access)}</StyledChipLabelTypography>
            }
            variant="outlined"
            onDelete={() => {
              deleteAccess(access);
            }}
          />
        ))}
        {updatingPrivateAccessList && <CircularProgress size="small" />}
      </StyledChipWrapper>
      {savePrivateAccessNetworkError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      <StyledAccessButtonWrapper>
        <StyledAddAccessButton
          data-testid="add-private-consumer-access-button"
          startIcon={<AddIcon />}
          color="primary"
          variant="outlined"
          onClick={(event) => {
            handleAddAccessButtonClick(event);
          }}>
          {t('access.add_access')}
        </StyledAddAccessButton>
      </StyledAccessButtonWrapper>
      <Popover
        open={showAddAccessPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <List aria-label={t('access.access_types')}>
          <ListItem
            data-testid="add-institution-consumer-access"
            disabled={
              privateAccessList.findIndex((access) => access.profiles[0].name === ResourceReadAccessNames.Institution) >
              -1
            }
            onClick={() => {
              setSavePrivateAccessNetworkError(false);
              setShowCourseAutocomplete(false);
              setShowPersonAccessField(false);
              addInstitutionPrivateConsumerAccess();
              handlePopoverClose();
            }}
            button>
            <ListItemText primary={`${t('access.everyone_at')} ${user.institution}`} />
          </ListItem>
          <ListItem
            button
            data-testid="add-course-consumer-access"
            onClick={() => {
              setShowPersonAccessField(false);
              setSavePrivateAccessNetworkError(false);
              handlePopoverCourseClick();
            }}>
            <ListItemText primary={t('access.course_code')} />
          </ListItem>
          <ListItem
            button
            data-testid="add-person-consumer-access"
            onClick={() => {
              setSavePrivateAccessNetworkError(false);
              setShowCourseAutocomplete(false);
              setShowPersonAccessField(true);
              handlePopoverClose();
            }}>
            <ListItemText primary={t('access.single_persons')} />
          </ListItem>
        </List>
      </Popover>
      {showPersonAccessField && (
        <StyledFieldsWrapper>
          <StyledFormControl variant="filled" fullWidth>
            <InputLabel htmlFor="feide-id-input">{t('access.email_label')}</InputLabel>
            <FilledInput
              data-testid="feide-id-input"
              id="feide-id-input"
              value={personAccessTextFieldValue}
              autoFocus={true}
              multiline
              fullWidth
              error={personAccessTextFieldValueError && personAccessTextFieldValue.length > 0}
              onChange={(event) => setPersonAccessFieldTextValue(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  savePersonConsumerAccess();
                }
              }}
              endAdornment={
                personAccessTextFieldValue.length > 0 ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={t('common.clear')}
                      title={t('common.cancel')}
                      onClick={() => {
                        setPersonAccessTextFieldValueError(false);
                        setPersonAccessFieldTextValue('');
                      }}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </StyledFormControl>
          <StyledCancelButton
            variant="outlined"
            color="primary"
            onClick={() => {
              setPersonAccessFieldTextValue('');
              setShowPersonAccessField(false);
            }}>
            {t('common.cancel')}
          </StyledCancelButton>
          <StyledConfirmButton
            disabled={personAccessTextFieldValue.length < 3}
            variant="contained"
            color="primary"
            onClick={() => savePersonConsumerAccess()}>
            {t('access.grant_access')}
          </StyledConfirmButton>
        </StyledFieldsWrapper>
      )}
      {waitingForCourses && <CircularProgress />}
      {showCourseAutoComplete && courses.length > 0 && (
        <StyledFieldsWrapper>
          <StyledCourseAutocomplete
            data-testid="course-input"
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField {...params} label={t('access.course')} variant="filled" />
            )}
            options={courses.sort((a, b) => -b.features.code.localeCompare(a.features.code))}
            groupBy={(course: Course) => course.features.code[0]}
            getOptionDisabled={(course: Course) => {
              const courseSubject = generateCourseSubjectTag(course);
              return privateAccessList.findIndex((access) => access.subject.includes(courseSubject)) > -1;
            }}
            inputValue={courseAutocompleteTypedValue}
            onInputChange={(_event: any, newInputValue: string) => {
              setCourseAutocompleteTypedValue(newInputValue);
            }}
            value={courseAutocompleteValue}
            openText={t('access.show_list')}
            closeText={t('access.hide_list')}
            clearText={t('common.cancel')}
            getOptionLabel={(option: Course) =>
              `${option.features.code.toUpperCase()} - ${option.features.year} - ${t(
                `access.season.${option.features.season_nr}`
              )}`
            }
            onChange={(event: any, newValue: Course | null) => {
              setCourseAutocompleteValue(newValue);
            }}
          />
          <StyledCancelButton
            variant="outlined"
            color="primary"
            onClick={() => {
              setShowCourseAutocomplete(false);
              setCourseAutocompleteValue(null);
            }}>
            {t('common.cancel')}
          </StyledCancelButton>
          <StyledConfirmButton
            data-testid="confirm-adding-access"
            variant="contained"
            color="primary"
            disabled={!courseAutocompleteValue}
            onClick={() => addCourseConsumerAccess(courseAutocompleteValue)}>
            {t('access.grant_access')}
          </StyledConfirmButton>
        </StyledFieldsWrapper>
      )}
      {showCourseAutoComplete && courses.length === 0 && (
        <Typography color="secondary" variant="subtitle1">
          {t('access.no_courses_available')}
        </Typography>
      )}
    </StyledPrivateAccessFields>
  );
};

export default PrivateConsumerAccessFields;
