import React, { FC } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import ErrorBanner from '../../components/ErrorBanner';
import { WorklistRequest } from '../../types/Worklist.types';
import styled from 'styled-components';
import OwnershipRequestListItem from './OwnershipRequestListItem';
import { useTranslation } from 'react-i18next';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

interface OwnershipRequestListProps {
  isLoading: boolean;
  loadingError: Error | undefined;
  workListOwnership: WorklistRequest[];
  setWorkListOwnership: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const OwnershipRequestList: FC<OwnershipRequestListProps> = ({
  isLoading,
  loadingError,
  workListOwnership,
  setWorkListOwnership,
}) => {
  const { t } = useTranslation();

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
