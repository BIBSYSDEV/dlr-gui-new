import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Resource } from '../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceContributors,
  getResourceCreators,
  getResourceLicenses,
  getResourceTags,
} from '../api/resourceApi';
import { CircularProgress } from '@material-ui/core';
import { API_PATHS, API_URL } from '../utils/constants';
import ErrorBanner from '../components/ErrorBanner';
import ResourcePresentation from './ResourcePresentation';

const StyledPageContent = styled.div`
  display: flex;
  justify-items: center;
  margin-top: 2rem;
  align-items: center;
  margin-top: 2rem;
`;

interface resourcePageParamTypes {
  identifier: string;
}

export interface Preview {
  type: string;
  url: string;
}

const emptyPreview: Preview = {
  type: '',
  url: '',
};

const ResourcePage: FC<RouteProps> = (props) => {
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState<Resource>();
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [preview, setPreview] = useState(emptyPreview);
  const [resourceLoadingError, setResourceLoadingError] = useState(false);

  useEffect(() => {
    const fetchData = async (identifier: string) => {
      try {
        setIsLoadingResource(true);
        const tempResource = (await getResource(identifier)).data;
        tempResource.contributors = (await getResourceContributors(identifier)).data;
        tempResource.creators = (await getResourceCreators(identifier)).data;
        tempResource.tags = (await getResourceTags(identifier)).data;
        tempResource.licenses = (await getResourceLicenses(identifier)).data;
        setResource(tempResource);
        const resourceContent = await getResourceContents(identifier);
        const type = resourceContent?.data[0]?.features?.dlr_content_content_type
          ? resourceContent?.data[0]?.features?.dlr_content_content_type
          : '';
        setPreview({
          type,
          url: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${resourceContent?.data[0]?.identifier}/delivery?jwt=${localStorage.token}`,
        });
        setResourceLoadingError(false);
      } catch (error) {
        setResourceLoadingError(true);
      } finally {
        setIsLoadingResource(false);
      }
    };

    if (identifier) {
      fetchData(identifier);
    }
  }, [identifier]);

  return (
    <StyledPageContent>
      {isLoadingResource && <CircularProgress />}
      {resourceLoadingError && <ErrorBanner />}
      {resource && <ResourcePresentation resource={resource} preview={preview} />}
    </StyledPageContent>
  );
};

export default ResourcePage;
