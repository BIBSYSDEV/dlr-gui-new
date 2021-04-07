import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyResources } from '../../api/resourceApi';
import { CircularProgress, List, Tab, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import ResourceListItem from '../../components/ResourceListItem';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

const StyledTabList = styled(TabList)`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ListMarginAlign = styled.div`
  display: block;
  align-items: start;
`;

enum Tabs {
  UnPublished = 'unpublished',
  Published = 'published',
}

const MyResources = () => {
  const { t } = useTranslation();
  const [isLoadingMyResources, setIsLoadingMyResources] = useState(false);
  const [resourcesUnpublished, setMyUnpublishedResources] = useState<Resource[]>([]);
  const [resourcesPublished, setMyPublishedResources] = useState<Resource[]>([]);
  const [loadingError, setLoadingError] = useState<Error>();
  const { institution } = useSelector((state: RootState) => state.user);
  const [tabValue, setTabValue] = React.useState(Tabs.UnPublished);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMyResources(true);
        setLoadingError(undefined);
        const response = await getMyResources();
        setMyUnpublishedResources(response.data.filter((resource) => !resource.features.dlr_status_published));
        setMyPublishedResources(response.data.filter((resource) => resource.features.dlr_status_published));
        setIsLoadingMyResources(false);
      } catch (error) {
        setLoadingError(error);
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

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: Tabs) => {
    setTabValue(newValue);
  };

  return (
    <StyledContentWrapperLarge>
      {loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}
      {isLoadingMyResources && <CircularProgress />}
      <ListMarginAlign>
        <PageHeader>{t('resource.my_resources')}</PageHeader>
        <TabContext value={tabValue}>
          <StyledTabList textColor="primary" onChange={handleTabChange} aria-label="simple tabs example">
            <Tab label={t('resource.unpublished_resources')} value={Tabs.UnPublished} />
            <Tab label={t('resource.published_resources')} value={Tabs.Published} />
          </StyledTabList>
          <TabPanel value={Tabs.UnPublished}>
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
          </TabPanel>
          <TabPanel value={Tabs.Published}>
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
          </TabPanel>
        </TabContext>
      </ListMarginAlign>
    </StyledContentWrapperLarge>
  );
};

export default MyResources;
