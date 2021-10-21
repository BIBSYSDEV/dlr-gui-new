import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import { WorklistRequest } from '../../types/Worklist.types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createDOI, refuseDoiRequest } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { getAuthoritiesForResourceCreatorOrContributor } from '../../api/authoritiesApi';
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

interface DOIRequestItemProps {
  workListRequestDOI: WorklistRequest;
  setWorkListDoi: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const DOIRequestItem: FC<DOIRequestItemProps> = ({ workListRequestDOI, setWorkListDoi }) => {
  const [isCreatingDOi, setIsCreatingDOi] = useState(false);
  const [busySearchingForAuthorities, setBusySearchingForAuthorities] = useState(false);
  const [hasSearchedForAuthorities, setHasSearchedForAuthorities] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showConfirmCreateDOIDialog, setShowConfirmCreateDOIDialog] = useState(false);
  const [updateError, setUpdateError] = useState<Error | AxiosError>();
  const [searchingForAuthoritiesError, setSearchingForAuthoritiesError] = useState<Error | AxiosError>();
  const [canCreateDOI, setCanCreateDOI] = useState(false);
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const { t } = useTranslation();
  const mountedRef = useRef(true);

  const handleDeleteDoiRequest = async (comment: string) => {
    try {
      setIsDeletingRequest(true);
      setUpdateError(undefined);
      await refuseDoiRequest(workListRequestDOI.resourceIdentifier, comment);
      setWorkListDoi((prevState) =>
        prevState.filter((work) => work.resourceIdentifier !== workListRequestDOI.resourceIdentifier)
      );
    } catch (error) {
      setUpdateError(handlePotentialAxiosError(error));
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const handleCreateDoi = async (ResourceIdentifier: string) => {
    try {
      setIsCreatingDOi(true);
      setUpdateError(undefined);
      await createDOI(ResourceIdentifier);
      setWorkListDoi((prevState) => prevState.filter((work) => work.resourceIdentifier !== ResourceIdentifier));
    } catch (error) {
      setUpdateError(handlePotentialAxiosError(error));
      setIsCreatingDOi(false);
    }
  };

  useEffect(() => {
    const isCreatorsVerified = async () => {
      if (workListRequestDOI.resource?.creators) {
        try {
          if (!mountedRef.current) return null;
          setBusySearchingForAuthorities(true);
          setSearchingForAuthoritiesError(undefined);
          const promiseArray: Promise<any>[] = [];
          workListRequestDOI.resource.creators.map((creator) => {
            return promiseArray.push(
              getAuthoritiesForResourceCreatorOrContributor(workListRequestDOI.resourceIdentifier, creator.identifier)
            );
          });
          const creatorAuthoritiesArray = await Promise.all(promiseArray);
          for (let i = 0; i < creatorAuthoritiesArray.length; i++) {
            if (creatorAuthoritiesArray[i].length > 0) {
              if (!mountedRef.current) return null;
              setCanCreateDOI(true);
            } else {
              if (!mountedRef.current) return null;
              setCanCreateDOI(false);
            }
          }
        } catch (error) {
          if (!mountedRef.current) return null;
          setSearchingForAuthoritiesError(handlePotentialAxiosError(error));
        } finally {
          if (mountedRef.current) {
            setBusySearchingForAuthorities(false);
            setHasSearchedForAuthorities(true);
          }
        }
      }
    };
    isCreatorsVerified();
  }, [workListRequestDOI]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <StyledListItemWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <WorkListRequestMetaDataViewer workListRequest={workListRequestDOI} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                href={`/editresource/${workListRequestDOI.resourceIdentifier}`}
                startIcon={<EditIcon />}
                variant="outlined"
                data-testid={`edit-resoirce-button-${workListRequestDOI.resourceIdentifier}`}
                color="primary">
                {t('resource.edit_resource')}
              </Button>
            </Grid>
            {hasSearchedForAuthorities && !canCreateDOI && (
              <Grid item xs={12}>
                <Typography variant="body2">{t('work_list.doi_verify_resource')}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                disabled={!canCreateDOI}
                data-testid={`create-doi-button-${workListRequestDOI.resourceIdentifier}`}
                variant="outlined"
                color="primary"
                endIcon={busySearchingForAuthorities && <CircularProgress size="1rem" />}
                onClick={() => {
                  setShowConfirmCreateDOIDialog(true);
                }}>
                {t('work_list.create_doi')}
              </Button>
            </Grid>
            {searchingForAuthoritiesError && (
              <Grid item xs={12}>
                <ErrorBanner userNeedsToBeLoggedIn={true} error={searchingForAuthoritiesError} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                data-testid={`show-delete-dialog-${workListRequestDOI.resourceIdentifier}`}
                startIcon={<BlockIcon />}
                endIcon={isDeletingRequest && <CircularProgress size="1rem" />}
                onClick={() => {
                  setShowConfirmDeleteDialog(true);
                }}>
                {t('work_list.delete_request')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {isCreatingDOi && (
          <Grid xs={1} item>
            <CircularProgress size="1rem" />
          </Grid>
        )}
      </Grid>
      <DeleteRequestDialog
        showConfirmDeleteDialog={showConfirmDeleteDialog}
        setShowConfirmDeleteDialog={setShowConfirmDeleteDialog}
        deleteFunction={handleDeleteDoiRequest}
      />

      <Dialog
        fullScreen={fullScreenDialog}
        open={showConfirmCreateDOIDialog}
        onClose={() => setShowConfirmCreateDOIDialog(false)}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('work_list.are_you_sure')}?</DialogTitle>
        <DialogActions>
          <Button
            data-testid={`confirm-create-doi-button`}
            variant="contained"
            onClick={() => {
              setShowConfirmCreateDOIDialog(false);
              handleCreateDoi(workListRequestDOI.resourceIdentifier);
            }}
            color="primary">
            {t('work_list.create_doi')}
          </Button>
          <Button onClick={() => setShowConfirmCreateDOIDialog(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
      {updateError && <ErrorBanner />}
    </StyledListItemWrapper>
  );
};

export default DOIRequestItem;
