import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import styled from 'styled-components';
import { Button, List, TextField } from '@material-ui/core';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { SearchResult } from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import ResourceListItemButton from '../../components/ResourceListItemButton';
import Typography from '@material-ui/core/Typography';

const StyledDashboard = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
  visibility: hidden;
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
  const [searchError, setSearchError] = useState(false);

  const triggerSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await searchResources(searchTerm);
      if (response.data) {
        setSearchError(false);
        setSearchResult(response.data);
        setResources(response.data.resourcesAsJson.map((resourceAsString: string) => JSON.parse(resourceAsString)));
      } else {
        setSearchError(true);
      }
    } catch (error) {
      setSearchError(true);
    }
  };

  const updateSearchTermValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <StyledDashboard>
      <Typography variant="h1">{t('resource.search_for_resources')}</Typography>

      <SearchFieldWrapper>
        <form onSubmit={triggerSearch}>
          <TextField id="standard-basic" onChange={updateSearchTermValue} value={searchTerm} />
          <Button disabled={!searchTerm && searchTerm.length < 4} color="primary" variant="contained" type="submit">
            {t('common.search')}
          </Button>
        </form>
      </SearchFieldWrapper>
      {searchError && <ErrorBanner />}

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
            <ResourceListItemButton resource={resource} key={index} showHandle={true} showSubmitter={true} />
          ))}
      </List>
    </StyledDashboard>
  );
};

export default Dashboard;
