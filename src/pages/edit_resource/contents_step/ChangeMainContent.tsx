import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import styled from 'styled-components';
import { Content } from '../../../types/content.types';
import { DashboardModal, useUppy } from '@uppy/react';
import { createMainFileChangerUppy, uppyLocale } from '../../../utils/uppy-config';
import { Resource } from '../../../types/resource.types';
import {
  setContentAsDefaultThumbnail,
  setContentAsDefaultContent,
  setContentAsMasterContent,
} from '../../../api/fileApi';
import { useFormikContext } from 'formik';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { useTranslation } from 'react-i18next';
import ErrorBanner from '../../../components/ErrorBanner';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';

const ChangeMainFileWrapper = styled.div`
  margin-top: 1rem;
`;

const ChangeMainContent = () => {
  const [showMainFileUppyModal, setShowMainFileUppyModal] = useState(false);
  const { t } = useTranslation();
  const { values, resetForm, touched, setTouched } = useFormikContext<Resource>();
  const [newContent, setNewContent] = useState<Content | undefined>();
  const mainFileChangeUppy = useUppy(createMainFileChangerUppy(values.identifier, setNewContent));
  const [uploadError, setUploadError] = useState<Error | undefined>();
  const [showDoiMessage, setShowDoiMessage] = useState(false);

  useEffect(() => {
    mainFileChangeUppy.on('complete', () => {
      const changeDefaultContent = async () => {
        if (newContent) {
          try {
            newContent.features.dlr_content_title = newContent.features.dlr_content;
            await setContentAsDefaultContent(values.identifier, newContent.identifier);
            const oldMasterContent = values.contents.masterContent;
            newContent.features.dlr_content_default = 'true';
            oldMasterContent.features.dlr_content_default = 'false';
            await setContentAsMasterContent(values.identifier, newContent.identifier);
            newContent.features.dlr_content_master = 'true';
            oldMasterContent.features.dlr_content_master = 'false';

            if (oldMasterContent.features.dlr_thumbnail_default === 'true') {
              await setContentAsDefaultThumbnail(values.identifier, newContent.identifier);
              oldMasterContent.features.dlr_thumbnail_default = 'false';
              newContent.features.dlr_thumbnail_default = 'true';
            }
            values.contents.additionalContent = [...values.contents.additionalContent, oldMasterContent];
            values.contents.masterContent = newContent;
            resetFormButKeepTouched(touched, resetForm, values, setTouched);
          } catch (e) {
            setUploadError(handlePotentialAxiosError(e));
          }
        }
      };
      changeDefaultContent().then();
    });
  }, [newContent, mainFileChangeUppy, resetForm, setTouched, touched, values]);

  const handleChangeMainFileButtonClick = () => {
    if (values.features.dlr_identifier_doi) {
      setShowDoiMessage(true);
    } else {
      setShowMainFileUppyModal(true);
    }
  };

  return (
    <ChangeMainFileWrapper data-testid={`main-file-change-uppy-dashboard`}>
      <Button
        data-testid="change-main-file-button"
        variant="outlined"
        onClick={() => handleChangeMainFileButtonClick()}>
        {t('resource.change_main_file.change_main_file')}
      </Button>
      {showDoiMessage && (
        <ErrorBanner
          customErrorMessage={t('resource.change_main_file.cannot_change_main_file_because_the_resource_has_DOI')}
        />
      )}
      {uploadError && (
        <ErrorBanner
          error={uploadError}
          customErrorMessage={t('resource.change_main_file.could_not_change_main_file_error_message')}
        />
      )}
      <DashboardModal
        hideRetryButton
        hidePauseResumeButton
        closeAfterFinish={true}
        proudlyDisplayPoweredByUppy={false}
        closeModalOnClickOutside
        open={showMainFileUppyModal}
        onRequestClose={() => {
          setShowMainFileUppyModal(false);
        }}
        uppy={mainFileChangeUppy}
        locale={uppyLocale(t)}
      />
    </ChangeMainFileWrapper>
  );
};

export default ChangeMainContent;
