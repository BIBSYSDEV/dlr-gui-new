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
  institutions: string | null;
  // TODO: Enable when Tasks for resourceType, Licenses,  keywords is done
  // resourceType: string[];
  // licenses: string[];
  // keywords: string[];
}

export enum SearchParameters {
  institution = 'inst',
  query = 'query',
  page = 'page',
}
