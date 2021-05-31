import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getWorkListItemDOI } from '../../api/workListApi';
import ErrorBanner from '../../components/ErrorBanner';

const DOIRequestList = () => {
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error>();
  const [worklistDoi, setWorklistDoi] = useState<any>([]);

  useEffect(() => {
    const fetchWorklisDoi = async () => {
      try {
        setIsloading(true);
        setLoadingError(undefined);
        const worklistDoiResponse = await getWorkListItemDOI();
        setWorklistDoi(worklistDoiResponse.data);
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsloading(false);
      }
    };
    fetchWorklisDoi();
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
          {JSON.stringify(worklistDoi)}
        </>
      )}
    </>
  );
};

export default DOIRequestList;
