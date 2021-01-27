import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Uppy } from '../../../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Paper, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { updateContentTitle } from '../../../api/resourceApi';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import { ResourceWrapper } from '../../../types/resource.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import Thumbnail from '../../../components/Thumbnail';
import { FileInput } from '@uppy/react';
import { setContentAsDefaultThumbnail } from '../../../api/fileApi';
import { Content } from '../../../types/content.types';
import Button from '@material-ui/core/Button';

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

interface FileFieldsProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
  thumbnailUppy: Uppy;
  newThumbnailContent: Content | undefined;
}

const FileFields: FC<FileFieldsProps> = ({ uppy, setAllChangesSaved, thumbnailUppy, newThumbnailContent }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [saveTitleError, setSaveTitleError] = useState(false);
  const [shouldPollNewThumbnail, setShouldPollNewThumbnail] = useState(false);
  const [fileInputIsBusy, setFileInputIsBusy] = useState(false);

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

  useEffect(() => {
    const setNewThumbnailAPICallAndFormikChange = async () => {
      try {
        setFileInputIsBusy(true);
        if (newThumbnailContent) {
          await setContentAsDefaultThumbnail(values.resource.identifier, newThumbnailContent.identifier);
          values.resource?.contents.forEach((content) => {
            if (content.identifier === newThumbnailContent.identifier) {
              content.features.dlr_thumbnail_default = 'true';
            } else {
              content.features.dlr_thumbnail_default = 'false';
            }
          });
          setShouldPollNewThumbnail(true);
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setShouldPollNewThumbnail(false);
        setFileInputIsBusy(false);
      }
    };

    if (thumbnailUppy) {
      thumbnailUppy.on('complete', () => {
        if (newThumbnailContent) {
          setNewThumbnailAPICallAndFormikChange().then(() => {
            //TODO: reset uppyen.
          });
        }
      });
      thumbnailUppy.on('file-added', () => {
        setFileInputIsBusy(true);
      });
    }
  }, [thumbnailUppy, newThumbnailContent]);

  console.log('values.resource.contents', values.resource.contents);

  return (
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.main_file')}</Typography>
        <Typography>Kjente issues:</Typography>
        <Typography>
          Kan foreløpig bare laste opp ett miniatyrbilde så må man refreshe-sida og begynne på nytt (skal fikses)
        </Typography>
        <Typography>Mangler funksjonalitet for å reverte tilbake til default på selve hovedfil seksjonen</Typography>
        <Typography>Denne utgaven mangler masse design greier og ting flyter rundt</Typography>
        <MainFileWrapper>
          <MainFileImageWrapper>
            <Thumbnail
              needsToStartToPoll={shouldPollNewThumbnail}
              resourceIdentifier={values.resource.identifier}
              alt={t('resource.metadata.resource')}
            />
          </MainFileImageWrapper>
          {!fileInputIsBusy && <FileInput uppy={thumbnailUppy} />}
          {fileInputIsBusy && <Button disabled> wait for previous upload</Button>}
          <MainFileMetadata>
            <StyledFieldWrapper>
              {/*//TODO: First item in contents is not always main content*/}
              <Field name="resource.contents[0].features.dlr_content_title">
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
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default FileFields;
