import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import { getMyKalturaPresentations } from '../../api/resourceApi';
import {
  Button,
  CircularProgress,
  DialogContent,
  Grid,
  Link,
  List,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { Colors, DeviceWidths, StyleWidths } from '../../themes/mainTheme';
import ErrorBanner from '../../components/ErrorBanner';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { KalturaPresentation } from '../../types/resource.types';
import kalturaLogo from '../../resources/images/Kaltura_Sun_black_icon.png';
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

const StyledImageWrapper: any = styled.div`
  min-height: 5rem;
  height: 5rem;
  min-width: 7.85rem;
  width: 7.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Colors.DescriptionPageGradientColor2};
`;

const StyledResultItem = styled.li`
  padding: 1rem;
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.UnitTurquoise_20percent};
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const StyledImage: any = styled.img`
  max-height: 5rem;
  max-width: 7.85rem;
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
  const [firstItemOnPage, setFirstItemOnPage] = useState<number>();
  const [lastItemOnPage, setLastItemOnPage] = useState<number>();

  const handlePageChange = (pageValue: number) => {
    setPage(pageValue);
    setFirstItemOnPage((pageValue - 1) * itemsPrPage);
    setLastItemOnPage(pageValue * itemsPrPage);
  };

  const handleClickOpen = async () => {
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
    setPage(1);
  };

  const handleUseResource = (kalturaPresentation: KalturaPresentation) => {
    setOpen(false);
    onSubmit(kalturaPresentation);
    setPage(1);
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
            <DialogContentText>
              Results ({kalturaResources?.length}). {t('kaltura.choose_a_resource')}.
            </DialogContentText>
          )}
          <StyledList>
            {busyGettingKalturaResources ? (
              <CircularProgress />
            ) : kalturaResources ? (
              <>
                {kalturaResources.slice(firstItemOnPage, lastItemOnPage).map((resultItem) => (
                  <StyledResultItem key={resultItem.id}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <StyledImageWrapper>
                          <StyledImage src={resultItem.thumbnailUrl} />
                        </StyledImageWrapper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Link href={resultItem.url} target="_blank">
                          <Typography>{resultItem.title}</Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        {resultItem.dlrContentIdentifier ? (
                          <Typography variant="caption">{t('kaltura.already_imported')}</Typography>
                        ) : (
                          <Button
                            variant="outlined"
                            data-testid={`use-kaltura-link-button-${resultItem.id}`}
                            onClick={() => handleUseResource(resultItem)}>
                            {t('common.use')}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </StyledResultItem>
                ))}
                {kalturaResources.length > itemsPrPage && (
                  <StyledPaginationWrapper>
                    <Typography variant="subtitle2">{t('common.page')}</Typography>
                    <Pagination
                      color="primary"
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
              <Typography>{t('Ingen ressurser funnet')}</Typography>
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
