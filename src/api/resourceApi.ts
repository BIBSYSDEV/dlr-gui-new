import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Contributor, Creator, Resource } from '../types/resource.types';
import { License } from '../types/license.types';
import { Content } from '../types/content.types';
import { authenticatedApiRequest } from './api';
import { SearchResult } from '../types/search.types';

export const searchResources = (query: string): Promise<AxiosResponse<SearchResult>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesSearchPath}/resources/search?query=${query}`),
    method: 'GET',
  });
};

export const createResource = (type: string, content: string) => {
  const data = `type=${type}&app=learning&content=${content}`;
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources`),
    method: 'POST',
    data: data,
  });
};

export const postResourceFeature = async (resourceIdentifier: string, feature: string, value: string) => {
  const encodedValue = encodeURIComponent(value);
  const data = `value=${encodedValue}&feature=${feature}`;
  await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/features`),
    method: 'POST',
    data: data,
  });
};

export const getResource = (identifier: string): Promise<AxiosResponse<Resource>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}`),
    method: 'GET',
  });
};

export const getResourceDefaults = (identifier: string): Promise<AxiosResponse<Resource>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendDefaultsPath}/resources/${identifier}`),
    method: 'GET',
  });
};

export const getResourceTags = (identifier: string): Promise<AxiosResponse<string[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/tags/types/tag`),
    method: 'GET',
  });
};

export const getResourceContributors = (identifier: string): Promise<AxiosResponse<Contributor[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/contributors`),
    method: 'GET',
  });
};

export const getResourceCreators = (identifier: string): Promise<AxiosResponse<Creator[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/creators`),
    method: 'GET',
  });
};

export const getResourceLicenses = (identifier: string): Promise<AxiosResponse<License[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/licenses`),
    method: 'GET',
  });
};

export const getResourceContents = (identifier: string): Promise<AxiosResponse<Content[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/contents`),
    method: 'GET',
  });
};

export const getMyResources = (): Promise<AxiosResponse<Resource[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/owners/users/current`),
    method: 'GET',
  });
};
