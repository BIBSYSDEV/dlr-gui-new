import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { emptyResource } from '../../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceContributors,
  getResourceCreators,
  getResourceLicenses,
  getResourceTags,
} from '../../api/resourceApi';
import { Button, CircularProgress } from '@material-ui/core';
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
  align-items: flex;
`;

const StyledContentWrapperLargeWithBottomMargin = styled(StyledContentWrapperLarge)`
  margin-bottom: 2rem;
`;

interface resourcePageParamTypes {
  identifier: string;
}

const ResourcePage = () => {
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState(true);
  const [resourceLoadingError, setResourceLoadingError] = useState<Error | AxiosError>();
  const { t } = useTranslation();
  const history = useHistory();
  const [canEditResource, setCanEditResource] = useState(false);

  const handleClickEditButton = () => {
    history.push(`/editresource/${resource?.identifier}`);
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
        setResourceLoadingError(handlePotentialAxiosError(error));
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (identifier) {
      fetchData(identifier);
    }
  }, [identifier]);

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
