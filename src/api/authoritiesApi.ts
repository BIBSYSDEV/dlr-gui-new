import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { Authority, AuthoritySearchResponse } from '../types/authority.types';
import { AxiosResponse } from 'axios';

/*
offset: 0
limit: 10
contributorType: enten contributorType som man velger i dropdownen eller "creator"
 */
export const searchAuthorities = (
  query: string,
  contributorType: string,
  offset = 0,
  limit = 10
): Promise<AxiosResponse<AuthoritySearchResponse>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendAuthoritiesPath}/authorities/search?q=${query}&offset=${offset}&limit=${limit}&contributorType=${contributorType}&searchField=textsearch`
    ),
    method: 'GET',
  });
};

export const getAuthoritiesForResourceCreatorOrContributor = (resourceId: string, creatorOrContributorId: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceId}/creators/${creatorOrContributorId}/authorities`
    ),
    method: 'GET',
  });
};

export const postAuthorityForResourceCreatorOrContributor = (
  resourceId: string,
  creatorOrContributorId: string,
  authority: Authority
) => {
  let data = encodeURI(
    `dlr_authority_id==${authority.id}&dlr_authority_name=${authority.name}&dlr_authority_entity_type=${authority.type}`
  );
  if (authority.gender) {
    data += `&dlr_authority_gender=${authority.gender}`;
  }
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceId}/creators/${creatorOrContributorId}/authorities`
    ),
    method: 'POST',
    data,
  });
};

export const putAuthorityForResourceCreatorOrContributor = (
  resourceId: string,
  creatorOrContributorId: string,
  authority: Authority
) => {
  let data = encodeURI(
    `dlr_authority_id==${authority.id}&dlr_authority_name=${authority.name}&dlr_authority_entity_type=${authority.type}`
  );
  if (authority.gender) {
    data += `&dlr_authority_gender=${authority.gender}`;
  }
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceId}/creators/${creatorOrContributorId}/authorities`
    ),
    method: 'PUT',
    data,
  });
};
