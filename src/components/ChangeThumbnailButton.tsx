import React, { FC, useEffect, useRef, useState } from 'react';
import { Content } from '../types/content.types';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Resource } from '../types/resource.types';
import { deleteResourceContent, getResourceContentEvent } from '../api/resourceApi';
import { setContentAsDefaultThumbnail } from '../api/fileApi';
import { CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';
import ErrorBanner from './ErrorBanner';
import Popover from '@material-ui/core/Popover';
import { DashboardModal } from '@uppy/react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Uppy } from '@uppy/core';
import { uppyLocale } from '../utils/uppy-config';

interface ChangeThumbnailButtonProps {
  thumbnailUppy: Uppy;
  newThumbnailContent: Content | undefined;
  newThumbnailIsReady: () => void;
  pollNewThumbnail: (status: boolean) => void;
}

const StyledWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const StyledCircularProgress = styled(CircularProgress)`
  align-self: center;
  margin-left: 1rem;
`;

const ResourceThumbnailUploaded = 'RESOURCE_THUMBNAIL_UPLOADED';
const MaxNumberOfAPICallsAttemps = 4;

const ChangeThumbnailButton: FC<ChangeThumbnailButtonProps> = ({
  newThumbnailContent,
  thumbnailUppy,
  newThumbnailIsReady,
  pollNewThumbnail,
}) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Resource>();
  const [fileInputIsBusy, setFileInputIsBusy] = useState(false);
  const [showThumbnailDashboardModal, setShowThumbnailDashboardModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [thumbnailUpdateError, setThumbnailUpdateError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (thumbnailUppy) {
      thumbnailUppy.on('upload-success', () => {
        thumbnailUppy.reset();
        if (!mountedRef.current) return null;
        setShowThumbnailDashboardModal(false);
      });
      thumbnailUppy.on('file-added', () => {
        if (!mountedRef.current) return null;
        setFileInputIsBusy(true);
      });
      thumbnailUppy.on('upload-error', () => {
        if (!mountedRef.current) return null;
        setFileInputIsBusy(false);
      });
    }
  }, [thumbnailUppy]);

  useEffect(() => {
    const setNewThumbnailAPICallAndFormikChange = async () => {
      try {
        setFileInputIsBusy(true);
        if (newThumbnailContent) {
          let responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
          if (!mountedRef.current) return null;
          let thumbnailReady = responseEvents.data.resource_events.find(
            (event) => event.event === ResourceThumbnailUploaded
          );
          let numberOfTries = 0;
          while (!thumbnailReady && numberOfTries < MaxNumberOfAPICallsAttemps) {
            await new Promise((r) => setTimeout(r, 1000));
            responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
            if (!mountedRef.current) return null;
            thumbnailReady = responseEvents.data.resource_events.find(
              (event) => event.event === ResourceThumbnailUploaded
            );
            numberOfTries++;
          }
          await setContentAsDefaultThumbnail(values.identifier, newThumbnailContent.identifier);
          if (!mountedRef.current) return null;
          let tobeDeletedIdentifier = '';
          for (let i = 0; i < values.contents.additionalContent.length; i++) {
            if (values.contents.additionalContent[i].identifier === newThumbnailContent.identifier) {
              values.contents.additionalContent[i].features.dlr_thumbnail_default = 'true';
              values.contents.masterContent.features.dlr_thumbnail_default = 'false';
            } else if (
              values.contents.additionalContent[i].identifier !== newThumbnailContent.identifier &&
              values.contents.additionalContent[i].features.dlr_thumbnail_default === 'true'
            ) {
              tobeDeletedIdentifier = values.contents.additionalContent[i].identifier;
            } else {
              values.contents.additionalContent[i].features.dlr_thumbnail_default = 'false';
            }
          }

          pollNewThumbnail(true);
          await new Promise((r) => setTimeout(r, 1000));
          if (!mountedRef.current) return null;
          pollNewThumbnail(false);
          setFileInputIsBusy(false);
          if (tobeDeletedIdentifier.length > 0) {
            values.contents.additionalContent = values.contents.additionalContent.filter(
              (content) => content.identifier !== tobeDeletedIdentifier
            );
            await deleteResourceContent(values.identifier, tobeDeletedIdentifier);
          }
        }
        if (!mountedRef.current) return null;
        setThumbnailUpdateError(false);
      } catch (error) {
        setThumbnailUpdateError(true);
      } finally {
        newThumbnailIsReady();
        setFileInputIsBusy(false);
      }
    };
    if (newThumbnailContent) {
      setNewThumbnailAPICallAndFormikChange();
    }
  }, [newThumbnailContent, pollNewThumbnail, newThumbnailIsReady, values]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const returnToDefaultThumbnail = async () => {
    setFileInputIsBusy(true);
    try {
      await setContentAsDefaultThumbnail(values.identifier, values.contents.masterContent.identifier);
      const previousThumbnailContent = values.contents.additionalContent.find(
        (content) =>
          content.features.dlr_thumbnail_default === 'true' && content.features.dlr_content_master === 'false'
      );
      if (previousThumbnailContent) {
        await deleteResourceContent(values.identifier, previousThumbnailContent.identifier);
        values.contents.additionalContent = values.contents.additionalContent.filter(
          (content) => content.identifier !== previousThumbnailContent.identifier
        );
      }
      values.contents.masterContent.features.dlr_thumbnail_default = 'true';
      pollNewThumbnail(true);
      await new Promise((r) => setTimeout(r, 2000));
      setThumbnailUpdateError(false);
    } catch (error) {
      setThumbnailUpdateError(true);
    } finally {
      setFileInputIsBusy(false);
      pollNewThumbnail(false);
      newThumbnailIsReady();
    }
  };

  const handleThumbnailClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (values.contents.masterContent.features.dlr_thumbnail_default === 'true') {
      setShowThumbnailDashboardModal(true);
    } else {
      setAnchorEl(event.currentTarget);
      setShowPopover(true);
    }
  };

  return (
    <StyledWrapper>
      {thumbnailUpdateError && <ErrorBanner />}
      <Button
        variant="outlined"
        color="primary"
        disabled={fileInputIsBusy}
        data-testid="change-master-content-thumbnail-button"
        onClick={(event) => {
          handleThumbnailClick(event);
        }}>
        {t('thumbnail.change_thumbnail')}
      </Button>
      {fileInputIsBusy && <StyledCircularProgress size="1rem" aria-label={t('thumbnail.busy_changing')} />}
      <Popover
        open={showPopover}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setShowPopover(false);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <List aria-label={t('thumbnail.thumbnail_options')}>
          <ListItem
            button
            data-testid="upload-new-thumbnail-button"
            onClick={() => {
              setAnchorEl(null);
              setShowPopover(false);
              setShowThumbnailDashboardModal(true);
            }}>
            <ListItemText primary={t('thumbnail.upload_new_thumbnail')} />
          </ListItem>
          <ListItem
            button
            data-testid="revert-thumbnail-button"
            onClick={() => {
              setAnchorEl(null);
              setShowPopover(false);
              returnToDefaultThumbnail();
            }}>
            <ListItemText primary={t('thumbnail.revert_thumbnail')} />
          </ListItem>
        </List>
      </Popover>
      <DashboardModal
        hideRetryButton
        hidePauseResumeButton
        closeAfterFinish={true}
        proudlyDisplayPoweredByUppy={false}
        closeModalOnClickOutside
        open={showThumbnailDashboardModal}
        onRequestClose={() => {
          setShowThumbnailDashboardModal(false);
        }}
        uppy={thumbnailUppy}
        locale={uppyLocale(t)}
      />
    </StyledWrapper>
  );
};

export default ChangeThumbnailButton;
