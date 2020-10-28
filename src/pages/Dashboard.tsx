import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Button, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { searchResources } from '../api/api';
import { useTranslation } from 'react-i18next';
import { SearchResult } from '../types/search.types';
import { Resource } from '../types/resource.types';

const StyledDashboard = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
`;

const SearchFieldWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-items: center;
`;

const Dashboard: FC = () => {
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const triggerSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchResources(searchTerm)
      .then((response) => {
        if (response.data) {
          setSearchResult(response.data);
          setResources(response.data.resourcesAsJson.map((resourceAsString: string) => JSON.parse(resourceAsString)));
        } else {
          toast.error('ERROR');
        }
      })
      .catch((error) => {
        toast.error('ERROR' + error.message);
      });
  };

  const updateSearchTermValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <StyledDashboard>
      <h1>Search for resources - TEST</h1>

      <SearchFieldWrapper>
        <form onSubmit={triggerSearch}>
          <TextField id="standard-basic" onChange={updateSearchTermValue} value={searchTerm} />
          <Button disabled={!searchTerm && searchTerm.length < 4} color="primary" variant="contained" type="submit">
            {t('search')}
          </Button>
        </form>
      </SearchFieldWrapper>

      <div>
        {searchResult && (
          <span>
            {t('hits')}: {searchResult.numFound}
          </span>
        )}
      </div>

      <List>
        {resources &&
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
    </StyledDashboard>
  );
};

export default Dashboard;
