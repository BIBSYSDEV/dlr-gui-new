import React, { useEffect, useState } from 'react';
import { List, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { NumberOfResultsPrPage, QueryObject, SearchResult } from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import SearchInput from './SearchInput';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import ResultListItem from '../../components/ResultListItem';

const StyledResultListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.ResultListBackground};
  margin-top: 2rem;
  padding: 1.5rem 0.5rem 0 0.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: ${StyleWidths.width5};
  align-items: center;
`;

const StyledListHeader = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width4};
`;

const StyledPaginationWrapper = styled.div`
  margin: 1rem 0 2rem 0;
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
  const location = useLocation();
  const [query, setQuery] = useState<null | QueryObject>(null);
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);
  const [page, setPage] = useState(1);
  const history = useHistory();

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const searchParams = new URLSearchParams(location.search);
    const offset = NumberOfResultsPrPage * (value - 1);
    offset === 0 ? searchParams.delete('offset') : searchParams.set('offset', '' + offset);
    history.replace(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search);
    setQuery({
      query: searchTerm.get('query') ?? '',
      offset: +(searchTerm.get('offset') ?? '0'),
      limit: NumberOfResultsPrPage,
    });
  }, [location]);

  useEffect(() => {
    const triggerSearch = async () => {
      if (query) {
        try {
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

      {searchResult && (
        <StyledResultListWrapper>
          <StyledListHeader>
            <Typography variant="h2">
              {t('common.result')} ({searchResult.numFound})
            </Typography>
          </StyledListHeader>
          <StyledList>
            {resources &&
              resources.length > 0 &&
              resources.map((resource: Resource) => <ResultListItem resource={resource} key={resource.identifier} />)}
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
      )}
    </StyledContentWrapperLarge>
  );
};

export default Explore;
