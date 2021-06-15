import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkListReports } from '../../api/workListApi';
import { CircularProgress, Typography } from '@material-ui/core';
import styled from 'styled-components';
import ErrorBanner from '../../components/ErrorBanner';
import ReportRequestListItem from './ReportRequestListItem';
import { WorklistRequest } from '../../types/Worklist.types';
import { getWorkListWithResourceAttached } from '../../utils/workList';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

const ReportList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [workListReport, setWorkListReport] = useState<WorklistRequest[]>([]);

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        setIsLoading(true);
        setLoadingError(undefined);
        const workListReportResponse = await getWorkListReports();
        const workListTotal = await getWorkListWithResourceAttached(workListReportResponse.data);
        setWorkListReport(workListTotal);
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkReport();
  }, []);

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
