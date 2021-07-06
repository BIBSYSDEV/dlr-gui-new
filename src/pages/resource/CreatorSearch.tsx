import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { searchResources } from '../../api/resourceApi';
import { Order, QueryObject, SearchResult } from '../../types/search.types';
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import styled from 'styled-components';
import CreatorPublishedItem from './CreatorPublishedItem';
import ErrorBanner from '../../components/ErrorBanner';
import { useTranslation } from 'react-i18next';

const SearchWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

//TODO: Cypress tester

/*
Searchresult may contain the parent resource which is unnecessary.
If it does not contain parent resource the array is too long.
 */
const parseStringToJSONAndRemoveParentResource = (
  searchResult: SearchResult,
  parentResourceIdentifier: string
): Resource[] => {
  return searchResult.resourcesAsJson
    .map((resourceAsString: string) => JSON.parse(resourceAsString))
    .filter((value) => value.identifier !== parentResourceIdentifier);
};

//generates names on "surname, given name" and "given name surname" format. Does not mutate input
const namesOnSeveralFormats = (nameList: string[]): string[] => {
  const newNameList: string[] = [...nameList];
  nameList.forEach((name) => {
    if (name.includes(',')) {
      const fullName = name.trim().split(',');
      const newName = fullName.slice(1).join(' ') + ' ' + fullName[0].trim();
      newNameList.push(newName.trim());
    } else if (name.includes(' ')) {
      const fullName = name.trim().split(' ');
      const newName = fullName[fullName.length - 1] + ', ' + fullName.slice(0, fullName.length - 1).join(' ');
      newNameList.push(newName.trim());
    }
  });
  return newNameList;
};

interface CreatorSearchProps {
  resource: Resource;
}

const CreatorSearch: FC<CreatorSearchProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<Error | undefined>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [showEverything, setShowEverything] = useState(false);
  const [displayCreatorNames] = useState<string[]>(
    resource.creators
      .map((creator) => creator.features.dlr_creator_name)
      .filter((creatorName): creatorName is string => !!creatorName)
  );
  const [creatorsNames] = useState<string[]>(
    namesOnSeveralFormats(
      resource.creators
        .map((creator) => creator.features.dlr_creator_name)
        .filter((creatorName): creatorName is string => !!creatorName)
    )
  );

  useEffect(() => {
    const searchForCreators = async () => {
      try {
        setIsLoading(true);
        setLoadingError(undefined);
        const queryObject: QueryObject = {
          query: '',
          offset: 0,
          limit: 6,
          institutions: [],
          resourceTypes: [],
          licenses: [],
          tags: [],
          showInaccessible: false,
          orderBy: 'created',
          order: Order.Desc,
          mine: false,
          creators: creatorsNames,
        };
        const searchResultResponse = (await searchResources(queryObject)).data;
        setSearchResult(searchResultResponse);
        setResources(parseStringToJSONAndRemoveParentResource(searchResultResponse, resource.identifier));
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoading(false);
      }
    };
    searchForCreators();
  }, [creatorsNames, resource.creators, resource.identifier]);

  const fetchTheRest = async () => {
    try {
      //the complete search might already be cached
      if (searchResult && resources.length < 6) {
        setIsLoading(true);
        setLoadingError(undefined);
        const queryObject: QueryObject = {
          query: '',
          offset: 0,
          limit: searchResult.numFound,
          institutions: [],
          resourceTypes: [],
          licenses: [],
          tags: [],
          showInaccessible: false,
          orderBy: 'created',
          order: Order.Desc,
          mine: false,
          creators: creatorsNames,
        };
        const searchResultResponse = (await searchResources(queryObject)).data;
        setSearchResult(searchResultResponse);
        setResources(parseStringToJSONAndRemoveParentResource(searchResultResponse, resource.identifier));
      }
      setShowEverything(true);
    } catch (error) {
      setLoadingError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {(resources.length > 0 || loadingError || isLoading) && (
        <SearchWrapper>
          <Typography gutterBottom variant="h2">
            {displayCreatorNames.join(', ')}{' '}
            {displayCreatorNames.length > 1
              ? t('resource.also_published_by_plural').toLowerCase()
              : t('resource.also_published_by_singular').toLowerCase()}
          </Typography>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {loadingError && <ErrorBanner error={loadingError} />}
              <Grid container spacing={3}>
                {showEverything ? (
                  <>
                    {resources.map((creatorSearchResult) => (
                      <Grid key={creatorSearchResult.identifier} item>
                        <CreatorPublishedItem key={creatorSearchResult.identifier} resource={creatorSearchResult} />
                      </Grid>
                    ))}
                  </>
                ) : (
                  <>
                    {resources.slice(0, 5).map((creatorSearchResult) => (
                      <Grid key={creatorSearchResult.identifier} item>
                        <CreatorPublishedItem key={creatorSearchResult.identifier} resource={creatorSearchResult} />
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
              {searchResult?.numFound && searchResult.numFound > 6 && !showEverything && (
                <ButtonWrapper>
                  <Button onClick={fetchTheRest} color="primary" variant="outlined">
                    {t('common.show_more')}
                  </Button>
                </ButtonWrapper>
              )}
              {showEverything && (
                <ButtonWrapper>
                  <Button onClick={() => setShowEverything(false)} color="primary" variant="outlined">
                    {t('common.hide')}
                  </Button>
                </ButtonWrapper>
              )}
            </>
          )}
        </SearchWrapper>
      )}
    </>
  );
};

export default CreatorSearch;
