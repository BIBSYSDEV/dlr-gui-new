export interface SearchResult {
  offset: string;
  limit: string;
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
  tags: string[];
  tagFilterOperator: SearchQueryBooleanOperator;
  showInaccessible: boolean;
  orderBy: string;
  order: Order;
  mine: boolean;
  creators?: string[];
}

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export enum SearchQueryBooleanOperator {
  OR = 'or',
  AND = 'and',
}

export const firstResultPage = 1;

export const emptyQueryObject: QueryObject = {
  query: '',
  offset: 0,
  limit: 0,
  institutions: [],
  resourceTypes: [],
  licenses: [],
  tags: [],
  tagFilterOperator: SearchQueryBooleanOperator.OR,
  showInaccessible: false,
  orderBy: 'created',
  order: Order.Desc,
  mine: false,
};

export enum SearchParameters {
  creator = 'creator',
  institution = 'inst',
  tag = 'tag',
  tagFilterOperator = 'tagFilterOperator',
  query = 'query',
  page = 'page',
  limit = 'limit',
  license = 'license',
  offset = 'offset',
  resourceType = 'type',
  showInaccessible = 'showinaccess',
}
export interface FacetResponse {
  numFound: number;
  queryTime: number;
  facet_counts: FacetCount[];
}

interface FacetCount {
  count: string;
  value: string;
  type: FacetType;
}

export enum FacetType {
  dlrFiletype = 'dlr_filetype',
  dlrInstitutionId = 'dlr_institution_id',
  dlrRightsLicenseName = 'dlr_rights_license_name',
}

export const AllDLRInstitutionNames = ['ntnu', 'bi', 'oslomet', 'uib', 'hvl'];
