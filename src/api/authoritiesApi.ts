import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { Authority, AuthorityResponse, AuthoritySearchResponse } from '../types/authority.types';
import { AxiosResponse } from 'axios';

export const searchAuthorities = (
  query: string,
  offset = 0,
  limit = 10
): Promise<AxiosResponse<AuthoritySearchResponse>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendAuthoritiesPath}/authorities/search?q=${query}&offset=${offset}&limit=${limit}&searchField=textsearch`
    ),
    method: 'GET',
  });
};

export const getAuthoritiesForResourceCreatorOrContributor = async (
  resourceId: string,
  creatorOrContributorId: string
): Promise<Authority[]> => {
  const response: AxiosResponse<AuthorityResponse[]> = await authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceId}/creators/${creatorOrContributorId}/authorities`
    ),
    method: 'GET',
  });
  return response.data.map((element: any) => {
    return {
      id: element.features.dlr_authority_id.replace('=', ''),
      name: element.features.dlr_authority_name,
      type: element.features.dlr_authority_entity_type,
    };
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
