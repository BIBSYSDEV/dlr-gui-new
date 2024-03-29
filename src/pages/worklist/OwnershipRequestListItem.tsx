import React, { FC, useState } from 'react';
import { WorklistRequest } from '../../types/Worklist.types';
import styled from 'styled-components';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
} from '@mui/material';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import BlockIcon from '@mui/icons-material/Block';
import { useTranslation } from 'react-i18next';
import { approveOwnershipRequest, refuseOwnershipRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import * as Yup from 'yup';
import { Formik, Form, Field, FieldProps } from 'formik';
import DeleteRequestDialog from './DeleteRequestDialog';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

interface Props {
  backgroundColor: string;
}

const StyledListItemWrapper: any = styled.li<Props>`
  width: 100%;
  max-width: ${StyleWidths.width5};
  background-color: ${(props: any) => props.backgroundColor || Colors.UnitTurquoise_20percent};
  padding: 1rem;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

interface OwnershipRequestListItemProps {
  workListRequestOwnership: WorklistRequest;
  setWorkListOwnership: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const OwnershipRequestListItem: FC<OwnershipRequestListItemProps> = ({
  workListRequestOwnership,
  setWorkListOwnership,
}) => {
  const { t } = useTranslation();
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showConfirmCGrantOwnershipDialog, setShowConfirmCGrantOwnershipDialog] = useState(false);
  const [updateError, setUpdateError] = useState<Error | AxiosError>();
  const [isGrantingOwnership, setIsGrantingOwnership] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('work_list.invalid_email') ?? '')
      .required(t('feedback.required_field') ?? ''),
  });

  const handleDeleteOwnershipRequest = async (comment: string) => {
    try {
      setIsDeletingRequest(true);
      setUpdateError(undefined);
      await refuseOwnershipRequest(workListRequestOwnership.resourceIdentifier, comment);
      setWorkListOwnership((prevState) =>
        prevState.filter((work) => work.resourceIdentifier !== workListRequestOwnership.resourceIdentifier)
      );
    } catch (error) {
      setUpdateError(handlePotentialAxiosError(error));
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const grantOwnership = async (newOwner: string) => {
    try {
      setIsGrantingOwnership(true);
      setUpdateError(undefined);
      await approveOwnershipRequest(workListRequestOwnership.resourceIdentifier, newOwner);
      setWorkListOwnership((prevState) =>
        prevState.filter((work) => work.resourceIdentifier !== workListRequestOwnership.resourceIdentifier)
      );
    } catch (error) {
      setUpdateError(handlePotentialAxiosError(error));
    } finally {
      setIsGrantingOwnership(false);
    }
  };

  return (
    <StyledListItemWrapper
      data-testid={`ownership-request-list-item-${workListRequestOwnership.resourceIdentifier}`}
      backgroundColor={Colors.LicenseAccessPageGradientColor1}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <WorkListRequestMetaDataViewer workListRequest={workListRequestOwnership} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                data-testid={`grant-ownership-button-${workListRequestOwnership.resourceIdentifier}`}
                variant="outlined"
                color="primary"
                onClick={() => {
                  setShowConfirmCGrantOwnershipDialog(true);
                }}>
                {t('work_list.grant_ownership')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                data-testid={`show-delete-dialog-${workListRequestOwnership.resourceIdentifier}`}
                startIcon={<BlockIcon />}
                endIcon={isDeletingRequest && <CircularProgress size="1rem" />}
                onClick={() => {
                  setShowConfirmDeleteDialog(true);
                }}>
                {t('work_list.delete_request')}
              </Button>
            </Grid>
            {isGrantingOwnership && (
              <Grid xs={1} item>
                <CircularProgress size="1rem" />
              </Grid>
            )}
          </Grid>
          {updateError && (
            <Grid item xs={12}>
              <ErrorBanner userNeedsToBeLoggedIn={true} error={updateError} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <DeleteRequestDialog
        showConfirmDeleteDialog={showConfirmDeleteDialog}
        setShowConfirmDeleteDialog={setShowConfirmDeleteDialog}
        deleteFunction={handleDeleteOwnershipRequest}
      />

      <Dialog
        fullScreen={fullScreenDialog}
        open={showConfirmCGrantOwnershipDialog}
        onClose={() => setShowConfirmCGrantOwnershipDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('work_list.grant_ownership')}</DialogTitle>
        <Formik
          initialValues={{ email: workListRequestOwnership.submitter }}
          validationSchema={EmailSchema}
          onSubmit={(values) => {
            setShowConfirmCGrantOwnershipDialog(false);
            grantOwnership(values.email);
          }}>
          {({ errors }) => (
            <Form>
              <DialogContent>
                <DialogContentText>{t('work_list.input_feide_id_of_new_owner')}.</DialogContentText>
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      autoFocus
                      margin="dense"
                      id="comment-text-field"
                      label={t('work_list.feide_id')}
                      fullWidth
                      required
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email}
                      inputProps={{ 'data-testid': `grant-ownership-request-email-text-field` }}
                    />
                  )}
                </Field>
              </DialogContent>
              <DialogActions>
                <Button
                  data-testid={`confirm-grant-ownership-button`}
                  variant="contained"
                  disabled={!!errors.email}
                  type="submit"
                  color="primary">
                  {t('work_list.grant_ownership')}
                </Button>
                <Button onClick={() => setShowConfirmCGrantOwnershipDialog(false)}>{t('common.cancel')}</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </StyledListItemWrapper>
  );
};

export default OwnershipRequestListItem;
