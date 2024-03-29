import React, { createRef, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getMyPanoptoResources } from '../../api/resourceApi';
import {
  Button,
  Checkbox,
  CircularProgress,
  DialogContent,
  FormControlLabel,
  Grid,
  List,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import ErrorBanner from '../../components/ErrorBanner';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { VideoManagementSystems, VMSResource } from '../../types/resource.types';
import VMSListItem from './VMSListItem';
import Pagination from '@mui/material/Pagination';
import { StyledFullWidthWrapper, StyledPaginationWrapper } from '../../components/styled/Wrappers';
import StartRegistrationAccordionPanopto from './StartRegistrationAccordionPanopto';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const FormDialogTitleId = 'panopto-dialog-title';

const StyledDialogContent = styled(DialogContent)`
  height: 70vh;
`;

const StyledFilterBoxWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const StyledCheckBoxWrapper = styled(Grid)`
  display: flex;
  align-items: flex-end;
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

const StyledTextFieldWithMargin = styled(TextField)`
  margin-left: 1rem;
`;

const StyledListInfo = styled.div`
  align-self: start;
`;
const StyledGridForFilters = styled(Grid)`
  margin-bottom: 1rem;
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

interface PanoptoRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (vmsResource: VMSResource, vms: VideoManagementSystems) => void;
}

const itemsPrPage = 10;

const PanoptoRegistration: FC<PanoptoRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const [resources, setResources] = useState<VMSResource[]>();
  const [filteredResources, setFilteredResources] = useState<VMSResource[]>();
  const [getResourcesError, setGetResourcesError] = useState<Error | AxiosError>();
  const [busyGettingResources, setBusyGettingResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const startOfList = createRef<HTMLDivElement>();
  const [firstItemOnPage, setFirstItemOnPage] = useState(0);
  const [lastItemOnPage, setLastItemOnPage] = useState<number>();
  const [filterValue, setFilterValue] = useState('');
  const [hideImported, setHideImported] = useState(false);

  const handlePageChange = async (pageValue: number) => {
    setPage(pageValue);
    setFirstItemOnPage((pageValue - 1) * itemsPrPage);
    filteredResources &&
      setLastItemOnPage(
        filteredResources.length > itemsPrPage * pageValue ? pageValue * itemsPrPage : filteredResources?.length
      );
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
      setResources((await getMyPanoptoResources()).data);
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
    onSubmit(vmsResource, VideoManagementSystems.Panopto);
  };

  useEffect(() => {
    //run filters
    if (resources) {
      let filteredList = resources;
      if (hideImported) {
        filteredList = resources.filter((item) => !item.dlrContentIdentifier);
      }
      if (filterValue) {
        filteredList = filteredList?.filter((item) => item.title.toLowerCase().includes(filterValue.toLowerCase()));
      }
      setFilteredResources(filteredList);
      setPage(1);
      setFirstItemOnPage(0);
      setLastItemOnPage(filteredList.length > itemsPrPage ? itemsPrPage : filteredList.length);
    }
  }, [hideImported, resources, filterValue]);

  return (
    <>
      <StartRegistrationAccordionPanopto expanded={expanded} onChange={onChange} handleClickOpen={handleClickOpen} />
      <Dialog
        maxWidth={'md'}
        fullWidth
        fullScreen={fullScreenDialog}
        open={open}
        onClose={handleClose}
        aria-labelledby={FormDialogTitleId}>
        <DialogTitle id={FormDialogTitleId}>{t(`vms.panopto.my_resources`)}</DialogTitle>
        <StyledDialogContent>
          <StyledResultList ref={startOfList}>
            {filteredResources && resources && !busyGettingResources && (
              <StyledFullWidthWrapper>
                <StyledGridForFilters container justifyContent="space-between">
                  <Grid item md={7} xs={12}>
                    <StyledFilterBoxWrapper>
                      <Typography display="inline" variant="body1">
                        <label htmlFor="filter-text-box">{t('vms.fill_filter_box')}:</label>
                      </Typography>
                      <StyledTextFieldWithMargin
                        onChange={(event) => setFilterValue(event.target.value)}
                        value={filterValue}
                        placeholder={t('dashboard.filter') ?? ''}
                        variant="outlined"
                        data-testid="filter-text-box"
                        id="filter-text-box"
                      />
                    </StyledFilterBoxWrapper>
                  </Grid>
                  <StyledCheckBoxWrapper item md={5} xs={12}>
                    <FormControlLabel
                      data-testid="hide-already-imported-FormControlLabel"
                      control={
                        <Checkbox
                          data-testid="hide-already-imported-checkbox"
                          color="default"
                          checked={hideImported}
                          name="hide_already_imported"
                        />
                      }
                      label={<Typography>{t('vms.hide_already_imported')}</Typography>}
                      onChange={() => setHideImported(!hideImported)}
                    />
                  </StyledCheckBoxWrapper>
                </StyledGridForFilters>
                <StyledListInfo>
                  {filteredResources.length > 0 && (
                    <>
                      <Typography variant="h3" component="p" display="inline">
                        {`${t('common.showing')} ${firstItemOnPage + 1}${
                          lastItemOnPage !== 1 ? `-${lastItemOnPage}` : ''
                        } ${t('common.of').toLowerCase()} ${filteredResources.length} `}
                      </Typography>
                      {resources.length !== filteredResources.length && (
                        <Typography variant="body2" display="inline">
                          {`(${resources.length - filteredResources.length} ${t('vms.is_filtered_out')})`}
                        </Typography>
                      )}
                    </>
                  )}
                </StyledListInfo>
              </StyledFullWidthWrapper>
            )}
            {busyGettingResources ? (
              <CircularProgress />
            ) : filteredResources && filteredResources.length > 0 ? (
              <>
                <StyledList>
                  {filteredResources.slice(firstItemOnPage, lastItemOnPage).map((resultItem) => (
                    <VMSListItem key={resultItem.id} item={resultItem} handleUseResource={handleUseResource} />
                  ))}
                </StyledList>
                {filteredResources.length > itemsPrPage && (
                  <StyledPaginationWrapper>
                    <Typography variant="subtitle2">{t('common.page')}</Typography>
                    <Pagination
                      color="primary"
                      data-testid={`panopto-pagination`}
                      count={Math.ceil(filteredResources.length / itemsPrPage)}
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

export default PanoptoRegistration;
