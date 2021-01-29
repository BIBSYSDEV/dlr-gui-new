import React, { FC, useEffect, useState } from 'react';
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

  useEffect(() => {
    if (thumbnailUppy) {
      thumbnailUppy.on('upload-success', () => {
        thumbnailUppy.reset();
        setShowThumbnailDashboardModal(false);
      });
      thumbnailUppy.on('file-added', () => {
        setFileInputIsBusy(true);
      });
    }
  }, [thumbnailUppy]);

  useEffect(() => {
    const setNewThumbnailAPICallAndFormikChange = async () => {
      try {
        setFileInputIsBusy(true);
        if (newThumbnailContent) {
          let responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
          let thumbnailReady = responseEvents.data.resource_events.find(
            (event) => event.event === ResourceThumbnailUploaded
          );
          let numberOfTries = 0;
          while (!thumbnailReady && numberOfTries < 4) {
            await new Promise((r) => setTimeout(r, 1000));
            responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
            thumbnailReady = responseEvents.data.resource_events.find(
              (event) => event.event === ResourceThumbnailUploaded
            );
            numberOfTries++;
          }
          await setContentAsDefaultThumbnail(values.identifier, newThumbnailContent.identifier);
          let tobeDeletedIdentifier = '';
          for (let i = 0; i < values.contents.length; i++) {
            if (values.contents[i].identifier === newThumbnailContent.identifier) {
              values.contents[i].features.dlr_thumbnail_default = 'true';
            } else if (
              values.contents[i].identifier !== newThumbnailContent.identifier &&
              values.contents[i].features.dlr_thumbnail_default === 'true' &&
              values.contents[i].features.dlr_content_master === 'false'
            ) {
              tobeDeletedIdentifier = values.contents[i].identifier;
            } else {
              values.contents[i].features.dlr_thumbnail_default = 'false';
            }
          }

          pollNewThumbnail(true);
          await new Promise((r) => setTimeout(r, 1000));
          pollNewThumbnail(false);
          setFileInputIsBusy(false);
          if (tobeDeletedIdentifier.length > 0) {
            values.contents = values.contents.filter((content) => content.identifier !== tobeDeletedIdentifier);
            await deleteResourceContent(values.identifier, tobeDeletedIdentifier);
          }
        }
        setThumbnailUpdateError(false);
      } catch (error) {
        setThumbnailUpdateError(true);
      } finally {
        newThumbnailIsReady();
      }
    };
    if (newThumbnailContent) {
      setNewThumbnailAPICallAndFormikChange();
    }
  }, [newThumbnailContent, pollNewThumbnail, newThumbnailIsReady, values]);

  const returnToDefaultThumbnail = async () => {
    setFileInputIsBusy(true);
    try {
      const masterContent = values.contents.find((content) => content.features.dlr_content_master === 'true');
      if (masterContent) {
        await setContentAsDefaultThumbnail(values.identifier, masterContent.identifier);
        const previousThumbnailContent = values.contents.find(
          (content) =>
            content.features.dlr_thumbnail_default === 'true' && content.features.dlr_content_master === 'false'
        );
        if (previousThumbnailContent) {
          await deleteResourceContent(values.identifier, previousThumbnailContent.identifier);
          values.contents = values.contents.filter(
            (content) => content.identifier !== previousThumbnailContent.identifier
          );
        }
        const masterIndex = values.contents.findIndex((content) => content.features.dlr_content_master === 'true');
        if (values.contents[masterIndex]) {
          values.contents[masterIndex].features.dlr_thumbnail_default = 'true';
        }
        pollNewThumbnail(true);
        await new Promise((r) => setTimeout(r, 2000));
      }
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
    const thumbnailIsMasterContent =
      values.contents.findIndex(
        (content) => content.features.dlr_content_master === 'true' && content.features.dlr_thumbnail_default === 'true'
      ) > -1;
    if (thumbnailIsMasterContent) {
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
            onClick={() => {
              setAnchorEl(null);
              setShowPopover(false);
              setShowThumbnailDashboardModal(true);
            }}>
            <ListItemText primary={t('thumbnail.upload_new_thumbnail')} />
          </ListItem>
          <ListItem
            button
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
        locale={{
          strings: {
            dropPaste: `${t('resource.files_and_license.dashboard_component.drag_file')} %{browse}`,
            browse: t('resource.files_and_license.dashboard_component.browse'),
            dropHint: t('resource.files_and_license.drop_single_file_here'),
            uploadXFiles: {
              0: t('resource.files_and_license.dashboard_component.upload_one_file'),
              1: t('resource.files_and_license.dashboard_component.upload_x_files'),
            },
            uploadXNewFiles: {
              0: t('resource.files_and_license.dashboard_component.upload_one_more_file'),
              1: t('resource.files_and_license.dashboard_component.upload_x_more_files'),
            },
            cancel: t('resource.files_and_license.status_bar_component.cancel'),
            complete: t('resource.files_and_license.status_bar_component.complete'),
            dataUploadedOfTotal: t('resource.files_and_license.status_bar_component.dataUploadedOfTotal'),
            done: t('resource.files_and_license.status_bar_component.done'),
            filesUploadedOfTotal: {
              0: t('resource.files_and_license.status_bar_component.0'),
              1: t('resource.files_and_license.status_bar_component.1'),
            },
            pause: t('resource.files_and_license.status_bar_component.pause'),
            paused: t('resource.files_and_license.status_bar_component.paused'),
            resume: t('resource.files_and_license.status_bar_component.resume'),
            retry: t('resource.files_and_license.status_bar_component.retry'),
            uploadFailed: t('resource.files_and_license.status_bar_component.uploadFailed'),
            uploading: t('resource.files_and_license.status_bar_component.uploading'),
            xTimeLeft: t('resource.files_and_license.status_bar_component.xTimeLeft'),
          },
        }}
      />
    </StyledWrapper>
  );
};

export default ChangeThumbnailButton;
