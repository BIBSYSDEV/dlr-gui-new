import React, { useEffect, useState } from 'react';
import { CircularProgress, List, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { NumberOfResultsPrPage, QueryObject, SearchParameters, SearchResult } from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import SearchInput from './SearchInput';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import ResultListItem from '../../components/ResultListItem';
import FilterSearchOptions from './FilterSearchOptions';

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 3rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'}) {
    flex-direction: row;
  }
`;

const StyledResultListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.ResultListBackground};
  padding: 1.5rem 0.5rem 1rem 0.5rem;
  margin-bottom: 2rem;
  max-width: ${StyleWidths.width5};
  align-items: center;
  flex: 1;
`;

const StyledPaginationWrapper = styled.div`
  margin: 1rem 0 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  & .MuiPaginationItem-root {
    border-radius: 0;
    color: ${Colors.Primary};
    font-weight: 700;
  }
  & .Mui-selected {
    color: ${Colors.Background};
  }
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Explore = () => {
  const firstPage = 1;
  const location = useLocation();
  const [query, setQuery] = useState<null | QueryObject>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);
  const [page, setPage] = useState(firstPage);
  const history = useHistory();

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const searchParams = new URLSearchParams(location.search);
    value === firstPage
      ? searchParams.delete(SearchParameters.page)
      : searchParams.set(SearchParameters.page, value.toString());
    history.replace(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search);
    const pageTerm = searchTerm.get(SearchParameters.page);
    const institutions = searchTerm.get(SearchParameters.institution);
    let offset = 0;
    if (pageTerm) {
      setPage(Number(pageTerm));
      offset = (Number(pageTerm) - 1) * NumberOfResultsPrPage;
    } else {
      setPage(firstPage);
    }
    setQuery({
      query: searchTerm.get(SearchParameters.query) ?? '',
      offset: offset,
      institutions: institutions,
      limit: NumberOfResultsPrPage,
    });
  }, [location]);

  useEffect(() => {
    const triggerSearch = async () => {
      if (query) {
        try {
          setIsSearching(true);
          const response = await searchResources(query);
          if (response.data) {
            setSearchError(false);
            setSearchResult(response.data);
            setResources(response.data.resourcesAsJson.map((resourceAsString: string) => JSON.parse(resourceAsString)));
          } else {
            setSearchError(true);
          }
        } catch (error) {
          setSearchError(true);
        } finally {
          setIsSearching(false);
        }
      }
    };
    triggerSearch();
  }, [query]);

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('dashboard.explore')}</PageHeader>
      <SearchInput />
      {searchError && <ErrorBanner />}
      {isSearching ? (
        <StyledResultListWrapper>
          <CircularProgress />
        </StyledResultListWrapper>
      ) : (
        searchResult && (
          <SearchResultWrapper>
            <FilterSearchOptions />
            <StyledResultListWrapper>
              <Typography variant="h2">
                {t('common.result')} ({searchResult.numFound})
              </Typography>
              <StyledList>
                {resources &&
                  resources.length > 0 &&
                  resources.map((resource: Resource) => (
                    <ResultListItem resource={resource} key={resource.identifier} />
                  ))}
              </StyledList>
              {searchResult.numFound > NumberOfResultsPrPage && (
                <StyledPaginationWrapper>
                  <Typography variant="subtitle2">{t('common.page')}</Typography>
                  <Pagination
                    count={Math.ceil(searchResult.numFound / NumberOfResultsPrPage)}
                    page={page}
                    color="primary"
                    onChange={handlePaginationChange}
                  />
                </StyledPaginationWrapper>
              )}
            </StyledResultListWrapper>
          </SearchResultWrapper>
        )
      )}
    </StyledContentWrapperLarge>
  );
};

export default Explore;
