import { v4 as uuidv4 } from 'uuid';

export interface SearchResult {
  offset: number;
  numFound: number;
  queryTime: number;
  resourcesAsJson: string[]; // !!!
  facet_counts: Facet[];
  spellcheck_suggestions: string[];
}

interface Facet {
  type: string;
  value: string;
  count: string;
}

export const NumberOfResultsPrPage = 10;

export interface QueryObject {
  query: string;
  offset: number;
  limit: number;
  key: string;
  institutions: string[];
  // TODO: Enable when Tasks for resourceType, Licenses,  keywords is done
  // resourceType: string[];
  // licenses: string[];
  // keywords: string[];
}

export const firstResultPage = 1;

export const emptyQueryObject: QueryObject = {
  query: '',
  offset: 0,
  limit: 0,
  institutions: [],
  key: uuidv4(),
};

export enum SearchParameters {
  institution = 'inst',
  query = 'query',
  page = 'page',
  limit = 'limit',
  offset = 'offset',
}
