import React, { FC, useEffect, useRef, useState } from 'react';
import { Chip, CircularProgress, Typography } from '@material-ui/core';
import { Resource } from '../../types/resource.types';
import { useTranslation } from 'react-i18next';
import { ResourceReadAccess, ResourceReadAccessNames } from '../../types/resourceReadAccess.types';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { getResourceReaders } from '../../api/sharingApi';
import { parseCourse } from '../../utils/course.utils';
import ErrorBanner from '../../components/ErrorBanner';
import styled from 'styled-components';

const StyledChip = styled(Chip)`
  && {
    margin-top: 1rem;
    margin-right: 0.5rem;
  }
`;

interface ReadAccessProps {
  resource: Resource;
}

const ReadAccess: FC<ReadAccessProps> = ({ resource }) => {
  const [privateAccessList, setPrivateAccessList] = useState<ResourceReadAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetchingReadAccessList, setErrorFetchingReadAccessList] = useState<Error | AxiosError>();
  const { t } = useTranslation();
  const mountedRef = useRef(true);

  useEffect(() => {
    const getReadAccessList = async () => {
      setErrorFetchingReadAccessList(undefined);
      try {
        const resourceReadAccessListResponse = await getResourceReaders(resource.identifier);
        if (!mountedRef.current) return null;
        setPrivateAccessList(resourceReadAccessListResponse.data);
      } catch (error) {
        setErrorFetchingReadAccessList(handlePotentialAxiosError(error));
      } finally {
        setIsLoading(false);
      }
    };
    if (resource.features.dlr_access !== 'open') {
      getReadAccessList();
    } else {
      setIsLoading(false);
    }
  }, [resource]);

  const generatePrivateAccessString = (access: ResourceReadAccess): string => {
    if (access.profiles[0].name === ResourceReadAccessNames.Institution) {
      return `${t('access.everyone_at')} ${access.subject.toUpperCase()}`;
    } else {
      const course = parseCourse(access.subject);
      if (course) {
        return `${t(
          'access.everyone_participating_in'
        )} ${course.features.code?.toUpperCase()} - ${course.features.institution?.toUpperCase()} - ${
          course.features.year
        } - ${t(`access.season.${course.features.season_nr}`)}`;
      } else {
        return '';
      }
    }
  };

  return (
    <>
      <Typography variant="h2">Lesetilgang</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {!errorFetchingReadAccessList ? (
            <>
              {resource.features.dlr_access === 'open' ? (
                <StyledChip label={'Denne ressursen er åpent tilgjengelig'} />
              ) : (
                <>
                  {privateAccessList.map((access, index) => (
                    <StyledChip key={index} label={generatePrivateAccessString(access)} />
                  ))}
                  <StyledChip label={'redaktører, kuratorer og administratorer hos Unit'} />
                  <StyledChip label={'5 personer med epost tilgang'} />
                </>
              )}
            </>
          ) : (
            <ErrorBanner error={errorFetchingReadAccessList} />
          )}
        </>
      )}
    </>
  );
};

export default ReadAccess;
