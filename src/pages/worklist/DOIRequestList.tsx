import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getWorkListItemDOI } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';
import { WorklistDOIRequest } from '../../types/Worklist.types';
import DOIRequestItem from './DOIRequestItem';
import { getResource } from '../../api/resourceApi';
import { Resource } from '../../types/resource.types';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';

const StyledUl = styled.ul`
  list-style: none; /* Remove list bullets */
  padding: 0;
  margin: 0;
`;

const DOIRequestList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [workListDoi, setWorkListDoi] = useState<WorklistDOIRequest[]>([]);

  useEffect(() => {
    const fetchWorkLisDoi = async () => {
      try {
        setIsLoading(true);
        setLoadingError(undefined);
        const workListDoiResponse = await getWorkListItemDOI();
        const resourcePromises: Promise<AxiosResponse<Resource>>[] = [];
        workListDoiResponse.data.forEach((work) => {
          resourcePromises.push(getResource(work.resourceIdentifier));
        });
        const resources = await Promise.all(resourcePromises);
        const newWorkList = workListDoiResponse.data.map((work, index) => {
          if (resources[index].data.identifier === work.resourceIdentifier) {
            work.resource = resources[index].data;
          } else {
            const correspondingResource = resources.find((resource) => resource.data.identifier === work.identifier);
            work.resource = correspondingResource?.data;
          }
          return work;
        });
        setWorkListDoi(newWorkList);
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkLisDoi();
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
