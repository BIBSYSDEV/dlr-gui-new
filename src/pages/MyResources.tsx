import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { RouteProps } from 'react-router-dom';
import { getMyResources } from '../api/resourceApi';
import { CircularProgress, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Resource } from '../types/resource.types';
import ImageIcon from '@material-ui/core/SvgIcon/SvgIcon';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

const MyResources: FC<RouteProps> = (props) => {
  const { t } = useTranslation();
  const [isLoadingMyResources, setIsLoadingMyResources] = useState(true);
  const [resourcesUnpublished, setMyUnpublishedResources] = useState<Resource[]>([]);
  const [resourcesPublished, setMyPublishedResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyResources();
      setMyUnpublishedResources(response.data.filter((resource) => !resource.features.dlr_status_published));
      setMyPublishedResources(response.data.filter((resource) => resource.features.dlr_status_published));
      setIsLoadingMyResources(false);
    };
    if (isLoadingMyResources) {
      try {
        fetchData();
      } catch (error) {
        toast.error('ERROR: ' + error.message);
      }
    }
  }, [isLoadingMyResources]);

  return (
    <StyledPageContent>
      <>
        <Typography variant="h2">{t('resource.unpublished_resources')}</Typography>
      </>
      <List>
        {isLoadingMyResources && <CircularProgress />}
        {!isLoadingMyResources &&
          resourcesUnpublished.length > 0 &&
          resourcesUnpublished.map((resource: Resource, index: number) => (
            <ListItem
              button
              component="a"
              href={`/resource/${resource.identifier}`}
              key={index}
              alignItems="flex-start">
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
                secondary={
                  <Typography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                    {resource.features.dlr_time_created}
                  </Typography>
                }
              />
            </ListItem>
          ))}
      </List>
      <>
        <Typography variant="h2">{t('resource.published_resources')}</Typography>
      </>
      <List>
        {isLoadingMyResources && <CircularProgress />}
        {!isLoadingMyResources &&
          resourcesPublished.length > 0 &&
          resourcesPublished.map((resource: Resource, index: number) => (
            <ListItem
              button
              component="a"
              href={`/resource/${resource.identifier}`}
              key={index}
              alignItems="flex-start">
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
                secondary={
                  <Typography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                    {resource.features.dlr_time_created}
                  </Typography>
                }
              />
            </ListItem>
          ))}
      </List>
    </StyledPageContent>
  );
};

export default MyResources;
