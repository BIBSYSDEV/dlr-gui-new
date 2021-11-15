import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceContributors,
  getResourceCreators,
  getResourceLicenses,
  getResourceTags,
} from '../../api/resourceApi';
import { Button, CircularProgress } from '@mui/material';
import ErrorBanner from '../../components/ErrorBanner';
import ResourcePresentation from './ResourcePresentation';
import { useTranslation } from 'react-i18next';
import { StyledContentWrapperLarge, StyledProgressWrapper } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import CreatorSearch from './CreatorSearch';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledResourceActionBar = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledContentWrapperLargeWithBottomMargin = styled(StyledContentWrapperLarge)`
  margin-bottom: 2rem;
`;

const ResourcePage = () => {
  const { identifier } = useParams();
  const [resource, setResource] = useState(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState(true);
  const [resourceLoadingError, setResourceLoadingError] = useState<Error | AxiosError>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [canEditResource, setCanEditResource] = useState(false);

  const handleClickEditButton = () => {
    navigate(`/editresource/${resource?.identifier}`);
  };

  useEffect(() => {
    const fetchData = async (identifier: string) => {
      try {
        setIsLoadingResource(true);
        setResourceLoadingError(undefined);
        const tempResource = (await getResource(identifier)).data;
        tempResource.contributors = (await getResourceContributors(identifier)).data;
        tempResource.creators = (await getResourceCreators(identifier)).data;
        tempResource.tags = (await getResourceTags(identifier)).data;
        tempResource.licenses = (await getResourceLicenses(identifier)).data;
        setResource(tempResource);
        tempResource.contents = await getResourceContents(identifier);
      } catch (error) {
        const potentialAxiosError = handlePotentialAxiosError(error);
        if ((potentialAxiosError as AxiosError).response) {
          const axiosError = potentialAxiosError as AxiosError;
          if (axiosError.response && (axiosError.response.status === 404 || axiosError.response.status === 503)) {
            navigate(`/resourcenotfound/${identifier}`);
          }
        } else {
          setResourceLoadingError(potentialAxiosError);
        }
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (identifier) {
      fetchData(identifier).then();
    }
  }, [navigate, identifier]);

  return isLoadingResource ? (
    <StyledProgressWrapper>
      <CircularProgress />
    </StyledProgressWrapper>
  ) : resourceLoadingError ? (
    <ErrorBanner error={resourceLoadingError} />
  ) : (
    <StyledContentWrapperLargeWithBottomMargin>
      <PageHeader testId="resource-title">{resource.features.dlr_title}</PageHeader>
      {canEditResource && (
        <StyledResourceActionBar>
          <Button
            size="large"
            variant="outlined"
            color="primary"
            data-testid={`edit-resource-button`}
            onClick={handleClickEditButton}>
            {t('common.edit')}
          </Button>
        </StyledResourceActionBar>
      )}
      <ResourcePresentation setCanEditResource={setCanEditResource} resource={resource} isPreview={false} />
      <CreatorSearch resource={resource} />
    </StyledContentWrapperLargeWithBottomMargin>
  );
};

export default ResourcePage;
