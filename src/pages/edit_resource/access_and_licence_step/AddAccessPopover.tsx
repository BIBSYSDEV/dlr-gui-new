import React, { FC, useState } from 'react';
import Popover from '@mui/material/Popover';
import { List, ListItem, ListItemText } from '@mui/material';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { useTranslation } from 'react-i18next';
import { Course } from '../../../types/resourceReadAccess.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { AxiosError } from 'axios';
import SoftenPrivateAccessAfterPublicationDialog from './SoftenPrivateAccessAfterPublicationDialog';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { putAccessType } from '../../../api/resourceApi';
import { AccessTypes } from '../../../types/license.types';

interface AddAccessPopoverProps {
  showAddAccessPopover: boolean;
  anchorEl: HTMLButtonElement | null;
  handlePopoverClose: () => void;
  setNetworkError: (value: Error | AxiosError | undefined) => void;
  setShowCourseAutocomplete: (value: boolean) => void;
  setShowPersonAccessField: (value: boolean) => void;
  addInstitutionPrivateConsumerAccess: () => void;
  hasInstitutionPrivateAccess: () => boolean;
  courses: Course[];
  waitingForCourses: boolean;
  handlePopoverCourseClick: () => void;
  setUpdatingPrivateAccessList: (status: boolean) => void;
}

const AddAccessPopover: FC<AddAccessPopoverProps> = ({
  showAddAccessPopover,
  anchorEl,
  setNetworkError,
  handlePopoverClose,
  setShowCourseAutocomplete,
  setShowPersonAccessField,
  addInstitutionPrivateConsumerAccess,
  hasInstitutionPrivateAccess,
  courses,
  waitingForCourses,
  handlePopoverCourseClick,
  setUpdatingPrivateAccessList,
}) => {
  const { t } = useTranslation();
  const { values, resetForm } = useFormikContext<Resource>();
  const user = useSelector((state: RootState) => state.user);
  const [showConfirmPublicDialog, setShowConfirmPublicDialog] = useState(false);
  const [showConfirmInstitutionDialog, setConfirmInstitutionDialog] = useState(false);

  const changeToPublicAccess = async () => {
    try {
      setUpdatingPrivateAccessList(true);
      setNetworkError(undefined);
      await putAccessType(values.identifier, AccessTypes.open);
      values.features.dlr_access = AccessTypes.open;
      resetForm({ values });
    } catch (error) {
      setNetworkError(handlePotentialAxiosError(error));
    } finally {
      setUpdatingPrivateAccessList(false);
    }
  };

  const handleInstitutionListItemClick = () => {
    setNetworkError(undefined);
    setShowCourseAutocomplete(false);
    setShowPersonAccessField(false);
    if (values.features.dlr_status_published) {
      setConfirmInstitutionDialog(true);
    } else {
      addInstitutionPrivateConsumerAccess();
    }
    handlePopoverClose();
  };

  const dialogConfirmedInstitutionAccess = () => {
    addInstitutionPrivateConsumerAccess();
  };

  return (
    <>
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
          {values.features.dlr_status_published && (
            <ListItem
              data-testid="add-public-consumer-access"
              onClick={() => {
                setNetworkError(undefined);
                setShowCourseAutocomplete(false);
                setShowPersonAccessField(false);
                setShowConfirmPublicDialog(true);
                handlePopoverClose();
              }}
              button>
              <ListItemText primary={t('resource.access_types.open')} />
            </ListItem>
          )}
          <ListItem
            data-testid="add-institution-consumer-access"
            disabled={hasInstitutionPrivateAccess()}
            onClick={() => {
              handleInstitutionListItemClick();
            }}
            button>
            <ListItemText primary={`${t('access.everyone_at')} ${user.institution}`} />
          </ListItem>
          <ListItem
            button
            data-testid="add-course-consumer-access"
            disabled={courses.length === 0 && !waitingForCourses}
            onClick={() => {
              setShowPersonAccessField(false);
              setNetworkError(undefined);
              handlePopoverCourseClick();
            }}>
            <ListItemText primary={t('access.course_code')} />
          </ListItem>
          <ListItem
            button
            data-testid="add-person-consumer-access"
            onClick={() => {
              setNetworkError(undefined);
              setShowCourseAutocomplete(false);
              setShowPersonAccessField(true);
              handlePopoverClose();
            }}>
            <ListItemText primary={t('access.single_persons')} />
          </ListItem>
        </List>
      </Popover>
      <SoftenPrivateAccessAfterPublicationDialog
        accessType={'public'}
        open={showConfirmPublicDialog}
        setOpen={setShowConfirmPublicDialog}
        softenPrivateAccess={changeToPublicAccess}
      />
      <SoftenPrivateAccessAfterPublicationDialog
        accessType={'institution'}
        open={showConfirmInstitutionDialog}
        setOpen={setConfirmInstitutionDialog}
        softenPrivateAccess={dialogConfirmedInstitutionAccess}
      />
    </>
  );
};

export default AddAccessPopover;
