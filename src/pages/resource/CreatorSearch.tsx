import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { searchResources } from '../../api/resourceApi';
import { Order, QueryObject, SearchResult } from '../../types/search.types';
import { Grid, Typography } from '@material-ui/core';
import styled from 'styled-components';
import CreatorPublishedItem from './CreatorPublishedItem';

const SearchWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

//TODO: generere søket basert på ressursen
/*
Hvem skal man søke på? Første forfatter?
 */
//TODO: Avgjøre hvem som får se denne komponenten
/*
Minimum:
- Skjules hvis det er forhåndsvisning.
 */
//TODO: Stiling etter figma
//TODO: Oversettelser
//TODO: Cypress tester

/*
Searchresult may contain the parent resource which is unnecessary.
If it does not contain parent resource the array is too long.
 */
const parseStringToJSONAndRemoveParentResourceAndLimitToFiveResources = (
  searchResult: SearchResult,
  parentResourceIdentifier: string
): Resource[] => {
  return searchResult.resourcesAsJson
    .map((resourceAsString: string) => JSON.parse(resourceAsString))
    .filter((value) => value.identifier !== parentResourceIdentifier)
    .slice(0, 6);
};

interface CreatorSearchProps {
  resource: Resource;
}

const CreatorSearch: FC<CreatorSearchProps> = ({ resource }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const creatorsNames: string[] = resource.creators
    .map((creator) => creator.features.dlr_creator_name)
    .filter((creatorName): creatorName is string => !!creatorName);

  useEffect(() => {
    const searchForCreators = async () => {
      try {
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
        const searchResult = (await searchResources(queryObject)).data;
        setResources(
          parseStringToJSONAndRemoveParentResourceAndLimitToFiveResources(searchResult, resource.identifier)
        );
      } catch (error) {
        console.log(error);
      }
    };
    searchForCreators();
  }, [creatorsNames, resource.creators, resource.identifier]);

  return (
    <SearchWrapper>
      <Typography gutterBottom variant="h2">
        {creatorsNames.join(', ')} har også blant annet publisert
      </Typography>

      <Grid container spacing={3}>
        {resources.map((creatorSearchResult) => (
          <Grid key={creatorSearchResult.identifier} item>
            <CreatorPublishedItem key={creatorSearchResult.identifier} resource={creatorSearchResult} />
          </Grid>
        ))}
      </Grid>
    </SearchWrapper>
  );
};

export default CreatorSearch;
