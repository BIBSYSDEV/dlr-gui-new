import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import VideocamIcon from '@material-ui/icons/Videocam';
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

const FormDialogTitleId = 'kaltura-dialog-title';

const StyledBody = styled.div`
  width: 100%;
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

export interface KalturaPresentation {
  id: string;
  title: string;
  timeRecorded: string;
  downloadUrl: string;
  url: string;
  thumbnailUrl: string;
  institution: string;
  dlrContentIdentifier: string;
}

interface KalturaRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (id: string) => void;
}

const KalturaRegistration: FC<KalturaRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const [kalturaResources, setKalturaResources] = useState<KalturaPresentation[]>();
  const [getKalturaResourcesError, setGetKalturaResourcesError] = useState<Error>();
  const [busyGettingKalturaResources, setBusyGettingKalturaResources] = useState(false);
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.md - 1}px)`);
  const [open, setOpen] = useState(false);

  const handleClickOpen = async () => {
    setOpen(true);
    try {
      setBusyGettingKalturaResources(true);
      setGetKalturaResourcesError(undefined);
      setKalturaResources((await getMyKalturaPresentations()).data);
    } catch (error) {
      setGetKalturaResourcesError(undefined);
    } finally {
      setBusyGettingKalturaResources(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUseResource = (kalturaResourceId: string) => {
    console.log('valgt: ' + kalturaResourceId);
    setOpen(false);
  };

  return (
    <>
      <StartRegistrationMethodAccordion
        headerLabel={t('Start med å velge en video fra din Kaltura-konto(translate)')}
        icon={<VideocamIcon className="icon" />}
        expanded={expanded}
        onChange={onChange}
        ariaControls="resource-method-link"
        dataTestId="new-resource-link">
        <StyledBody>
          <Button
            data-testid="open-kaltura-dialog-button"
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleClickOpen}>
            {t('VIS MINE KALTURA-RESSURSER (i18n)')}
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
        <DialogContent>
          <DialogContentText>{t('kaltura.choose_a_resource')}. </DialogContentText>
          <StyledList>
            {busyGettingKalturaResources ? (
              <CircularProgress />
            ) : kalturaResources ? (
              kalturaResources.map((resultItem) => (
                <StyledResultItem key={resultItem.id}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <StyledImageWrapper>
                        <StyledImage src={resultItem.thumbnailUrl} />
                      </StyledImageWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Link href={resultItem.url} target="_blank">
                        <Typography> {resultItem.title}</Typography>
                      </Link>
                    </Grid>
                    <Grid item xs={12} sm={2} alignItems="center">
                      <Button variant="outlined" onClick={() => handleUseResource(resultItem.id)}>
                        {t('common.use')}
                      </Button>
                    </Grid>
                  </Grid>
                </StyledResultItem>
              ))
            ) : (
              <Typography>{t('Ingen ressurser funnet')}</Typography>
            )}
          </StyledList>
          {getKalturaResourcesError && <ErrorBanner userNeedsToBeLoggedIn={true} error={getKalturaResourcesError} />}
        </DialogContent>
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
