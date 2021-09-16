import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Uppy } from '../../../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Paper, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { updateContentTitle, updateSearchIndex } from '../../../api/resourceApi';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors, DeviceWidths } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import { ContentFeatureNames, FieldNames, Resource } from '../../../types/resource.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import Thumbnail from '../../../components/Thumbnail';
import { Content } from '../../../types/content.types';
import ChangeThumbnailButton from '../../../components/ChangeThumbnailButton';
import { uppyLocale } from '../../../utils/uppy-config';
import HelperTextPopover from '../../../components/HelperTextPopover';
import { StylePopoverTypography } from '../../../components/styled/StyledTypographies';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StatusBarWrapper = styled.div`
  width: 100%;
`;

const MainFileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const FileTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
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

const StyledSpacer = styled.div`
  padding-left: 1rem;
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
  const [saveTitleError, setSaveTitleError] = useState<Error | AxiosError>();
  const [shouldPollNewThumbnail, setShouldPollNewThumbnail] = useState(false);
  const { institution } = useSelector((state: RootState) => state.user);
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  const saveMainContentsFileName = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAllChangesSaved(false);
    setSaveTitleError(undefined);
    const contentId = values?.contents?.masterContent.identifier;
    const resourceId = values?.identifier;
    if (resourceId && contentId) {
      try {
        await updateContentTitle(resourceId, contentId, event.target.value);
        setAllChangesSaved(true);
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
        values.features.dlr_status_published && updateSearchIndex(values.identifier);
      } catch (error) {
        setSaveTitleError(handlePotentialAxiosError(error));
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.DLRColdGreen1}>
      <StyledContentWrapper>
        <Typography variant="h3" component={mediumOrLargerScreen ? 'h2' : 'h3'}>
          {t('resource.metadata.main_file')}
        </Typography>
        <MainFileWrapper>
          <MainFileImageWrapper>
            <Thumbnail
              institution={values.features.dlr_storage_id ?? institution}
              needsToStartToPoll={shouldPollNewThumbnail}
              resourceOrContentIdentifier={values.identifier}
              alt={t('resource.metadata.resource')}
            />
          </MainFileImageWrapper>

          <MainFileMetadata>
            <StyledFieldWrapper>
              {values.contents.masterContent.features.dlr_content_type === 'file' && (
                <FileTitleWrapper>
                  <Field
                    name={`${FieldNames.ContentsBase}.${FieldNames.MasterContent}.${FieldNames.Features}.${ContentFeatureNames.Title}`}>
                    {/*Important! No linebreak in name*/}
                    {({ field, meta: { touched, error } }: FieldProps) => (
                      <TextField
                        {...field}
                        id="filename"
                        variant="filled"
                        required
                        fullWidth
                        inputProps={{ 'data-testid': 'master-content-title' }}
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
                  <StyledSpacer>
                    <HelperTextPopover
                      ariaButtonLabel={t('explanation_text.file_title_helper_aria_label')}
                      popoverId={'file_title_field_popover'}>
                      <StylePopoverTypography variant="body1">
                        {t('explanation_text.file_title_helper_text')}.
                      </StylePopoverTypography>
                      <StylePopoverTypography variant="body2">
                        {t('explanation_text.file_title_helper_example1')}.
                      </StylePopoverTypography>
                      <Typography variant="body2">{t('explanation_text.file_title_helper_example2')}.</Typography>
                    </HelperTextPopover>
                  </StyledSpacer>
                </FileTitleWrapper>
              )}
            </StyledFieldWrapper>
            {saveTitleError && <ErrorBanner userNeedsToBeLoggedIn={true} error={saveTitleError} />}
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
