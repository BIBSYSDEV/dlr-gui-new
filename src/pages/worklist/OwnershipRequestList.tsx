import React, { useEffect, useState } from 'react';
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
//TODO: memory leak

const OwnershipRequestList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [workListOwnership, setWorkListOwnership] = useState<WorklistRequest[]>([]);

  useEffect(() => {
    const fetchWorkList = async () => {
      try {
        setIsLoading(true);
        const workListResponse = await getWorkListItemsOwnership();
        const workListTotal = await getWorkListWithResourceAttached(workListResponse.data, true);
        setWorkListOwnership(sortWorkListByDate(workListTotal));
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkList();
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
