import React, { createRef, useCallback, useEffect, useState } from 'react';
import { CircularProgress, List, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import {
  emptyQueryObject,
  NumberOfResultsPrPage,
  QueryObject,
  SearchParameters,
  SearchQueryBooleanOperator,
  SearchResult,
} from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge, StyledPaginationWrapper } from '../../components/styled/Wrappers';
import SearchInput from './SearchInput';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import ResultListItem from '../../components/ResultListItem';
import FilterSearchOptions from './FilterSearchOptions';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import LoginReminder from '../../components/LoginReminder';
import AccessFiltering from './AccessFiltering';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';
import NoResult from './NoResult';

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
  background-color: ${Colors.UnitTurquoise_20percent};
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

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledResultListHeaderWrapper = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    flex-direction: column;
    align-items: flex-start;
  }
  align-items: baseline;
  width: 100%;
  max-width: ${StyleWidths.width4};
  justify-content: space-between;
`;

const firstPage = 1;

const createQueryFromUrl = (location: any): QueryObject => {
  const searchTerms = new URLSearchParams(location.search);
  const institutions = searchTerms.getAll(SearchParameters.institution);
  const resourceTypes = searchTerms.getAll(SearchParameters.resourceType);
  const tags = searchTerms.getAll(SearchParameters.tag).map((tag) => tag.toLowerCase());
  const creators = searchTerms.getAll(SearchParameters.creator);
  const pageTerm = searchTerms.get(SearchParameters.page);
  const showInaccessibleParameter = searchTerms.get(SearchParameters.showInaccessible);
  const offset = pageTerm && Number(pageTerm) !== firstPage ? (Number(pageTerm) - 1) * NumberOfResultsPrPage : 0;
  const showInaccessible = showInaccessibleParameter ? showInaccessibleParameter.toLowerCase() === 'true' : false;
  const licenses = searchTerms.getAll(SearchParameters.license);
  const tagsQueryOperator =
    searchTerms.get(SearchParameters.tagFilterOperator) === SearchQueryBooleanOperator.AND
      ? SearchQueryBooleanOperator.AND
      : SearchQueryBooleanOperator.OR;
  return {
    ...emptyQueryObject,
    query: searchTerms.get(SearchParameters.query) ?? '',
    offset: offset,
    limit: NumberOfResultsPrPage,
    resourceTypes: resourceTypes,
    institutions: institutions,
    licenses: licenses,
    tags: tags,
    tagFilterOperator: tagsQueryOperator,
    creators: creators,
    showInaccessible: showInaccessible,
  };
};

const Explore = () => {
  const startOfList = createRef<HTMLDivElement>();
  const location = useLocation();
  const [queryObject, setQueryObject] = useState<QueryObject>(createQueryFromUrl(location));
  const [page, setPage] = useState(queryObject.offset / 10 + 1);
  const user = useSelector((state: RootState) => state.user);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState<Error | AxiosError>();
  const history = useHistory();
  const [hasPopStateListener, setHasPopStateListener] = useState(false);

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      setQueryObject((prevState) => ({
        ...prevState,
        offset: (Number(value) - 1) * NumberOfResultsPrPage,
      }));
      rewriteSearchParams(SearchParameters.page, ['' + value], history, location);

      if (startOfList && startOfList.current) {
        startOfList.current.scrollIntoView();
      }
    },
    [history, location, startOfList]
  );

  const triggerSearch = async (queryObject: QueryObject) => {
    try {
      setIsSearching(true);
      const response = await searchResources(queryObject);
      setSearchError(undefined);
      setSearchResult(response.data);
      setResources(response.data.resourcesAsJson.map((resourceAsString: string) => JSON.parse(resourceAsString)));
    } catch (error) {
      setSearchError(handlePotentialAxiosError(error));
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    triggerSearch(queryObject);
  }, [queryObject]);

  useEffect(() => {
    if (!hasPopStateListener) {
      setHasPopStateListener(true);
      window.addEventListener('popstate', () => {
        const newQueryObject = createQueryFromUrl(window.location);
        setQueryObject(newQueryObject);
        setPage(newQueryObject.offset / 10 + 1);
      });
    }
  }, [queryObject, hasPopStateListener]);

  return (
    <StyledContentWrapperLarge>
      {!user.id && <LoginReminder />}
      <PageHeader testId="page-title">{t('dashboard.explore')}</PageHeader>
      <SearchInput setQueryObject={setQueryObject} queryObject={queryObject} />
      {searchError && <ErrorBanner error={searchError} />}
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
                <StyledResultListHeaderWrapper ref={startOfList}>
                  <Typography variant="h2">{t('common.result')}</Typography>

                  {resources && resources.length > 0 && (
                    <Typography variant="body1">
                      {`${t('common.showing')} ${parseInt(searchResult.offset) + 1}-${
                        parseInt(searchResult.offset) + resources.length
                      } ${t('common.of').toLowerCase()} ${searchResult.numFound}`}
                    </Typography>
                  )}
                  {user.id && <AccessFiltering queryObject={queryObject} setQueryObject={setQueryObject} />}
                </StyledResultListHeaderWrapper>
                {resources.length === 0 && <NoResult searchResult={searchResult} />}
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
