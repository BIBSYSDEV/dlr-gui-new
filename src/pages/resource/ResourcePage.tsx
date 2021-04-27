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
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { StyleWidths } from '../../themes/mainTheme';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';

const StyledResourceActionBar = styled.div`
  display: flex;
  width: 100%;
  max-width: ${StyleWidths.width4};
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 2rem;
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
  const [resourceLoadingError, setResourceLoadingError] = useState<Error>();
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
        setResourceLoadingError(undefined);
        const tempResource = (await getResource(identifier)).data;
        tempResource.contributors = (await getResourceContributors(identifier)).data;
        tempResource.creators = (await getResourceCreators(identifier)).data;
        tempResource.tags = (await getResourceTags(identifier)).data;
        tempResource.licenses = (await getResourceLicenses(identifier)).data;
        setResource(tempResource);
        tempResource.contents = await getResourceContents(identifier);
      } catch (error) {
        setResourceLoadingError(error);
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
    <ErrorBanner error={resourceLoadingError} />
  ) : (
    <StyledContentWrapperLargeWithBottomMargin>
      {isUnpublished() && isAuthor() && (
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
      <PageHeader testId="resource-title">{resource.features.dlr_title}</PageHeader>
      <ResourcePresentation resource={resource} />
    </StyledContentWrapperLargeWithBottomMargin>
  );
};

export default ResourcePage;
