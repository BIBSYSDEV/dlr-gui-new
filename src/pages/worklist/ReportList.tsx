import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@mui/material';
import styled from 'styled-components';
import ErrorBanner from '../../components/ErrorBanner';
import ReportRequestListItem from './ReportRequestListItem';
import { WorklistRequest } from '../../types/Worklist.types';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

interface ReportListProps {
  isLoading: boolean;
  loadingError: Error | undefined;
  workListReport: WorklistRequest[];
  setWorkListReport: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const ReportList: FC<ReportListProps> = ({ isLoading, loadingError, workListReport, setWorkListReport }) => {
  const { t } = useTranslation();

  return (
    <>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography gutterBottom variant="h2">
            {t('work_list.reports')}
          </Typography>
          {workListReport.length > 0 ? (
            <StyledUl>
              {workListReport.map((work) => (
                <ReportRequestListItem
                  key={work.identifier}
                  reportWorkListRequest={work}
                  setWorkListReport={setWorkListReport}
                />
              ))}
            </StyledUl>
          ) : (
            <Typography>{t('work_list.no_report_requests')}</Typography>
          )}
        </>
      )}
    </>
  );
};

export default ReportList;
