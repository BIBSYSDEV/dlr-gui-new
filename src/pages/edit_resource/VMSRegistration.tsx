import React, { createRef, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import { getMyKalturaPresentations } from '../../api/resourceApi';
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
} from '@material-ui/core';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import ErrorBanner from '../../components/ErrorBanner';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { KalturaPresentation, VideoManagementSystems } from '../../types/resource.types';
import kalturaLogo from '../../resources/images/Kaltura_Sun_black_icon.png';
import VMSListItem from './VMSListItem';
import Pagination from '@material-ui/lab/Pagination';
import { StyledPaginationWrapper } from '../../components/styled/Wrappers';

const FormDialogTitleId = 'kaltura-dialog-title';

const StyledFullWidth = styled.div`
  width: 100%;
`;

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

const VMSObjects = [
  {
    type: VideoManagementSystems.Kaltura,
    icon: kalturaLogo,
    icon_alt: 'Kaltura logo',
    headerLabel: 'kaltura.start_with_kaltura_resource',
  },
  {
    type: VideoManagementSystems.Panopto,
    icon: kalturaLogo,
    icon_alt: 'Panopto logo',
    headerLabel: 'panopto.start_with_panopto_resource',
  },
];
// VMSObjects[VideoManagementSystems.Kaltura] = { name: 'kaltura', icon: 'arne' };
// VMSObjects[VideoManagementSystems.Panopto] = { name: '2kaltura', icon: 'ar2ne' };

interface LORRegistrationProps {
  expanded: boolean;
  VMS: VideoManagementSystems;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (kalturaPresentation: KalturaPresentation) => void;
}

const itemsPrPage = 10;

const VMSRegistration: FC<LORRegistrationProps> = ({ expanded, VMS, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const vmsObject = VMS === VideoManagementSystems.Kaltura ? VMSObjects[0] : VMSObjects[1];
  const [resources, setResources] = useState<KalturaPresentation[]>(); //TODO
  const [filteredResources, setFilteredResources] = useState<KalturaPresentation[]>(); //TODO
  const [getResourcesError, setGetResourcesError] = useState<Error>();
  const [busyGettingResources, setBusyGettingResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const startOfList = createRef<HTMLDivElement>();
  const [firstItemOnPage, setFirstItemOnPage] = useState(0);
  const [lastItemOnPage, setLastItemOnPage] = useState<number>();
  const [filterValue, setFilterValue] = useState('');
  const [hideImported, setHideImported] = useState(false);

  const handlePageChange = (pageValue: number) => {
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
      const result = (await getMyKalturaPresentations()).data;
      //TODO
      setResources(result);
    } catch (error) {
      setGetResourcesError(undefined);
    } finally {
      setBusyGettingResources(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUseResource = (kalturaPresentation: KalturaPresentation) => {
    setOpen(false);
    onSubmit(kalturaPresentation);
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
      <StartRegistrationMethodAccordion
        headerLabel={t(vmsObject.headerLabel)}
        icon={<img height="24px" src={vmsObject.icon} alt={vmsObject.icon_alt} />}
        expanded={expanded}
        onChange={onChange}
        ariaControls="resource-method-kaltura"
        dataTestId="new-resource-kaltura">
        <StyledFullWidth>
          <Button
            data-testid="open-kaltura-dialog-button"
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleClickOpen}>
            {t('kaltura.show_my_resources')}
          </Button>
        </StyledFullWidth>
      </StartRegistrationMethodAccordion>
      <Dialog
        maxWidth={'md'}
        fullWidth
        fullScreen={fullScreenDialog}
        open={open}
        onClose={handleClose}
        aria-labelledby={FormDialogTitleId}>
        <DialogTitle id={FormDialogTitleId}>{t('kaltura.my_resources')}</DialogTitle>
        <StyledDialogContent>
          <StyledResultList ref={startOfList}>
            {filteredResources && resources && !busyGettingResources && (
              <StyledFullWidth>
                <StyledGridForFilters container justifyContent="space-between">
                  <Grid item md={7} xs={12}>
                    <StyledFilterBoxWrapper>
                      <Typography display="inline" variant="body1">
                        <label htmlFor="filter-text-box">{t('kaltura.fill_filter_box')}:</label>
                      </Typography>
                      <StyledTextFieldWithMargin
                        onChange={(event) => setFilterValue(event.target.value)}
                        value={filterValue}
                        placeholder={t('dashboard.filter')}
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
                      label={t('kaltura.hide_already_imported')}
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
                          {`(${resources.length - filteredResources.length} ${t('kaltura.is_filtered_out')})`}
                        </Typography>
                      )}
                    </>
                  )}
                </StyledListInfo>
              </StyledFullWidth>
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
                      data-testid={`vms-pagination`}
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
                {t('kaltura.no_resources_found')}
              </Typography>
            )}
            {getResourcesError && <ErrorBanner userNeedsToBeLoggedIn={true} error={getResourcesError} />}
          </StyledResultList>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button data-testid="kalture-dialog-close-button" variant="outlined" onClick={handleClose} color="primary">
            {t('common.close')}
          </Button>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default VMSRegistration;
