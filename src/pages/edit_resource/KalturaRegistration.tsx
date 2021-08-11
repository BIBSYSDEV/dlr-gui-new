import React, { createRef, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import { getMyKalturaPresentations } from '../../api/resourceApi';
import { Button, CircularProgress, DialogContent, List, Typography, useMediaQuery } from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';
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

const StyledBody = styled.div`
  width: 100%;
`;
const StyledDialogContent = styled(DialogContent)`
  height: 70vh;
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
  const [getKalturaResourcesError, setGetKalturaResourcesError] = useState<Error>();
  const [busyGettingKalturaResources, setBusyGettingKalturaResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [firstItemOnPage, setFirstItemOnPage] = useState<number>(0);
  const [lastItemOnPage, setLastItemOnPage] = useState<number>(0);
  const startOfList = createRef<HTMLDivElement>();

  const handlePageChange = (pageValue: number) => {
    setPage(pageValue);
    setFirstItemOnPage((pageValue - 1) * itemsPrPage);
    setLastItemOnPage(pageValue * itemsPrPage);
    if (startOfList && startOfList.current) {
      startOfList.current.scrollIntoView();
    }
  };

  const handleClickOpen = async () => {
    setPage(1);
    setOpen(true);
    try {
      setBusyGettingKalturaResources(true);
      setGetKalturaResourcesError(undefined);
      const result = (await getMyKalturaPresentations()).data;
      setKalturaResources(result);
      setFirstItemOnPage(0);
      setLastItemOnPage(result.length > itemsPrPage ? itemsPrPage : result.length);
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

  return (
    <>
      <StartRegistrationMethodAccordion
        headerLabel={t('kaltura.start_with_kaltura_resource')}
        icon={<img height="24px" src={kalturaLogo} alt="Kaltura logo" />}
        expanded={expanded}
        onChange={onChange}
        ariaControls="resource-method-kaltura"
        dataTestId="new-resource-kaltura">
        <StyledBody>
          <Button
            data-testid="open-kaltura-dialog-button"
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleClickOpen}>
            {t('kaltura.show_my_resources')}
          </Button>
        </StyledBody>
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
          {kalturaResources && !busyGettingKalturaResources && (
            <div ref={startOfList}>
              <Typography variant="h3">{t('common.result')}</Typography>
              <Typography>
                {kalturaResources?.length > 0 ? (
                  <>
                    {`${t('common.showing')} ${firstItemOnPage + 1}-${lastItemOnPage} ${t('common.of').toLowerCase()} ${
                      kalturaResources?.length
                    }.`}
                  </>
                ) : (
                  <>{t('dashboard.search_result_no_hits')}</>
                )}
              </Typography>
              <Typography>{t('kaltura.choose_a_resource')}.</Typography>
            </div>
          )}
          <StyledList>
            {busyGettingKalturaResources ? (
              <CircularProgress />
            ) : kalturaResources && kalturaResources.length > 0 ? (
              <>
                {kalturaResources.slice(firstItemOnPage, lastItemOnPage).map((resultItem) => (
                  <KalturaListItem key={resultItem.id} item={resultItem} handleUseResource={handleUseResource} />
                ))}
                {kalturaResources.length > itemsPrPage && (
                  <StyledPaginationWrapper>
                    <Typography variant="subtitle2">{t('common.page')}</Typography>
                    <Pagination
                      color="primary"
                      data-testid={`kaltura-pagination`}
                      count={Math.ceil(kalturaResources.length / itemsPrPage)}
                      page={page}
                      onChange={(_event, value) => {
                        handlePageChange(value);
                      }}
                    />
                  </StyledPaginationWrapper>
                )}
              </>
            ) : (
              <Typography>{t('kaltura.no_resources_found')}</Typography>
            )}
          </StyledList>
          {getKalturaResourcesError && <ErrorBanner userNeedsToBeLoggedIn={true} error={getKalturaResourcesError} />}
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
