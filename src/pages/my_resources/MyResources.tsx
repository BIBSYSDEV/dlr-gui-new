import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyResources } from '../../api/resourceApi';
import { CircularProgress, List, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import ResourceListItemButton from '../../components/ResourceListItemButton';

const StyledPageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledPageHeader = styled(Typography)`
  margin-top: 40px;
`;

const MyResources: FC = () => {
  const { t } = useTranslation();
  const [isLoadingMyResources, setIsLoadingMyResources] = useState(false);
  const [resourcesUnpublished, setMyUnpublishedResources] = useState<Resource[]>([]);
  const [resourcesPublished, setMyPublishedResources] = useState<Resource[]>([]);
  const [loadingError, setLoadingError] = useState(false);

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

  return (
    <StyledPageContent>
      {loadingError && <ErrorBanner />}
      <StyledPageHeader variant="h2">{t('resource.unpublished_resources')}</StyledPageHeader>
      <List>
        {isLoadingMyResources && <CircularProgress />}
        {!isLoadingMyResources &&
          resourcesUnpublished.length > 0 &&
          resourcesUnpublished.map((resource: Resource, index: number) => (
            <ResourceListItemButton key={index} resource={resource} showTimeCreated={true} />
          ))}
      </List>
      <StyledPageHeader variant="h2">{t('resource.published_resources')}</StyledPageHeader>
      <List>
        {isLoadingMyResources && <CircularProgress />}
        {!isLoadingMyResources &&
          resourcesPublished.length > 0 &&
          resourcesPublished.map((resource: Resource, index: number) => (
            <ResourceListItemButton key={index} resource={resource} showTimeCreated={true} />
          ))}
      </List>
    </StyledPageContent>
  );
};

export default MyResources;
