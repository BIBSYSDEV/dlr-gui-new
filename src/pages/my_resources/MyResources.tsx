import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyResources } from '../../api/resourceApi';
import { CircularProgress, List, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import ResourceListItem from '../../components/ResourceListItem';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';

const StyledListWrapper = styled.div`
  margin-top: 40px;
`;

const ListMarginAlign = styled.div`
  display: block;
  align-items: start;
`;

const MyResources = () => {
  const { t } = useTranslation();
  const [isLoadingMyResources, setIsLoadingMyResources] = useState(false);
  const [resourcesUnpublished, setMyUnpublishedResources] = useState<Resource[]>([]);
  const [resourcesPublished, setMyPublishedResources] = useState<Resource[]>([]);
  const [loadingError, setLoadingError] = useState(false);
  const { institution } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMyResources(true);
        const response = await getMyResources();
        setMyUnpublishedResources(response.data.filter((resource) => !resource.features.dlr_status_published));
        setMyPublishedResources(response.data.filter((resource) => resource.features.dlr_status_published));
        setLoadingError(false);
        setIsLoadingMyResources(false);
      } catch (error) {
        setLoadingError(true);
      } finally {
        setIsLoadingMyResources(false);
      }
    };
    fetchData();
  }, []);

  const deleteResource = (resourceIdentifier: string, isPublished: boolean) => {
    if (isPublished) {
      setMyPublishedResources((prevState) =>
        prevState.filter((resource) => resource.identifier !== resourceIdentifier)
      );
    } else {
      setMyUnpublishedResources((prevState) =>
        prevState.filter((resource) => resource.identifier !== resourceIdentifier)
      );
    }
  };

  return (
    <StyledContentWrapperLarge>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      {isLoadingMyResources && <CircularProgress />}
      <ListMarginAlign>
        <PageHeader>{t('resource.my_resources')}</PageHeader>
        <StyledListWrapper>
          <Typography variant="h2">{t('resource.unpublished_resources')}</Typography>
          <List>
            {!isLoadingMyResources &&
              resourcesUnpublished.length > 0 &&
              resourcesUnpublished.map((resource: Resource, index: number) => (
                <ResourceListItem
                  data-testid={`my-unpublished-resources-${resource.identifier}`}
                  key={index}
                  resource={resource}
                  showTimeCreated={true}
                  fallbackInstitution={institution}
                  handleDelete={() => {
                    deleteResource(resource.identifier, false);
                  }}
                />
              ))}
          </List>
          {!isLoadingMyResources && resourcesUnpublished.length === 0 && (
            <Typography>{t('resource.no_unpublished_resources')}</Typography>
          )}
        </StyledListWrapper>
        <StyledListWrapper>
          <Typography variant="h2">{t('resource.published_resources')}</Typography>
          <List>
            {!isLoadingMyResources &&
              resourcesPublished.length > 0 &&
              resourcesPublished.map((resource: Resource, index: number) => (
                <ResourceListItem
                  data-testid={`my-published-resources-${resource.identifier}`}
                  key={index}
                  resource={resource}
                  showTimeCreated={true}
                  fallbackInstitution={institution}
                  handleDelete={() => {
                    deleteResource(resource.identifier, true);
                  }}
                />
              ))}
          </List>
          {!isLoadingMyResources && resourcesPublished.length === 0 && (
            <Typography>{t('resource.no_published_resources')}</Typography>
          )}
        </StyledListWrapper>
      </ListMarginAlign>
    </StyledContentWrapperLarge>
  );
};

export default MyResources;
