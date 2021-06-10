import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkListReports } from '../../api/workListApi';
import { AxiosResponse } from 'axios';
import { Resource } from '../../types/resource.types';
import { getResource } from '../../api/resourceApi';
import { CircularProgress, Typography } from '@material-ui/core';
import styled from 'styled-components';
import ErrorBanner from '../../components/ErrorBanner';
import ReportRequestListItem from './ReportRequestListItem';
import { WorklistRequest } from '../../types/Worklist.types';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

//TODO: cypress tests, DOI must also be updated and verified
//TODO: ReportRequestListItem needs delete resource functionality
//TODO: ReportRequestListItem needs delete request functionality
//TODO: Icons on DOI request must match report request.
//TODO: Utils function for fetching and adding resource to workList object
//TODO: mockData and mockInterceptor must be updated for new report requests

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
        const resourcePromises: Promise<AxiosResponse<Resource>>[] = [];
        workListReportResponse.data.forEach((work) => {
          resourcePromises.push(getResource(work.resourceIdentifier));
        });
        const resources = await Promise.all(resourcePromises);
        const newWorkList = workListReportResponse.data.map((work, index) => {
          if (resources[index].data.identifier === work.resourceIdentifier) {
            work.resource = resources[index].data;
          } else {
            const correspondingResource = resources.find((resource) => resource.data.identifier === work.identifier);
            work.resource = correspondingResource?.data;
          }
          return work;
        });

        setWorkListReport(newWorkList);
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
          {workListReport.length > 0 ? (
            <>
              {workListReport.map((work) => (
                <StyledUl>
                  <ReportRequestListItem reportWorkListRequest={work} setWorkListReport={setWorkListReport} />
                </StyledUl>
              ))}
            </>
          ) : (
            <Typography>{t('work_list.no_doi_requests')}</Typography>
          )}
        </>
      )}
    </>
  );
};

export default ReportList;
