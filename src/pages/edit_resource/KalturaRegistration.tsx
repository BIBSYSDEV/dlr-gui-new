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
import { KalturaPresentation } from '../../types/resource.types';
import kalturaLogo from '../../resources/images/Kaltura_Sun_black_icon.png';
import KalturaListItem from './KalturaListItem';
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

interface KalturaRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (kalturaPresentation: KalturaPresentation) => void;
}

const itemsPrPage = 10;

const KalturaRegistration: FC<KalturaRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const [kalturaResources, setKalturaResources] = useState<KalturaPresentation[]>();
  const [filteredKalturaResources, setFilteredKalturaResources] = useState<KalturaPresentation[]>();
  const [getKalturaResourcesError, setGetKalturaResourcesError] = useState<Error>();
  const [busyGettingKalturaResources, setBusyGettingKalturaResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const startOfList = createRef<HTMLDivElement>();
  const [firstItemOnPage, setFirstItemOnPage] = useState(0);
  const [lastItemOnPage, setLastItemOnPage] = useState<number>();
  const [filterValue, setFilterValue] = useState('');
  const [showAllResources, setShowAllResources] = useState(false);

  const handlePageChange = (pageValue: number) => {
    setPage(pageValue);
    setFirstItemOnPage((pageValue - 1) * itemsPrPage);
    filteredKalturaResources &&
      setLastItemOnPage(
        filteredKalturaResources.length > itemsPrPage * pageValue
          ? pageValue * itemsPrPage
          : filteredKalturaResources?.length
      );

    if (startOfList && startOfList.current) {
      startOfList.current.scrollIntoView();
    }
  };

  const handleClickOpen = async () => {
    setPage(1);
    setOpen(true);
    setBusyGettingKalturaResources(true);
    setGetKalturaResourcesError(undefined);
    try {
      const result = (await getMyKalturaPresentations()).data;
      setKalturaResources(result);
    } catch (error) {
      setGetKalturaResourcesError(undefined);
    } finally {
      setBusyGettingKalturaResources(false);
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
    if (kalturaResources) {
      let filteredList = kalturaResources;
      if (!showAllResources) {
        filteredList = kalturaResources.filter((item) => !item.dlrContentIdentifier);
      }
      if (filterValue) {
        filteredList = filteredList?.filter((item) => item.title.toLowerCase().includes(filterValue.toLowerCase()));
      }
      setFilteredKalturaResources(filteredList);
      setPage(1);
      setFirstItemOnPage(0);
      setLastItemOnPage(filteredList.length > itemsPrPage ? itemsPrPage : filteredList.length);
    }
  }, [showAllResources, kalturaResources, filterValue]);

  return (
    <>
      <StartRegistrationMethodAccordion
        headerLabel={t('kaltura.start_with_kaltura_resource')}
        icon={<img height="24px" src={kalturaLogo} alt="Kaltura logo" />}
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
            {filteredKalturaResources && kalturaResources && !busyGettingKalturaResources && (
              <StyledFullWidth>
                <StyledGridForFilters container justifyContent="space-between">
                  <Grid item md={7} xs={12}>
                    <StyledFilterBoxWrapper>
                      <Typography display="inline" variant="body1">
                        {t('kaltura.fill_filter_box')}:
                      </Typography>
                      <StyledTextFieldWithMargin
                        onChange={(event) => setFilterValue(event.target.value)}
                        value={filterValue}
                        placeholder={'Filter'}
                        variant="outlined"
                        data-testid="filter-text-box"
                      />
                    </StyledFilterBoxWrapper>
                  </Grid>
                  <StyledCheckBoxWrapper item md={5} xs={12}>
                    <FormControlLabel
                      data-testid="show-already-imported-FormControlLabel"
                      control={
                        <Checkbox
                          data-testid="show-already-imported-checkbox"
                          color="default"
                          checked={showAllResources}
                          name="show_already_imported"
                        />
                      }
                      label={t('kaltura.show_already_imported')}
                      onChange={() => setShowAllResources(!showAllResources)}
                    />
                  </StyledCheckBoxWrapper>
                </StyledGridForFilters>
                <StyledListInfo>
                  {filteredKalturaResources.length > 0 && (
                    <>
                      <Typography variant="h3" component="p" display="inline">
                        {`${t('common.showing')} ${firstItemOnPage + 1}${
                          lastItemOnPage !== 1 ? `-${lastItemOnPage}` : ''
                        } ${t('common.of').toLowerCase()} ${filteredKalturaResources.length} `}
                      </Typography>
                      {kalturaResources.length !== filteredKalturaResources.length && (
                        <Typography variant="body2" display="inline">
                          {`(${kalturaResources.length - filteredKalturaResources.length} ${t('is filtered out')})`}
                        </Typography>
                      )}
                    </>
                  )}
                </StyledListInfo>
              </StyledFullWidth>
            )}
            {busyGettingKalturaResources ? (
              <CircularProgress />
            ) : filteredKalturaResources && filteredKalturaResources.length > 0 ? (
              <>
                <StyledList>
                  {filteredKalturaResources.slice(firstItemOnPage, lastItemOnPage).map((resultItem) => (
                    <KalturaListItem key={resultItem.id} item={resultItem} handleUseResource={handleUseResource} />
                  ))}
                </StyledList>
                {filteredKalturaResources.length > itemsPrPage && (
                  <StyledPaginationWrapper>
                    <Typography variant="subtitle2">{t('common.page')}</Typography>
                    <Pagination
                      color="primary"
                      data-testid={`kaltura-pagination`}
                      count={Math.ceil(filteredKalturaResources.length / itemsPrPage)}
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
            {getKalturaResourcesError && <ErrorBanner userNeedsToBeLoggedIn={true} error={getKalturaResourcesError} />}
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

export default KalturaRegistration;
