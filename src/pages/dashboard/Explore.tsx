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
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import LoginReminder from '../../components/LoginReminder';
import AccessFiltering from './AccessFiltering';
import _ from 'lodash';

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
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
    align-items: flex-start;
  }
  align-items: center;
  width: 100%;
  max-width: ${StyleWidths.width4};
  justify-content: space-between;
`;

const firstPage = 1;

const Explore = () => {
  const [page, setPage] = useState(firstPage);
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [queryObject, setQueryObject] = useState(emptyQueryObject);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState<Error>();
  const history = useHistory();
  const [allowSearch, setAllowSearch] = useState(false);
  const [queryFromURL, setQueryFromURL] = useState(false);

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setQueryFromURL(false);
    setQueryObject((prevState) => ({
      ...prevState,
      offset: (Number(value) - 1) * NumberOfResultsPrPage,
    }));
  };

  useEffect(() => {
    const createQueryFromUrl = () => {
      const searchTerms = new URLSearchParams(location.search);
      const institutions = searchTerms.getAll(SearchParameters.institution);
      const resourceTypes = searchTerms.getAll(SearchParameters.resourceType);
      const tags = searchTerms.getAll(SearchParameters.tag).map((tag) => tag.toLowerCase());
      const pageTerm = searchTerms.get(SearchParameters.page);
      const showInaccessibleParameter = searchTerms.get(SearchParameters.showInaccessible);
      const showInaccessible = showInaccessibleParameter ? showInaccessibleParameter.toLowerCase() === 'true' : false;
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
        showInaccessible: showInaccessible,
      };
    };
    const newQueryObject = createQueryFromUrl();
    if (
      (!queryFromURL && !allowSearch) ||
      (!_.isEqual(queryObject, newQueryObject) && queryObject.offset === newQueryObject.offset)
    ) {
      setQueryObject(newQueryObject);
      setQueryFromURL(true);
      setAllowSearch(true);
    }
  }, [location, allowSearch, queryFromURL, queryObject]);

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
      if (queryObject.showInaccessible) url += `&${SearchParameters.showInaccessible}=true`;
      history.push(url);
    };

    const triggerSearch = async () => {
      if (!queryFromURL) {
        reWriteUrl();
      }
      if (queryObject) {
        try {
          setIsSearching(true);
          const response = await searchResources(queryObject);
          setSearchError(undefined);
          setSearchResult(response.data);
          setResources(response.data.resourcesAsJson.map((resourceAsString: string) => JSON.parse(resourceAsString)));
        } catch (error) {
          setSearchError(error);
        } finally {
          setIsSearching(false);
        }
      }
    };
    if (allowSearch) triggerSearch();
    if (queryObject.offset === 0) setPage(firstPage);
  }, [allowSearch, queryFromURL, queryObject, history]);

  return (
    <StyledContentWrapperLarge>
      {!user.id && <LoginReminder />}
      <PageHeader>{t('dashboard.explore')}</PageHeader>
      <SearchInput
        queryFromURL={queryFromURL}
        setQueryFromURL={setQueryFromURL}
        setQueryObject={setQueryObject}
        queryObject={queryObject}
      />
      {searchError && <ErrorBanner error={searchError} />}
      {!searchResult && isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchResult && (
        <SearchResultWrapper>
          <FilterSearchOptions
            queryFromURL={queryFromURL}
            setQueryFromURL={setQueryFromURL}
            queryObject={queryObject}
            setQueryObject={setQueryObject}
          />
          <StyledResultListWrapper>
            {isSearching ? (
              <StyledProgressWrapper>
                <CircularProgress />
              </StyledProgressWrapper>
            ) : (
              <>
                <StyledResultListHeaderWrapper>
                  <Typography variant="h2">
                    {t('common.result')} ({searchResult.numFound})
                  </Typography>
                  <AccessFiltering
                    queryFromURL={queryFromURL}
                    setQueryFromURL={setQueryFromURL}
                    queryObject={queryObject}
                    setQueryObject={setQueryObject}
                  />
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
