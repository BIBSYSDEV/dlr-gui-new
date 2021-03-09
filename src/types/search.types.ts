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
  institutions: string[];
  resourceType: string[];
  licenses: string[];
  keywords: string[];
  queryFromURL: boolean;
  allowSearch: boolean; //instead of setting queryobject null at initiation
}

export const firstResultPage = 1;

export const emptyQueryObject: QueryObject = {
  query: '',
  offset: 0,
  limit: 0,
  institutions: [],
  resourceType: [],
  licenses: [],
  keywords: [],
  queryFromURL: false,
  allowSearch: false,
};

export enum SearchParameters {
  institution = 'inst',
  query = 'query',
  page = 'page',
  limit = 'limit',
  offset = 'offset',
}

export const AllDLRInstitutionNames = ['ntnu', 'bi', 'oslomet', 'uib', 'hvl'];
