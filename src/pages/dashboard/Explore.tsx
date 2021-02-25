import React, { FC, useEffect, useState } from 'react';
import { List } from '@material-ui/core';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { SearchResult } from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import ResourceListItem from '../../components/ResourceListItem';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import SearchInput from './SearchInput';
import { useLocation } from 'react-router-dom';
import FilterSearchOptions from './FilterSearchOptions';
import { InstitutionParameterName } from './InstitutionFiltering';

const Explore: FC = () => {
  const location = useLocation();
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);

  const triggerSearch = async (query: string, institutions: string | null) => {
    try {
      const response = await searchResources(query, institutions, [], [], []);
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

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search);
    const query = searchTerm.get('query');
    const institutions = searchTerm.get(InstitutionParameterName);
    if (query !== null) {
      triggerSearch(query, institutions);
    }
  }, [location]);

  return (
    <StyledContentWrapperMedium>
      <PageHeader>{t('dashboard.explore')}</PageHeader>

      <SearchInput />
      <FilterSearchOptions />

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
            <ResourceListItem resource={resource} key={index} showHandle={true} showSubmitter={true} />
          ))}
      </List>
    </StyledContentWrapperMedium>
  );
};

export default Explore;
