import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Uppy } from '../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Paper, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../resources/images/placeholder.png';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { updateContentTitle } from '../api/resourceApi';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import ErrorBanner from '../components/ErrorBanner';
import { ResourceWrapper } from '../types/resource.types';
import { resetFormButKeepTouched } from '../utils/formik-helpers';

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
  max-height: 200px;
  max-width: 200px;
`;

const MainFileMetadata = styled.div`
  flex-grow: 1;
`;

interface FileFieldsProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
}

const FileFields: FC<FileFieldsProps> = ({ uppy, setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [saveTitleError, setSaveTitleError] = useState(false);

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

  return (
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h4">{t('resource.metadata.main_file')}</Typography>
        <MainFileWrapper>
          <MainFileImageWrapper>
            <img alt="resource" src={placeholderImage} />
          </MainFileImageWrapper>
          <MainFileMetadata>
            <StyledFieldWrapper>
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
                <StatusBarComponent uppy={uppy} hideAfterFinish={false} />
              </StatusBarWrapper>
            </Paper>
          </MainFileMetadata>
        </MainFileWrapper>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default FileFields;
