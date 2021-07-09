import React, { FC, useEffect, useState } from 'react';
import { Order, QueryObject, SearchParameters, SearchResult } from '../../types/search.types';
import { StringArrayToSetStringArray } from '../../utils/StringArray';
import { searchResources } from '../../api/resourceApi';
import { Resource } from '../../types/resource.types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Link,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import CreatorPublishedItem from './CreatorPublishedItem';
import styled from 'styled-components';
import ErrorBanner from '../../components/ErrorBanner';
import { DeviceWidths } from '../../themes/mainTheme';

const StyledAccordion = styled(Accordion)`
  margin-top: 1rem;
`;

const SearchResultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
`;

const StyledDetails = styled(AccordionDetails)`
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledTypography = styled(Typography)`
  margin-left: 1rem;
  margin-bottom: 1rem;
`;

const SearchWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

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
const nameOnSeveralFormats = (name: string) => {
  const newNameList: string[] = [name];
  if (name.includes(',')) {
    const fullName = name.trim().split(',');
    const newName = fullName.slice(1).join(' ') + ' ' + fullName[0].trim();
    newNameList.push(newName.trim());
  } else if (name.includes(' ')) {
    const fullName = name.trim().split(' ');
    const newName = fullName[fullName.length - 1] + ', ' + fullName.slice(0, fullName.length - 1).join(' ');
    newNameList.push(newName.trim());
  }
  return StringArrayToSetStringArray(newNameList);
};

interface CreatorPublishedAccordionProps {
  creatorName: string;
  parentResource: Resource;
}

const CreatorPublishedAccordion: FC<CreatorPublishedAccordionProps> = ({ creatorName, parentResource }) => {
  const { t } = useTranslation();
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<Error | undefined>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [creatorsNames] = useState<string[]>(nameOnSeveralFormats(creatorName));
  const link = `/?${creatorsNames.map((creator) => `${SearchParameters.creator}=${creator}`).join('&')}`;
  const shouldUseAccordion = useMediaQuery(`(max-width:${DeviceWidths.lg}px)`);

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
        setResources(parseStringToJSONAndRemoveParentResource(searchResultResponse, parentResource.identifier));
      } catch (error) {
        setLoadingError(error);
      } finally {
        setIsLoading(false);
      }
    };
    searchForCreators();
  }, [creatorsNames, parentResource.creators, parentResource.identifier]);

  if (shouldUseAccordion) {
    return (
      <StyledAccordion>
        <AccordionSummary aria-controls="panel1a-content" expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2" data-testid="also-published-by-header">
            {`${creatorName} ${t('resource.also_published_by_singular').toLowerCase()}`}
          </Typography>
        </AccordionSummary>
        <StyledDetails>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <StyledTypography variant="subtitle2" gutterBottom>
                Antall ressurser funnet: {searchResult?.numFound ? searchResult.numFound - 1 : 0}
              </StyledTypography>
              <SearchResultWrapper>
                {resources.slice(0, 5).map((creatorSearchResult) => (
                  <CreatorPublishedItem key={creatorSearchResult.identifier} resource={creatorSearchResult} />
                ))}
              </SearchResultWrapper>
            </>
          )}

          {loadingError && <ErrorBanner />}

          {searchResult?.numFound && searchResult.numFound > 6 && (
            <StyledTypography>
              <Link href={link}>Se flere ressurser</Link>
            </StyledTypography>
          )}
        </StyledDetails>
      </StyledAccordion>
    );
  } else {
    return (
      <SearchWrapper>
        <Typography data-testid="also-published-by-header" gutterBottom variant="h2">
          {`${creatorName} ${t('resource.also_published_by_singular').toLowerCase()}`}
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <StyledDetails>
            <StyledTypography variant="subtitle2" gutterBottom>
              Antall ressurser funnet: {searchResult?.numFound ? searchResult.numFound - 1 : 0}
            </StyledTypography>
            <SearchResultWrapper>
              {resources.slice(0, 5).map((creatorSearchResult) => (
                <CreatorPublishedItem key={creatorSearchResult.identifier} resource={creatorSearchResult} />
              ))}
            </SearchResultWrapper>
            {searchResult?.numFound && searchResult.numFound > 6 && (
              <StyledTypography align="right">
                <Link href={link}>Se flere ressurser</Link>
              </StyledTypography>
            )}
          </StyledDetails>
        )}
        {loadingError && <ErrorBanner />}
      </SearchWrapper>
    );
  }
};

export default CreatorPublishedAccordion;
