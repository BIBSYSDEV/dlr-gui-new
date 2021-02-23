import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { List, Typography } from '@material-ui/core';
import { searchResources } from '../../api/resourceApi';
import { useTranslation } from 'react-i18next';
import { SearchResult } from '../../types/search.types';
import { Resource } from '../../types/resource.types';
import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import SearchInput from './SearchInput';
import { useLocation } from 'react-router-dom';
import ResultListItem from '../../components/ResultListItem';

const StyledResultListWrapper = styled.li`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.LicenseAccessPageGradientColor3}; //todo: 1
  margin-top: 2rem;
  padding-top: 1.5rem;
  width: 100%;
  max-width: ${StyleWidths.width5};
`;

const StyledResultListSize = styled(Typography)`
  display: block;
  margin-left: 2rem;
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Explore: FC = () => {
  const location = useLocation();
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [resources, setResources] = useState<Resource[]>([]);
  const { t } = useTranslation();
  const [searchError, setSearchError] = useState(false);

  const triggerSearch = async (query: string) => {
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
  };

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search);
    const query = searchTerm.get('query');
    if (query !== null) {
      triggerSearch(query);
    }
  }, [location]);

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('dashboard.explore')}</PageHeader>
      <SearchInput />
      {searchError && <ErrorBanner />}
      {searchResult && (
        <StyledResultListWrapper>
          <StyledResultListSize variant="h2">
            {t('hits')}: {searchResult.numFound}
          </StyledResultListSize>
          <StyledList>
            {resources &&
              resources.length > 0 &&
              resources.map((resource: Resource) => <ResultListItem resource={resource} key={resource.identifier} />)}
          </StyledList>
        </StyledResultListWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default Explore;
