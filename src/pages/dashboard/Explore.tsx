import React, { FC, useEffect, useState } from 'react';
import { List, Typography } from '@material-ui/core';
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
import { Pagination } from '@material-ui/lab';

const NumberOfHitsPrPage = 5;

const Explore: FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);
  const [page, setPage] = useState(0);

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search);
    setQuery(searchTerm.get('query'));
  }, [location]);

  useEffect(() => {
    const triggerSearch = async () => {
      if (query) {
        try {
          const offset = NumberOfHitsPrPage * (page - 1);
          const limit = NumberOfHitsPrPage;
          const response = await searchResources(query, limit, offset);
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
      }
    };
    triggerSearch();
  }, [query, page]);

  return (
    <StyledContentWrapperMedium>
      <PageHeader>{t('dashboard.explore')}</PageHeader>
      <SearchInput />
      {searchError && <ErrorBanner />}

      <div>
        {searchResult && (
          <span>
            {t('hits')}: {searchResult.numFound}
          </span>
        )}
      </div>
      {searchResult?.numFound && searchResult.numFound > NumberOfHitsPrPage && <Typography>Page: {page}</Typography>}
      <List>
        {resources &&
          resources.length > 0 &&
          resources.map((resource: Resource, index: number) => (
            <ResourceListItem resource={resource} key={index} showHandle={true} showSubmitter={true} />
          ))}
      </List>
      {searchResult?.numFound && searchResult.numFound > NumberOfHitsPrPage && (
        <Pagination
          count={Math.ceil(searchResult.numFound / NumberOfHitsPrPage)}
          page={page}
          color="primary"
          onChange={handlePaginationChange}
        />
      )}
    </StyledContentWrapperMedium>
  );
};

export default Explore;
