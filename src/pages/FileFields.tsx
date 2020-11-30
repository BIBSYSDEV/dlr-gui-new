import React, { Dispatch, FC, SetStateAction } from 'react';
import { Uppy } from '../types/file.types';
import StatusBarComponent from '@uppy/react/src/StatusBar';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Paper, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import placeholderImage from '../resources/images/placeholder.png';
import { ErrorMessage, Field, FieldProps, FormikProps, FormikValues } from 'formik';
import { updateContentTitle } from '../api/resourceApi';

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
  formikProps: FormikProps<FormikValues>;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
}

const FileFields: FC<FileFieldsProps> = ({ uppy, formikProps, setAllChangesSaved }) => {
  const { t } = useTranslation();

  const saveMainContentsFileName = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resetForm: any,
    currentValues: any
  ) => {
    setAllChangesSaved(false);
    const contentId = currentValues?.resource?.contents?.[0]?.identifier;
    const resourceId = currentValues?.resource?.identifier;
    if (resourceId && contentId) {
      await updateContentTitle(resourceId, contentId, event.target.value);
      setAllChangesSaved(true);
      resetForm({ values: currentValues });
    }
  };

  return (
    <>
      <Typography variant="h5">{t('resource.metadata.main_file')}</Typography>
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
                  variant="filled"
                  fullWidth
                  label={t('resource.metadata.filename')}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  onBlur={(event) => {
                    formikProps.handleBlur(event);
                    !error && saveMainContentsFileName(event, formikProps.resetForm, formikProps.values);
                  }}
                />
              )}
            </Field>
          </StyledFieldWrapper>
          <Paper>
            <StatusBarWrapper>
              <StatusBarComponent uppy={uppy} hideAfterFinish={false} />
            </StatusBarWrapper>
          </Paper>
        </MainFileMetadata>
      </MainFileWrapper>
    </>
  );
};

export default FileFields;
