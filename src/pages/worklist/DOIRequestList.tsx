import React, { FC } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ErrorBanner from '../../components/ErrorBanner';
import { WorklistRequest } from '../../types/Worklist.types';
import DOIRequestItem from './DOIRequestItem';
import styled from 'styled-components';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

interface DOIRequestListProps {
  isLoading: boolean;
  loadingError: Error | undefined;
  workListDOI: WorklistRequest[];
  setWorkListDoi: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const DOIRequestList: FC<DOIRequestListProps> = ({ isLoading, loadingError, workListDOI, setWorkListDoi }) => {
  const { t } = useTranslation();

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
          {workListDOI.length > 0 ? (
            <StyledUl>
              {workListDOI.map((work) => (
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
