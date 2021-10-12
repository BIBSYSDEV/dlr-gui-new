import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyResources } from '../../api/resourceApi';
import { CircularProgress, List, Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Resource } from '../../types/resource.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { StyledContentWrapperLarge, StyledProgressWrapper } from '../../components/styled/Wrappers';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import ResourceListItem from '../../components/ResourceListItem';
import { Colors } from '../../themes/mainTheme';
import PrivateRoute from '../../utils/routes/PrivateRoute';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledTabPanel = styled(TabPanel)`
  &.MuiTabPanel-root {
    padding: 0;
  }
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
  const [loadingError, setLoadingError] = useState<Error | AxiosError>();
  const { institution } = useSelector((state: RootState) => state.user);
  const [tabValue, setTabValue] = React.useState(Tabs.Published);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMyResources(true);
        setLoadingError(undefined);
        const response = await getMyResources();
        setMyUnpublishedResources(response.data.filter((resource) => !resource.features.dlr_status_published));
        setMyPublishedResources(response.data.filter((resource) => resource.features.dlr_status_published));
      } catch (error) {
        setLoadingError(handlePotentialAxiosError(error));
      } finally {
        setIsLoadingMyResources(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteResource = (resourceIdentifier: string, isPublished: boolean) => {
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
      <>
        <PageHeader>{t('resource.my_resources')}</PageHeader>
        <TabContext value={tabValue}>
          <TabList
            textColor="primary"
            indicatorColor="primary"
            onChange={handleTabChange}
            aria-label={t('resource.my_publication_tabs')}>
            <Tab label={t('resource.published_resources')} value={Tabs.Published} data-testid={'published-tab'} />
            <Tab label={t('resource.unpublished_resources')} value={Tabs.UnPublished} data-testid={'unpublished-tab'} />
          </TabList>
          <StyledTabPanel value={Tabs.Published}>
            <List>
              {!isLoadingMyResources &&
                resourcesPublished.length > 0 &&
                resourcesPublished.map((resource: Resource) => (
                  <ResourceListItem
                    data-testid={`my-published-resources-${resource.identifier}`}
                    key={resource.identifier}
                    resource={resource}
                    fallbackInstitution={institution}
                    backgroundColor={Colors.UnitTurquoise_20percent}
                    handleDelete={() => {
                      handleDeleteResource(resource.identifier, true);
                    }}
                  />
                ))}
            </List>
            {!isLoadingMyResources && resourcesPublished.length === 0 && (
              <Typography>{t('resource.no_published_resources')}</Typography>
            )}
          </StyledTabPanel>
          <StyledTabPanel value={Tabs.UnPublished}>
            <List>
              {!isLoadingMyResources &&
                resourcesUnpublished.length > 0 &&
                resourcesUnpublished.map((resource: Resource) => (
                  <ResourceListItem
                    data-testid={`my-unpublished-resources-${resource.identifier}`}
                    key={resource.identifier}
                    resource={resource}
                    backgroundColor={Colors.UnitGrey2_10percent}
                    fallbackInstitution={institution}
                    handleDelete={() => {
                      handleDeleteResource(resource.identifier, false);
                    }}
                  />
                ))}
            </List>
            {!isLoadingMyResources && resourcesUnpublished.length === 0 && (
              <Typography>{t('resource.no_unpublished_resources')}</Typography>
            )}
          </StyledTabPanel>
        </TabContext>
        {isLoadingMyResources && (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        )}
      </>
    </StyledContentWrapperLarge>
  );
};

export default PrivateRoute(MyResources);
