import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import ErrorBanner from '../../components/ErrorBanner';
import { WorklistRequest } from '../../types/Worklist.types';
import { getWorkListItemsOwnership } from '../../api/workListApi';
import { getWorkListWithResourceAttached, sortWorkListByDate } from '../../utils/workList';
import styled from 'styled-components';
import OwnershipRequestListItem from './OwnershipRequestListItem';
import { useTranslation } from 'react-i18next';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

//TODO: cypress tests
//TODO: work list utils function
//TODO: refactoring

const OwnershipRequestList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [workListOwnership, setWorkListOwnership] = useState<WorklistRequest[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoading(true);
        const workListResponse = await getWorkListItemsOwnership();
        const workListTotal = await getWorkListWithResourceAttached(workListResponse.data, true);
        if (!mountedRef.current) return null;
        setWorkListOwnership(sortWorkListByDate(workListTotal));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingError(error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    if (mountedRef.current) {
      fetchWorkList();
    }
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('work_list.ownership_requests')}
      </Typography>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {workListOwnership.length > 0 ? (
            <StyledUl>
              {workListOwnership.map((work) => (
                <OwnershipRequestListItem
                  setWorkListOwnership={setWorkListOwnership}
                  key={work.identifier}
                  workListRequestOwnership={work}
                />
              ))}
            </StyledUl>
          ) : (
            <Typography>{t('work_list.no_ownership_requests')} </Typography>
          )}
        </>
      )}
    </>
  );
};

export default OwnershipRequestList;
