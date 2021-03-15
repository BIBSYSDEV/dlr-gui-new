import React, { useEffect, useState } from 'react';
import { CircularProgress, List, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { emptyQueryObject, NumberOfResultsPrPage, SearchParameters, SearchResult } from '../../types/search.types';
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

const StyledProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3rem;
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

const StyledResultListHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${StyleWidths.width4};
  justify-content: center;
`;

const StyledResultListHeader = styled(Typography)`
  width: 100%;
`;

const firstPage = 1;

const Explore = () => {
  const [page, setPage] = useState(firstPage);
  const location = useLocation();

  const [queryObject, setQueryObject] = useState(emptyQueryObject);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);
  const history = useHistory();

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setQueryObject((prevState) => ({
      ...prevState,
      offset: (Number(value) - 1) * NumberOfResultsPrPage,
      queryFromURL: false,
    }));
  };

  useEffect(() => {
    const createQueryFromUrl = () => {
      const searchTerms = new URLSearchParams(location.search);
      const institutions = searchTerms.getAll(SearchParameters.institution);
      const resourceTypes = searchTerms.getAll(SearchParameters.resourceType);
      const tags = searchTerms.getAll(SearchParameters.tag);
      const pageTerm = searchTerms.get(SearchParameters.page);
      const licenses = searchTerms.getAll(SearchParameters.license);
      const offset = pageTerm && Number(pageTerm) !== firstPage ? (Number(pageTerm) - 1) * NumberOfResultsPrPage : 0;
      return {
        ...emptyQueryObject,
        query: searchTerms.get(SearchParameters.query) ?? '',
        offset: offset,
        limit: NumberOfResultsPrPage,
        resourceTypes: resourceTypes,
        institutions: institutions,
        licenses: licenses,
        tags: tags,
        queryFromURL: true,
        allowSearch: true,
      };
    };
    if (!queryObject.queryFromURL && !queryObject.allowSearch) {
      setQueryObject(createQueryFromUrl());
    }
  }, [location, queryObject.allowSearch, queryObject.queryFromURL]);

  useEffect(() => {
    const reWriteUrl = () => {
      let url = `?`;
      if (queryObject.query.length > 0) url += `${SearchParameters.query}=${queryObject.query}`;
      if (queryObject.institutions.length > 0)
        url += queryObject.institutions
          .map((institution) => `&${SearchParameters.institution}=${institution}`)
          .join('');
      if (queryObject.resourceTypes.length > 0)
        url += queryObject.resourceTypes.map((type) => `&${SearchParameters.resourceType}=${type}`).join('');
      if (queryObject.licenses.length > 0)
        url += queryObject.licenses.map((licenseCode) => `&${SearchParameters.license}=${licenseCode}`).join('');
      if (queryObject.tags.length > 0) url += queryObject.tags.map((tag) => `&${SearchParameters.tag}=${tag}`).join('');
      history.replace(url);
    };

    const triggerSearch = async () => {
      if (!queryObject.queryFromURL) {
        reWriteUrl();
      }
      if (queryObject) {
        try {
          setIsSearching(true);
          const response = await searchResources(queryObject);
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
    if (queryObject.allowSearch) triggerSearch();
  }, [queryObject, history]);

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('dashboard.explore')}</PageHeader>
      <SearchInput setQueryObject={setQueryObject} />
      {searchError && <ErrorBanner />}
      {!searchResult && isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchResult && (
        <SearchResultWrapper>
          <FilterSearchOptions queryObject={queryObject} setQueryObject={setQueryObject} />
          <StyledResultListWrapper>
            {isSearching ? (
              <StyledProgressWrapper>
                <CircularProgress />
              </StyledProgressWrapper>
            ) : (
              <>
                <StyledResultListHeaderWrapper>
                  <StyledResultListHeader variant="h2">
                    {t('common.result')} ({searchResult.numFound})
                  </StyledResultListHeader>
                </StyledResultListHeaderWrapper>
                <StyledList>
                  {resources &&
                    resources.length > 0 &&
                    resources.map((resource) => <ResultListItem resource={resource} key={resource.identifier} />)}
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
              </>
            )}
          </StyledResultListWrapper>
        </SearchResultWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default Explore;
