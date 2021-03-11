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
  resourceTypes: string[];
  licenses: string[];
  keywords: string[];
  queryFromURL: boolean;
  allowSearch: boolean; //instead of setting queryobject null at initiation
  showInaccessible: boolean;
  orderBy: string;
  order: Order;
  mine: boolean;
}

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export const firstResultPage = 1;

export const emptyQueryObject: QueryObject = {
  query: '',
  offset: 0,
  limit: 0,
  institutions: [],
  resourceTypes: [],
  licenses: [],
  keywords: [],
  queryFromURL: false,
  allowSearch: false,
  showInaccessible: false,
  orderBy: 'created',
  order: Order.Desc,
  mine: false,
};

export enum SearchParameters {
  institution = 'inst',
  query = 'query',
  page = 'page',
  limit = 'limit',
  offset = 'offset',
  resourceType = 'type',
}

export enum APISearchParameters {
  FacetInstitution = 'facet_institution::',
  FacetFileType = 'facet_filetype::',
  FacetKeyWords = 'facet_keyword::',
  FacetLicense = 'facet_license::',
  Filter = 'filter',
  FilterSeparator = '|',
  Order = 'order',
  OrderBy = 'order_by',
  Mine = 'mine',
  ShowInaccessible = 'showInaccessible',
}

export const AllDLRInstitutionNames = ['ntnu', 'bi', 'oslomet', 'uib', 'hvl'];
