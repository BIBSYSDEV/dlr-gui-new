import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Uppy } from '../../../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { CircularProgress, List, ListItem, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { deleteResourceContent, getResourceContentEvent, updateContentTitle } from '../../../api/resourceApi';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import { ResourceWrapper } from '../../../types/resource.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import Thumbnail from '../../../components/Thumbnail';
import { DashboardModal } from '@uppy/react';
import { setContentAsDefaultThumbnail } from '../../../api/fileApi';
import { Content } from '../../../types/content.types';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const StatusBarWrapper = styled.div`
  width: 100%;
`;

const MainFileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const StyledFieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

const MainFileImageWrapper = styled.div`
  margin-top: 1rem;
  margin-right: 2rem;
`;

const MainFileMetadata = styled.div`
  flex-grow: 1;
`;

const StyledAddThumbnailButton = styled(Button)`
  margin-top: 1rem;
`;

interface FileFieldsProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
  thumbnailUppy: Uppy;
  newThumbnailContent: Content | undefined;
  newThumbnailIsReady: () => void;
}

const FileFields: FC<FileFieldsProps> = ({
  uppy,
  setAllChangesSaved,
  thumbnailUppy,
  newThumbnailContent,
  newThumbnailIsReady,
}) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [saveTitleError, setSaveTitleError] = useState(false);
  const [shouldPollNewThumbnail, setShouldPollNewThumbnail] = useState(false);
  const [fileInputIsBusy, setFileInputIsBusy] = useState(false);
  const [showThumbnailDashboardModal, setShowThumbnailDashboardModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [thumbnailUpdateError, setThumbnailUpdateError] = useState(false);

  const saveMainContentsFileName = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAllChangesSaved(false);
    setSaveTitleError(false);
    const contentId = values?.resource?.contents?.[0]?.identifier;
    const resourceId = values?.resource?.identifier;
    if (resourceId && contentId) {
      try {
        await updateContentTitle(resourceId, contentId, event.target.value);
        setAllChangesSaved(true);
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      } catch (err) {
        setSaveTitleError(true);
      }
    }
  };

  const setNewThumbnailAPICallAndFormikChange = async () => {
    try {
      setFileInputIsBusy(true);
      if (newThumbnailContent) {
        let responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
        let thumbnailReady = responseEvents.data.resource_events.find(
          (event) => event.event === 'RESOURCE_THUMBNAIL_UPLOADED'
        );
        let numberOfTries = 0;
        while (!thumbnailReady && numberOfTries < 4) {
          await new Promise((r) => setTimeout(r, 1000));
          responseEvents = await getResourceContentEvent(newThumbnailContent.identifier);
          thumbnailReady = responseEvents.data.resource_events.find(
            (event) => event.event === 'RESOURCE_THUMBNAIL_UPLOADED'
          );
          numberOfTries++;
        }
        await setContentAsDefaultThumbnail(values.resource.identifier, newThumbnailContent.identifier);
        let tobeDeletedIdentifier = '';
        for (let i = 0; i < values.resource.contents.length; i++) {
          if (values.resource.contents[i].identifier === newThumbnailContent.identifier) {
            values.resource.contents[i].features.dlr_thumbnail_default = 'true';
          } else if (
            values.resource.contents[i].identifier !== newThumbnailContent.identifier &&
            values.resource.contents[i].features.dlr_thumbnail_default === 'true' &&
            values.resource.contents[i].features.dlr_content_master === 'false'
          ) {
            tobeDeletedIdentifier = values.resource.contents[i].identifier;
          } else {
            values.resource.contents[i].features.dlr_thumbnail_default = 'false';
          }
        }

        setShouldPollNewThumbnail(true);
        await new Promise((r) => setTimeout(r, 1000));
        setShouldPollNewThumbnail(false);
        setFileInputIsBusy(false);
        if (tobeDeletedIdentifier.length > 0) {
          values.resource.contents = values.resource.contents.filter(
            (content) => content.identifier !== tobeDeletedIdentifier
          );
          await deleteResourceContent(values.resource.identifier, tobeDeletedIdentifier);
        }
      }
      setThumbnailUpdateError(false);
    } catch (error) {
      setThumbnailUpdateError(true);
    } finally {
      newThumbnailIsReady();
    }
  };

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
    if (newThumbnailContent) {
      setNewThumbnailAPICallAndFormikChange();
    }
  }, [newThumbnailContent]);

  const returnToDefaultThumbnail = async () => {
    setFileInputIsBusy(true);
    try {
      const masterContent = values.resource.contents.find((content) => content.features.dlr_content_master === 'true');
      if (masterContent) {
        await setContentAsDefaultThumbnail(values.resource.identifier, masterContent.identifier);
        const previousThumbnailContent = values.resource.contents.find(
          (content) =>
            content.features.dlr_thumbnail_default === 'true' && content.features.dlr_content_master === 'false'
        );
        if (previousThumbnailContent) {
          await deleteResourceContent(values.resource.identifier, previousThumbnailContent.identifier);
          values.resource.contents = values.resource.contents.filter(
            (content) => content.identifier !== previousThumbnailContent.identifier
          );
        }
        const masterIndex = values.resource.contents.findIndex(
          (content) => content.features.dlr_content_master === 'true'
        );
        if (values.resource.contents[masterIndex]) {
          values.resource.contents[masterIndex].features.dlr_thumbnail_default = 'true';
        }
        setShouldPollNewThumbnail(true);
        await new Promise((r) => setTimeout(r, 2000));
      }
      setThumbnailUpdateError(false);
    } catch (error) {
      setThumbnailUpdateError(true);
    } finally {
      setFileInputIsBusy(false);
      setShouldPollNewThumbnail(false);
      newThumbnailIsReady();
    }
  };

  const handleThumbnailClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const thumbnailIsMasterContent =
      values.resource.contents.findIndex(
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
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.main_file')}</Typography>
        <MainFileWrapper>
          <MainFileImageWrapper>
            <Thumbnail
              needsToStartToPoll={shouldPollNewThumbnail}
              resourceIdentifier={values.resource.identifier}
              alt={t('resource.metadata.resource')}
            />
          </MainFileImageWrapper>
          <MainFileMetadata>
            <StyledFieldWrapper>
              {values.resource.contents.findIndex((content) => content.features.dlr_content_master === 'true') > -1 &&
                values.resource.contents[
                  values.resource.contents.findIndex((content) => content.features.dlr_content_master === 'true')
                ].features.dlr_content_type === 'file' && (
                  <Field
                    name={`resource.contents[${values.resource.contents.findIndex(
                      (content) => content.features.dlr_content_master === 'true'
                    )}].features.dlr_content_title`}>
                    {({ field, meta: { touched, error } }: FieldProps) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label={t('resource.metadata.filename')}
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                        onBlur={(event) => {
                          handleBlur(event);
                          !error && saveMainContentsFileName(event);
                        }}
                      />
                    )}
                  </Field>
                )}
            </StyledFieldWrapper>
            {saveTitleError && <ErrorBanner />}
            <Paper>
              <StatusBarWrapper>
                <StatusBarComponent
                  hideCancelButton
                  hidePauseResumeButton
                  locale={{
                    strings: {
                      uploading: t('resource.files_and_license.status_bar_component.uploading'),
                      complete: t('resource.files_and_license.status_bar_component.complete'),
                      uploadFailed: t('resource.files_and_license.status_bar_component.uploadFailed'),
                      paused: t('resource.files_and_license.status_bar_component.paused'),
                      retry: t('resource.files_and_license.status_bar_component.retry'),
                      cancel: t('resource.files_and_license.status_bar_component.cancel'),
                      pause: t('resource.files_and_license.status_bar_component.pause'),
                      resume: t('resource.files_and_license.status_bar_component.resume'),
                      done: t('resource.files_and_license.status_bar_component.done'),
                      filesUploadedOfTotal: {
                        0: t('resource.files_and_license.status_bar_component.filesUploadedOfTotal.0'),
                        1: t('resource.files_and_license.status_bar_component.filesUploadedOfTotal.1'),
                      },
                      dataUploadedOfTotal: t('resource.files_and_license.status_bar_component.dataUploadedOfTotal'),
                      xTimeLeft: t('resource.files_and_license.status_bar_component.xTimeLeft'),
                      uploadXFiles: {
                        0: t('resource.files_and_license.status_bar_component.uploadXFiles.0'),
                        1: t('resource.status_bar_component.uploadXFiles.1'),
                      },
                      uploadXNewFiles: {
                        0: t('resource.files_and_license.status_bar_component.uploadXNewFiles.0'),
                        1: t('resource.files_and_license.status_bar_component.uploadXNewFiles.1'),
                      },
                    },
                  }}
                  uppy={uppy}
                  hideAfterFinish={false}
                />
              </StatusBarWrapper>
            </Paper>
          </MainFileMetadata>
        </MainFileWrapper>
        {fileInputIsBusy && <CircularProgress />}
        {thumbnailUpdateError && <ErrorBanner />}
        <StyledAddThumbnailButton
          variant="outlined"
          color="primary"
          disabled={fileInputIsBusy}
          onClick={(event) => {
            handleThumbnailClick(event);
          }}>
          BYTT MINIATYRBILDE
        </StyledAddThumbnailButton>
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
          <List aria-label="UPLOAD OPTIONS ***MUST BE TRANSLATED***">
            <ListItem
              button
              onClick={() => {
                setAnchorEl(null);
                setShowPopover(false);
                setShowThumbnailDashboardModal(true);
              }}>
              <ListItemText primary="Last opp nytt" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setAnchorEl(null);
                setShowPopover(false);
                returnToDefaultThumbnail();
              }}>
              <ListItemText primary="Slett opplastet og gå tilbake til foreslått miniatyrbilde" />
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
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default FileFields;
