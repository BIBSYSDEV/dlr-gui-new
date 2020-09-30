import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAnonymousWebToken, searchResources } from '../api/api';
import { toast } from 'react-toastify';
import { Button, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: auto auto;
  row-gap: 1rem;
  justify-items: center;
`;

const SearchFieldWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-items: center;
`;

const Dashboard: FC = () => {
  const [token, setToken] = useState<string>('');
  const [resultList, setResultList] = useState<any>([]);
  const [resources, setResources] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAnonymousWebToken().then((response) => {
      if (response) {
        if (response.error) {
          toast.error('API ERROR');
        } else {
          window.localStorage.setItem('token', response.data as string);
          console.log('token set in local storage');
          setToken(response.data as string);
        }
      }
    });
  }, []);

  const triggerSearch = () => {
    searchResources(searchTerm, token).then((response) => {
      if (response) {
        if (response.error) {
          toast.error('API ERROR');
        } else {
          let _resources: any[] = [];
          setResultList(response);
          // @ts-ignore
          response.data.resourcesAsJson.map((resource: any) => _resources.push(JSON.parse(resource)));
          setResources(_resources);
        }
      }
    });
  };

  const updateSearchTermValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <StyledDashboard>
      <h1>Search for resources</h1>

      <SearchFieldWrapper>
        <TextField id="standard-basic" onChange={updateSearchTermValue} value={searchTerm} />
        <Button
          disabled={!searchTerm && searchTerm.length < 4}
          color="primary"
          variant="contained"
          onClick={triggerSearch}>
          Search
        </Button>
      </SearchFieldWrapper>

      <div>{resultList && resultList.data && <span>Treff: {resultList.data.numFound}</span>}</div>

      <List>
        {resources &&
          resources.length > 0 &&
          resources.map((resource: any, index: number) => (
            <ListItem
              button
              component="a"
              href={`/resources/${resource.identifier}`}
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
                    {resource.features.dlr_identifier_handle}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
      </List>
    </StyledDashboard>
  );
};

export default Dashboard;
