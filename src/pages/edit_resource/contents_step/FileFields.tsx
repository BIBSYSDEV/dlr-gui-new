import React, { Dispatch, FC, SetStateAction, useState } from 'react';
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
import { ContentFeatureNames, FieldNames, Resource } from '../../../types/resource.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import Thumbnail from '../../../components/Thumbnail';
import { Content } from '../../../types/content.types';
import ChangeThumbnailButton from '../../../components/ChangeThumbnailButton';
import { uppyLocale } from '../../../utils/uppy-config';

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
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [saveTitleError, setSaveTitleError] = useState(false);
  const [shouldPollNewThumbnail, setShouldPollNewThumbnail] = useState(false);

  const saveMainContentsFileName = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAllChangesSaved(false);
    setSaveTitleError(false);
    const contentId = values?.contents?.masterContent.identifier;
    const resourceId = values?.identifier;
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

  return (
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.main_file')}</Typography>
        <MainFileWrapper>
          <MainFileImageWrapper>
            <Thumbnail
              needsToStartToPoll={shouldPollNewThumbnail}
              resourceOrContentIdentifier={values.identifier}
              alt={t('resource.metadata.resource')}
            />
          </MainFileImageWrapper>
          <MainFileMetadata>
            <StyledFieldWrapper>
              {values.contents.masterContent && values.contents.masterContent.features.dlr_content_type === 'file' && (
                <Field
                  name={`${FieldNames.ContentsBase}.${FieldNames.MasterContent}.${FieldNames.Features}.${ContentFeatureNames.Title}`}>
                  {({ field, meta: { touched, error } }: FieldProps) => (
                    <TextField
                      {...field}
                      variant="filled"
                      fullWidth
                      label={t('resource.metadata.file_title')}
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
            {saveTitleError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
            <Paper>
              <StatusBarWrapper>
                <StatusBarComponent
                  hideCancelButton
                  hidePauseResumeButton
                  locale={uppyLocale(t)}
                  uppy={uppy}
                  hideAfterFinish={false}
                />
              </StatusBarWrapper>
            </Paper>
          </MainFileMetadata>
        </MainFileWrapper>
        <ChangeThumbnailButton
          thumbnailUppy={thumbnailUppy}
          newThumbnailContent={newThumbnailContent}
          newThumbnailIsReady={newThumbnailIsReady}
          pollNewThumbnail={(status) => setShouldPollNewThumbnail(status)}
        />
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default FileFields;
