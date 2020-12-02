import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Resource } from '../types/resource.types';
import { getMyResources } from '../api/resourceApi';
import { CircularProgress, ListItemIcon, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import { API_PATHS, API_URL } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@material-ui/icons/Image';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

const MyResourcesPage: FC<RouteProps> = (props) => {
  const { t } = useTranslation();
  const [resources, setMyResources] = useState<Resource[]>([]);
  const [isLoadingMyResources, setIsLoadingMyResources] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const promises: Promise<any>[] = [];
      promises[0] = getMyResources().then((response) => {
        setMyResources(response.data);
      });
      await Promise.all(promises).finally(() => {
        setIsLoadingMyResources(false);
      });
    };
  });

  return (
    <StyledPageContent>
      {isLoadingMyResources && <CircularProgress />}
      {!isLoadingMyResources && (
        <>
          <Typography variant="h1">My Resources</Typography>
        </>
      )}
      <List>
        {!isLoadingMyResources &&
          resources &&
          resources.length > 0 &&
          resources.map((resource: Resource, index: number) => (
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
                  <React.Fragment>
                    <Typography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                      {resource.features.dlr_submitter_email}
                    </Typography>
                    {resource.features.dlr_identifier_handle && (
                      <span>
                        {t('handle')}: {resource.features.dlr_identifier_handle}
                      </span>
                    )}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
      </List>
    </StyledPageContent>
  );
};

export default MyResourcesPage;
