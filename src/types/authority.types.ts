export interface Authority {
  id: string;
  name: string;
  type: string;
  gender?: string;
  status?: string;
  deleted?: boolean;
}

export interface AuthoritySearchResponse {
  limit: string;
  numFound: number;
  offset: string;
  results: Authority[];
}
