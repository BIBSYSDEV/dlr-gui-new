import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Uppy } from '../types/file.types';

const StyledDashboard = styled.div`
  overflow: auto;
`;

interface UppyDashboardProps {
  uppy: Uppy;
  hideCancelButton?: boolean;
}

const uploaderMaxWidthPx = 10000;
const uploaderMaxHeightPx = 200;

const UppyDashboard: React.FC<UppyDashboardProps> = ({ uppy, hideCancelButton = true }) => {
  const { t } = useTranslation();
  const multipleFilesAllowed = (uppy as any).opts.restrictions.maxNumberOfFiles !== 1;

  return uppy ? (
    <StyledDashboard>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        showSelectedFiles={false}
        showProgressDetails
        hideProgressAfterFinish
        hideCancelButton={hideCancelButton}
        hidePauseResumeButton
        width={uploaderMaxWidthPx}
        height={uploaderMaxHeightPx}
        locale={{
          strings: {
            dropPaste: multipleFilesAllowed
              ? `${t('resource.files_and_license.dashboard_component.drag_files')} %{browse}`
              : `${t('resource.files_and_license.dashboard_component.drag_file')} %{browse}`,
            browse: t('resource.files_and_license.dashboard_component.browse'),
            dropHint: multipleFilesAllowed
              ? t('resource.files_and_license.dashboard_component.drop_here')
              : t('resource.files_and_license.drop_single_file_here'),
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
    </StyledDashboard>
  ) : null;
};

export default UppyDashboard;
