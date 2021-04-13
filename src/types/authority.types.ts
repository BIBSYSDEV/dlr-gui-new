export interface Authority {
  id: string;
  name: string;
  type: string;
  gender?: string;
  status?: string;
  deleted?: boolean;
  dlrIdentifier?: string;
}

export interface AuthoritySearchResponse {
  limit: string;
  numFound: number;
  offset: string;
  results: Authority[];
}
export interface AuthorityResponse {
  identifier: string;
  features: AuthorityFeatures;
}
interface AuthorityFeatures {
  dlr_authority?: boolean;
  dlr_authority_entity_type: string;
  dlr_authority_id: string;
  dlr_authority_identifier?: string;
  dlr_authority_name: string;
  dlr_authority_time_created?: string;
}

export const DefaultAuthoritySearchLength = 10;
export const DefaultAuthoritySearchOffset = 0;
