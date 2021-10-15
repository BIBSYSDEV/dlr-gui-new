import React, { FC, useEffect, useRef, useState } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { Resource } from '../../types/resource.types';
import { useTranslation } from 'react-i18next';
import { publicReadAccess, ResourceReadAccessNames } from '../../types/resourceReadAccess.types';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { getPublicResourceReaders } from '../../api/sharingApi';
import { parseCourse } from '../../utils/course.utils';
import ErrorBanner from '../../components/ErrorBanner';
import { generateListWithOxfordComma } from '../../utils/StringArray';

interface ReadAccessProps {
  resource: Resource;
}

const ReadAccess: FC<ReadAccessProps> = ({ resource }) => {
  const [privateAccessList, setPrivateAccessList] = useState<publicReadAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetchingReadAccessList, setErrorFetchingReadAccessList] = useState<Error | AxiosError>();
  const { t } = useTranslation();
  const mountedRef = useRef(true);

  useEffect(() => {
    const getReadAccessList = async () => {
      setErrorFetchingReadAccessList(undefined);
      try {
        const resourceReadAccessListResponse = await getPublicResourceReaders(resource.identifier);
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

  const generatePrivateAccessStringFromAccessResponse = (access: publicReadAccess): string => {
    if (access.name === ResourceReadAccessNames.Institution) {
      return `${t('access.everyone_at').toLowerCase()} ${access.subject.toUpperCase()}`;
    } else if (access.name === ResourceReadAccessNames.Person) {
      if (access.subject === '1') {
        return t('access.email_anonymous_singular').toLowerCase();
      } else {
        return t('access.email_anonymous_plural', { email_count: access.subject }).toLowerCase();
      }
    } else {
      const course = parseCourse(access.subject);
      if (course) {
        return `${t('access.everyone_participating_in').toLowerCase()} ${course.features.code?.toUpperCase()} ${t(
          `access.season.${course.features.season_nr}`
        ).toLowerCase()} ${course.features.year}`;
      } else {
        return '';
      }
    }
  };

  const isInstitutionAccessGranted = () => {
    return privateAccessList.find((access) => access.name === ResourceReadAccessNames.Institution);
  };

  const generatePrivateAccessAllTypes = () => {
    const institution = resource.features.dlr_storage_id ?? t('access.hosting_institution').toLowerCase();
    const specifiedPrivateAccess = privateAccessList.map((access) =>
      generatePrivateAccessStringFromAccessResponse(access)
    );
    if (!isInstitutionAccessGranted()) {
      specifiedPrivateAccess.push(
        t('access.role_at_institution', {
          role: t('administrative.role_header.curators').toLowerCase(),
          institution: institution,
        }),
        t('access.role_at_institution', {
          role: t('administrative.role_header.editors').toLowerCase(),
          institution: institution,
        }),
        t('access.role_at_institution', {
          role: t('administrative.role_header.administrators').toLowerCase(),
          institution: institution,
        })
      );
    }

    return generateListWithOxfordComma(specifiedPrivateAccess, t);
  };

  return (
    <>
      <Typography gutterBottom variant="caption">
        {t('access.read_access')}
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {!errorFetchingReadAccessList ? (
            <>
              {resource.features.dlr_access === 'open' ? (
                <>
                  <Typography>{t('access.public_available_read_access')}.</Typography>
                </>
              ) : (
                <>
                  <Typography>
                    <b>{t('access.restrictive_read_access')}. </b>
                    {t('access.following_have_read_access')}:
                  </Typography>
                  <Typography>{generatePrivateAccessAllTypes()}</Typography>
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
