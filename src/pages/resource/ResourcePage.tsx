import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { emptyResource, Resource } from '../../types/resource.types';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { StyleWidths } from '../../themes/mainTheme';

const StyledPageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  margin-top: 2rem;
  align-items: center;
  width: 100%;
`;

const StyledResourceActionBar = styled.div`
  display: flex;
  width: 100%;
  max-width: ${StyleWidths.width4};
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 2rem;
`;

interface resourcePageParamTypes {
  identifier: string;
}

const ResourcePage = () => {
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState(emptyResource);
  const [isLoadingResource, setIsLoadingResource] = useState(true);
  const [resourceLoadingError, setResourceLoadingError] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  const handleClickEditButton = () => {
    history.push(`/editresource/${resource?.identifier}`);
  };

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
        tempResource.contents = (await getResourceContents(identifier)).data;
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

  const isAuthor = () => resource.features.dlr_submitter_email === user.email;
  const isUnpublished = () => !resource.features.dlr_status_published;

  return isLoadingResource ? (
    <CircularProgress />
  ) : resourceLoadingError ? (
    <ErrorBanner />
  ) : (
    <StyledPageContent>
      {isUnpublished && isAuthor && (
        <StyledResourceActionBar>
          <Button
            size="large"
            variant="outlined"
            color="primary"
            data-testid={`edit-resource-button`}
            onClick={handleClickEditButton}>
            {t('common.edit').toUpperCase()}
          </Button>
        </StyledResourceActionBar>
      )}
      <ResourcePresentation resource={resource} />
    </StyledPageContent>
  );
};

export default ResourcePage;
