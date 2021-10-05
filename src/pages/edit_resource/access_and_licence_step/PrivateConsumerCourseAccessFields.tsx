import React, { FC, useState } from 'react';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { TextField, Typography } from '@material-ui/core';
import { Course, ResourceReadAccess, ResourceReadAccessNames } from '../../../types/resourceReadAccess.types';
import styled from 'styled-components';
import { StyleWidths } from '../../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { postCourseConsumerAccess } from '../../../api/sharingApi';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { StyledCancelButton, StyledConfirmButton } from '../../../components/styled/StyledButtons';
import { StyledFieldsWrapper } from '../../../components/styled/Wrappers';
import { generateCourseSubjectTag, isDevelopInstance } from '../../../utils/course.utils';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';
import ConfirmSoftenPrivateAccessAfterPublication from './ConfirmSoftenPrivateAccessAfterPublication';

const StyledCourseAutocomplete: any = styled(Autocomplete)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width1};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

const StyledTypography = styled(Typography)`
  margin-top: 2rem;
`;

interface PrivateConsumerCourseAccessFieldsProps {
  setShowCourseAutocomplete: (showCourseAutocomplete: boolean) => void;
  setSavePrivateAccessNetworkError: (savePrivateAccessNetworkError: Error | AxiosError | undefined) => void;
  setUpdatingPrivateAccessList: (updatingPrivateAccessList: boolean) => void;
  privateAccessList: ResourceReadAccess[];
  addPrivateAccess: (newPrivateAccess: ResourceReadAccess) => void;
  courses: Course[];
}

const PrivateConsumerCourseAccessFields: FC<PrivateConsumerCourseAccessFieldsProps> = ({
  setShowCourseAutocomplete,
  setSavePrivateAccessNetworkError,
  setUpdatingPrivateAccessList,
  privateAccessList,
  addPrivateAccess,
  courses,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const { values } = useFormikContext<Resource>();
  const [courseAutocompleteValue, setCourseAutocompleteValue] = useState<Course | null>(null);
  const [courseAutocompleteTypedValue, setCourseAutocompleteTypedValue] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const addCourseConsumerAccess = async (course: Course) => {
    if (course) {
      try {
        setUpdatingPrivateAccessList(true);
        setSavePrivateAccessNetworkError(undefined);
        await postCourseConsumerAccess(values.identifier, course);
        addPrivateAccess({
          subject: generateCourseSubjectTag(course, user),
          profiles: [{ name: ResourceReadAccessNames.Course }],
        });
        setCourseAutocompleteValue(null);
        setCourseAutocompleteTypedValue('');
      } catch (error) {
        setSavePrivateAccessNetworkError(handlePotentialAxiosError(error));
      } finally {
        setUpdatingPrivateAccessList(false);
      }
    }
  };

  const sortCourses = () => {
    return courses.sort((a, b) => {
      if (b.features.code && a.features.code) {
        return -b.features.code.toUpperCase().localeCompare(a.features.code.toUpperCase());
      } else if (!a.features.code) {
        return 1;
      } else {
        return -1;
      }
    });
  };

  const handleGrantConfirmButtonClick = () => {
    if (values.features.dlr_status_published) {
      setShowConfirmDialog(true);
    } else {
      if (courseAutocompleteValue) {
        addCourseConsumerAccess(courseAutocompleteValue);
      }
    }
  };

  const handleConfirmDialogConfirmation = () => {
    if (courseAutocompleteValue) {
      addCourseConsumerAccess(courseAutocompleteValue);
    }
  };

  return (
    <>
      {isDevelopInstance() && (
        <StyledTypography>
          <b>{t('access.develop_server_warning')}. </b>
        </StyledTypography>
      )}
      {courses.length > 0 && (
        <StyledFieldsWrapper>
          <StyledCourseAutocomplete
            id="course-input"
            data-testid="course-input"
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField {...params} label={t('access.course')} variant="filled" />
            )}
            options={sortCourses()}
            groupBy={(course: Course) => course.features.code?.[0].toUpperCase()}
            getOptionDisabled={(course: Course) => {
              const courseSubject = generateCourseSubjectTag(course, user);
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
              `${option.features.code?.toUpperCase()} - ${option.features.year} - ${t(
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
            onClick={handleGrantConfirmButtonClick}>
            {t('access.grant_access')}
          </StyledConfirmButton>
        </StyledFieldsWrapper>
      )}
      {courses.length === 0 && (
        <Typography color="secondary" variant="subtitle1">
          {t('access.no_courses_available')}
        </Typography>
      )}
      <ConfirmSoftenPrivateAccessAfterPublication
        type={'course'}
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        change={''}
        confirmed={handleConfirmDialogConfirmation}
      />
    </>
  );
};

export default PrivateConsumerCourseAccessFields;
