import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Uppy } from '../types/file.types';
import { uppyLocale } from '../utils/uppy-config';

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
        locale={uppyLocale(t)}
      />
    </StyledDashboard>
  ) : null;
};

export default UppyDashboard;
