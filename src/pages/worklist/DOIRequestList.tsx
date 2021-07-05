import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getWorkListItemDOI } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import { WorklistRequest } from '../../types/Worklist.types';
import DOIRequestItem from './DOIRequestItem';
import styled from 'styled-components';
import { getWorkListWithResourceAttached, sortWorkListByDate } from '../../utils/workList';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

const DOIRequestList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [workListDoi, setWorkListDoi] = useState<WorklistRequest[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchWorkListDOI = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoading(true);
        setLoadingError(undefined);
        const workListDoiResponse = await getWorkListItemDOI();
        const workListTotal = await getWorkListWithResourceAttached(workListDoiResponse.data);
        if (!mountedRef.current) return null;
        setWorkListDoi(sortWorkListByDate(workListTotal));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingError(error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    fetchWorkListDOI();
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
            {t('work_list.doi_request_list')}
          </Typography>
          {workListDoi.length > 0 ? (
            <StyledUl>
              {workListDoi.map((work) => (
                <DOIRequestItem setWorkListDoi={setWorkListDoi} key={work.identifier} workListRequestDOI={work} />
              ))}
            </StyledUl>
          ) : (
            <Typography>{t('work_list.no_doi_requests')}</Typography>
          )}
        </>
      )}
    </>
  );
};

export default DOIRequestList;
