import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course, ResourceReadAccess, ResourceReadAccessNames } from '../../../types/resourceReadAccess.types';
import styled from 'styled-components';
import { Chip, CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ErrorBanner from '../../../components/ErrorBanner';
import AddIcon from '@mui/icons-material/Add';
import {
  deleteAdditionalUserConsumerAccess,
  deleteCourseConsumerAccess,
  deleteCurrentUserInstitutionConsumerAccess,
  getCoursesForInstitution,
  getResourceReaders,
  postCurrentUserInstitutionConsumerAccess,
} from '../../../api/sharingApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import CancelIcon from '@mui/icons-material/Cancel';
import PrivateConsumerCourseAccessFields from './PrivateConsumerCourseAccessFields';
import PrivateConsumerPersonalAccessFields from './PrivateConsumerPersonalAccessFields';
import { isDevelopInstance, parseCourse } from '../../../utils/course.utils';
import HelperTextPopover from '../../../components/HelperTextPopover';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';
import { LicenseAgreementsOptions } from '../../../types/license.types';
import AddAccessPopover from './AddAccessPopover';

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
    .MuiChip-label {
      font-weight: 900;
    }
  }
`;

const StyledAccessButtonWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  align-items: baseline;
`;

const StyledAddAccessButton = styled(Button)`
  margin-top: 1rem;
  margin-right: 1rem;
`;

//if private ResourceReadAccess is added outside the component, then forceRefresh must change to a new value in order to add new private access chips
interface PrivateConsumerAccessFieldsProps {
  forceRefresh: boolean | undefined;
  busySavingResourceAccessType: boolean;
}

const PrivateConsumerAccessFields: FC<PrivateConsumerAccessFieldsProps> = ({
  forceRefresh = false,
  busySavingResourceAccessType,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const { values } = useFormikContext<Resource>();
  const [privateAccessList, setPrivateAccessList] = useState<ResourceReadAccess[]>([]);
  const [updatingPrivateAccessList, setUpdatingPrivateAccessList] = useState(false);
  const [showAddAccessPopover, setShowAddAccessPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [showPersonAccessField, setShowPersonAccessField] = useState(false);
  const [networkError, setNetworkError] = useState<Error | AxiosError>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [waitingForCourses, setWaitingForCourses] = useState(false);
  const [busyFetchingPrivateAccess, setBusyFetchingPrivateAccess] = useState(false);
  const [showCourseAutoComplete, setShowCourseAutocomplete] = useState(false);
  const mountedRef = useRef(true);

  const addInstitutionPrivateConsumerAccess = async () => {
    try {
      setNetworkError(undefined);
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
    } catch (error) {
      setNetworkError(handlePotentialAxiosError(error));
    }
  };

  useEffect(() => {
    const getPrivateAccessList = async () => {
      try {
        setBusyFetchingPrivateAccess(true);
        setNetworkError(undefined);
        const resourceReadAccessListResponse = await getResourceReaders(values.identifier);
        if (!mountedRef.current) return null;
        setPrivateAccessList(resourceReadAccessListResponse.data);
      } catch (error) {
        setNetworkError(handlePotentialAxiosError(error));
      } finally {
        setBusyFetchingPrivateAccess(false);
      }
    };
    const getSelectableCourses = async () => {
      if (isDevelopInstance() || user.appFeature?.hasFeatureShareResourceWithCourseStudents) {
        setWaitingForCourses(true);
        try {
          const courseResponse = await getCoursesForInstitution(user.institution);
          setCourses(courseResponse);
          setNetworkError(undefined);
        } catch (error) {
          setNetworkError(handlePotentialAxiosError(error));
        } finally {
          setWaitingForCourses(false);
        }
      }
    };
    getPrivateAccessList();
    getSelectableCourses();
  }, [values.identifier, forceRefresh, user.appFeature?.hasFeatureShareResourceWithCourseStudents, user.institution]);

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

        const course = parseCourse(access.subject);
        if (course) {
          await deleteCourseConsumerAccess(values.identifier, course);
          deleteAPISuccessful = true;
        }
      }
      if (deleteAPISuccessful) {
        setPrivateAccessList((prevState) => prevState.filter((accessState) => accessState !== access));
        setNetworkError(undefined);
      }
    } catch (error) {
      try {
        const resourceReadAccessListResponse = await getResourceReaders(values.identifier);
        if (resourceReadAccessListResponse.data.length === privateAccessList.length) {
          setNetworkError(undefined);
        }
        setPrivateAccessList(resourceReadAccessListResponse.data);
      } catch (error) {
        setNetworkError(handlePotentialAxiosError(error));
      }
    } finally {
      setUpdatingPrivateAccessList(false);
    }
  };

  const generateChipLabel = (access: ResourceReadAccess): string => {
    if (access.profiles[0].name === ResourceReadAccessNames.Person) {
      return access.subject;
    } else if (access.profiles[0].name === ResourceReadAccessNames.Institution) {
      return `${t('access.everyone_at')} ${access.subject.toUpperCase()}`;
    } else {
      const course = parseCourse(access.subject);
      if (course) {
        return `${t(
          'access.everyone_participating_in'
        )} ${course.features.code?.toUpperCase()} - ${user.institution.toUpperCase()} - ${course.features.year} - ${t(
          `access.season.${course.features.season_nr}`
        )}`;
      } else {
        return `${t('access.everyone_participating_in')} ${access.subject} `;
      }
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
    setShowCourseAutocomplete(true);
  };

  const hasInstitutionPrivateAccess = (): boolean => {
    return (
      privateAccessList.findIndex((access) => access.profiles[0].name === ResourceReadAccessNames.Institution) > -1
    );
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <StyledPrivateAccessFields>
      {privateAccessList.length > 0 && <Typography variant="subtitle1">{`${t('access.who_got_access')}:`}</Typography>}
      {privateAccessList.length === 0 && !busyFetchingPrivateAccess && !busySavingResourceAccessType && (
        <Typography color="secondary" variant="subtitle1">
          {t('access.no_one_has_read_access')}
        </Typography>
      )}
      <StyledChipWrapper>
        {privateAccessList.map((access, index) => (
          <StyledChip
            data-testid={`private-consumer-access-chip-${index}`}
            key={index}
            disabled={values.features.dlr_status_published}
            deleteIcon={<CancelIcon data-testid={`delete-private-consumer-access-chip-${index}`} />}
            label={generateChipLabel(access)}
            color="accent"
            onDelete={() => {
              deleteAccess(access);
            }}
          />
        ))}
        {(updatingPrivateAccessList || busyFetchingPrivateAccess) && <CircularProgress />}
      </StyledChipWrapper>
      {networkError && <ErrorBanner userNeedsToBeLoggedIn={true} error={networkError} />}
      {values.features.dlr_licensehelper_contains_other_peoples_work !== LicenseAgreementsOptions.NoClearance && (
        <StyledAccessButtonWrapper>
          <StyledAddAccessButton
            data-testid="add-private-consumer-access-button"
            startIcon={<AddIcon />}
            color="primary"
            variant="outlined"
            onClick={(event) => {
              handleAddAccessButtonClick(event);
            }}>
            {values.features.dlr_status_published ? t('access.increase_access') : t('access.add_access')}
          </StyledAddAccessButton>
          {values.features.dlr_status_published ? (
            <HelperTextPopover
              ariaButtonLabel={t('explanation_text.soften_helper_aria_label')}
              popoverId={'soften-access-explainer'}>
              <Typography gutterBottom>{t('explanation_text.soften_helper_text_1')}.</Typography>
              <Typography gutterBottom>{t('explanation_text.soften_helper_text_2')}.</Typography>
              <Typography gutterBottom variant="body2">
                {t('explanation_text.private_access_example')}.
              </Typography>
              <Typography variant="body2">{t('explanation_text.private_access_course_code_restrictions')}.</Typography>
            </HelperTextPopover>
          ) : (
            <HelperTextPopover
              ariaButtonLabel={t('explanation_text.private_access_aria_label')}
              popoverId={'private-access-explainer'}>
              <Typography gutterBottom>{t('explanation_text.private_access_multiple_types_possible')}.</Typography>
              <Typography gutterBottom variant="body2">
                {t('explanation_text.private_access_example')}.
              </Typography>
              <Typography variant="body2">{t('explanation_text.private_access_course_code_restrictions')}.</Typography>
            </HelperTextPopover>
          )}
        </StyledAccessButtonWrapper>
      )}

      <AddAccessPopover
        showAddAccessPopover={showAddAccessPopover}
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
        setNetworkError={setNetworkError}
        setShowCourseAutocomplete={setShowCourseAutocomplete}
        setShowPersonAccessField={setShowPersonAccessField}
        addInstitutionPrivateConsumerAccess={addInstitutionPrivateConsumerAccess}
        hasInstitutionPrivateAccess={hasInstitutionPrivateAccess}
        courses={courses}
        waitingForCourses={waitingForCourses}
        handlePopoverCourseClick={handlePopoverCourseClick}
        setUpdatingPrivateAccessList={setUpdatingPrivateAccessList}
      />

      {showPersonAccessField && (
        <PrivateConsumerPersonalAccessFields
          privateAccessList={privateAccessList}
          setShowPersonAccessField={setShowPersonAccessField}
          setUpdatingPrivateAccessList={setUpdatingPrivateAccessList}
          setSavePrivateAccessNetworkError={setNetworkError}
          addPrivateAccess={(newPrivateAccess) => setPrivateAccessList((prevState) => [...prevState, newPrivateAccess])}
        />
      )}
      {waitingForCourses && <CircularProgress />}
      {showCourseAutoComplete && (
        <PrivateConsumerCourseAccessFields
          setShowCourseAutocomplete={setShowCourseAutocomplete}
          setSavePrivateAccessNetworkError={setNetworkError}
          setUpdatingPrivateAccessList={setUpdatingPrivateAccessList}
          privateAccessList={privateAccessList}
          addPrivateAccess={(newPrivateAccess) => setPrivateAccessList((prevState) => [...prevState, newPrivateAccess])}
          courses={courses}
        />
      )}
    </StyledPrivateAccessFields>
  );
};

export default PrivateConsumerAccessFields;
