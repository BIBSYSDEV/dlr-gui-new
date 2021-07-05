import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkListReports } from '../../api/workListApi';
import { CircularProgress, Typography } from '@material-ui/core';
import styled from 'styled-components';
import ErrorBanner from '../../components/ErrorBanner';
import ReportRequestListItem from './ReportRequestListItem';
import { WorklistRequest } from '../../types/Worklist.types';
import { getWorkListWithResourceAttached, sortWorkListByDate } from '../../utils/workList';

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
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoading(true);
        setLoadingError(undefined);
        const workListReportResponse = await getWorkListReports();
        const workListTotal = await getWorkListWithResourceAttached(workListReportResponse.data);
        if (!mountedRef.current) return null;
        setWorkListReport(sortWorkListByDate(workListTotal));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingError(error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    fetchWorkReport();
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
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
