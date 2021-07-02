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
} from '@material-ui/core';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import BlockIcon from '@material-ui/icons/Block';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import { approveOwnershipRequest, refuseOwnershipRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import * as Yup from 'yup';
import { Formik, Form, Field, FieldProps } from 'formik';

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
  const [deleteComment, setDeleteComment] = useState('');
  const [updateError, setUpdateError] = useState<Error | undefined>();
  const [isGrantingOwnership, setIsGrantingOwnership] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);

  const EmailSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('required'),
  });

  const handleDeleteOwnershipRequest = async (ResourceIdentifier: string, comment: string) => {
    try {
      setIsDeletingRequest(true);
      setUpdateError(undefined);
      await refuseOwnershipRequest(ResourceIdentifier, comment);
      setWorkListOwnership((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(error);
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
      setUpdateError(error);
    } finally {
      setIsGrantingOwnership(false);
    }
  };

  return (
    <StyledListItemWrapper backgroundColor={Colors.LicenseAccessPageGradientColor1}>
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
                Gi eierskap
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
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={showConfirmDeleteDialog}
        onClose={() => setShowConfirmDeleteDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('work_list.delete_request')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('work_list.comment_explanation')}.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment-text-field"
            label={t('work_list.comment')}
            multiline
            rows={4}
            fullWidth
            required
            value={deleteComment}
            inputProps={{ 'data-testid': `delete-ownership-request-comment` }}
            onChange={(event) => setDeleteComment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>{t('common.cancel')}</Button>
          <Button
            startIcon={<DeleteIcon />}
            disabled={deleteComment.length < 1}
            data-testid={`confirm-delete-ownership-button`}
            onClick={() => {
              setShowConfirmDeleteDialog(false);
              handleDeleteOwnershipRequest(workListRequestOwnership.resourceIdentifier, deleteComment);
            }}
            color="secondary">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreenDialog}
        open={showConfirmCGrantOwnershipDialog}
        onClose={() => setShowConfirmCGrantOwnershipDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Are you sure you want to grant ownership to {workListRequestOwnership.submitter}?
        </DialogTitle>
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
                <DialogContentText>Skriv inn feide-id på den nye eieren.</DialogContentText>
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      autoFocus
                      margin="dense"
                      id="comment-text-field"
                      label={'epost'}
                      fullWidth
                      required
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email}
                      inputProps={{ 'data-testid': `grant-ownership-request-email` }}
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
                  Gi eierskap
                </Button>
                <Button onClick={() => setShowConfirmCGrantOwnershipDialog(false)}>{t('common.cancel')}</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      {updateError && <ErrorBanner />}
    </StyledListItemWrapper>
  );
};

export default OwnershipRequestListItem;
