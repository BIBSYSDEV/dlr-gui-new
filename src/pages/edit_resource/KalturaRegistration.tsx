import React, { createRef, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getMyKalturaResources } from '../../api/resourceApi';
import { Button, CircularProgress, DialogContent, List, Typography, useMediaQuery } from '@mui/material';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import ErrorBanner from '../../components/ErrorBanner';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { VideoManagementSystems, VMSResource } from '../../types/resource.types';
import VMSListItem from './VMSListItem';
import Pagination from '@mui/material/Pagination';
import { StyledFullWidthWrapper, StyledPaginationWrapper } from '../../components/styled/Wrappers';
import StartRegistrationAccordionKaltura from './StartRegistrationAccordionKaltura';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const FormDialogTitleId = 'panopto-dialog-title';

const StyledDialogContent = styled(DialogContent)`
  height: 70vh;
`;

const StyledResultList = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.UnitTurquoise_20percent};
  align-items: center;
  flex: 1;
`;

const StyledListInfo = styled.div`
  align-self: start;
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 1rem;
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

interface KalturaRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (vmsResource: VMSResource, vms: VideoManagementSystems) => void;
}

const itemsPrPage = 3;

const KalturaRegistration: FC<KalturaRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const [resources, setResources] = useState<VMSResource[]>();
  const [getResourcesError, setGetResourcesError] = useState<Error>();
  const [busyGettingResources, setBusyGettingResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const startOfList = createRef<HTMLDivElement>();

  const handlePageChange = async (pageValue: number) => {
    setPage(pageValue);
    setBusyGettingResources(true);
    setGetResourcesError(undefined);
    try {
      setResources((await getMyKalturaResources(getOffset(pageValue), itemsPrPage)).data);
    } catch (error) {
      setGetResourcesError(undefined);
    } finally {
      setBusyGettingResources(false);
    }
    if (startOfList && startOfList.current) {
      startOfList.current.scrollIntoView();
    }
  };

  const handleClickOpen = async () => {
    setPage(1);
    setOpen(true);
    setBusyGettingResources(true);
    setGetResourcesError(undefined);
    try {
      const response = await getMyKalturaResources(0, itemsPrPage);
      setResources(response.data);
      setTotalResults(parseInt(response.headers['content-range'])); //NB! Repurposed variable name
    } catch (error) {
      setGetResourcesError(handlePotentialAxiosError(error));
    } finally {
      setBusyGettingResources(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUseResource = (vmsResource: VMSResource) => {
    setOpen(false);
    onSubmit(vmsResource, VideoManagementSystems.Kaltura);
  };

  const getOffset = (pageValue: number) => {
    return (pageValue - 1) * itemsPrPage;
  };

  return (
    <>
      <StartRegistrationAccordionKaltura expanded={expanded} onChange={onChange} handleClickOpen={handleClickOpen} />
      <Dialog
        maxWidth={'md'}
        fullWidth
        fullScreen={fullScreenDialog}
        open={open}
        onClose={handleClose}
        aria-labelledby={FormDialogTitleId}>
        <DialogTitle id={FormDialogTitleId}>{t(`vms.kaltura.my_resources`)}</DialogTitle>
        <StyledDialogContent>
          <StyledResultList ref={startOfList}>
            {resources && resources.length > 0 && !busyGettingResources && (
              <StyledFullWidthWrapper>
                <StyledListInfo>
                  {!isNaN(totalResults) && (
                    <Typography variant="h3" component="p" display="inline">
                      {`${t('common.showing')} ${getOffset(page) + 1}`}
                      {totalResults > 1 && `-${getOffset(page) + itemsPrPage} `}
                      {t('common.of').toLowerCase()} {totalResults}
                    </Typography>
                  )}
                </StyledListInfo>
              </StyledFullWidthWrapper>
            )}
            {busyGettingResources ? (
              <CircularProgress />
            ) : resources && resources.length > 0 ? (
              <>
                <StyledList>
                  {resources.map((resultItem) => (
                    <VMSListItem key={resultItem.id} item={resultItem} handleUseResource={handleUseResource} />
                  ))}
                </StyledList>
                {totalResults > itemsPrPage && (
                  <StyledPaginationWrapper>
                    <Typography variant="subtitle2">{t('common.page')}</Typography>
                    <Pagination
                      color="primary"
                      data-testid={`vms-pagination`}
                      count={Math.ceil(totalResults / itemsPrPage)}
                      page={page}
                      onChange={(_event, value) => {
                        handlePageChange(value);
                      }}
                    />
                  </StyledPaginationWrapper>
                )}
              </>
            ) : (
              <Typography variant="h3" component="p">
                {t('vms.no_resources_found')}
              </Typography>
            )}
            {getResourcesError && <ErrorBanner userNeedsToBeLoggedIn={true} error={getResourcesError} />}
          </StyledResultList>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button data-testid="vms-dialog-close-button" variant="outlined" onClick={handleClose} color="primary">
            {t('common.close')}
          </Button>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default KalturaRegistration;
