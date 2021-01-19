import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Contributor, Creator, Resource } from '../types/resource.types';
import { AccessTypes, License } from '../types/license.types';
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
  const data = encodeURI(`type=${type}&app=learning&content=${content}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources`),
    method: 'POST',
    data: data,
  });
};

export const deleteResource = async (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}`),
    method: 'DELETE',
  });
};

export const publishResource = (resourceIdentifier: string): Promise<AxiosResponse> => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/publications`,
    method: 'POST',
  });
};

export const postResourceFeature = async (resourceIdentifier: string, feature: string, value: string) => {
  const data = encodeURI(`value=${value}&feature=${feature}`);
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

export const deleteTag = (resourceIdentifier: string, tag: string): Promise<AxiosResponse<any>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags/${tag}/types/tag`),
    method: 'DELETE',
  });
};

export const postTag = (resourceIdentifier: string, tag: string): Promise<AxiosResponse<any>> => {
  const encodedValue = encodeURIComponent(tag);
  const data = `tag=${encodedValue}&type=tag`;
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags`),
    method: 'POST',
    data,
  });
};

export const getResourceContributors = (identifier: string): Promise<AxiosResponse<Contributor[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/contributors`),
    method: 'GET',
  });
};

export const createContributor = (resourceIdentifier: string): Promise<AxiosResponse<Contributor>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contributors`),
    method: 'POST',
  });
};

export const deleteContributor = (
  resourceIdentifier: string,
  contributorIdentifier: string
): Promise<AxiosResponse<any>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contributors/${contributorIdentifier}`
    ),
    method: 'DELETE',
  });
};

export const putContributorFeature = (
  resourceIdentifier: string,
  contributorIdentifier: string,
  feature: string,
  value: string
) => {
  const data = encodeURI(`value=${value}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contributors/${contributorIdentifier}/features/${feature}`
    ),
    method: 'PUT',
    data: data,
  });
};

export const getResourceCreators = (identifier: string): Promise<AxiosResponse<Creator[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/creators`),
    method: 'GET',
  });
};

export const postResourceCreator = (resourceIdentifier: string): Promise<AxiosResponse<Creator>> => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators`,
    method: 'POST',
  });
};

export const deleteResourceCreator = (
  resourceIdentifier: string,
  creatorIdentifier: string
): Promise<AxiosResponse<any>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators/${creatorIdentifier}`
    ),
    method: 'DELETE',
  });
};

export const putResourceCreatorFeature = (
  resourceIdentifier: string,
  creatorIdentifier: string,
  feature: string,
  value: string
): Promise<AxiosResponse<any>> => {
  const data = encodeURI(`value=${value}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators/${creatorIdentifier}/features/${feature}`
    ),
    method: 'PUT',
    data,
  });
};

export const getResourceLicenses = (identifier: string): Promise<AxiosResponse<License[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/licenses`),
    method: 'GET',
  });
};

export const deleteResourceContent = (resourceIdentifier: string, contentIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}`
    ),
    method: 'DELETE',
  });
};

export const getResourceContents = (identifier: string): Promise<AxiosResponse<Content[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/contents`),
    method: 'GET',
  });
};

export const postResourceContent = (
  resourceIdentifier: string,
  type: string,
  content: string
): Promise<AxiosResponse<Content>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents`),
    method: 'POST',
    data: encodeURI(`type=${type}&content=${content}`),
  });
};

export const getLicenses = (): Promise<AxiosResponse<License[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendLicensesPath}/licenses/users/authorized`),
    method: 'GET',
  });
};

export const setResourceLicense = async (resourceIdentifier: string, licenseIdentifier: string) => {
  const data = encodeURI(`identifierLicense=${licenseIdentifier}`);
  await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/licenses`),
    method: 'POST',
    data: data,
  });
};

export const deleteResourceLicense = async (resourceIdentifier: string, licenseIdentifier: string) => {
  await authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/licenses/${licenseIdentifier}`
    ),
    method: 'DELETE',
  });
};

export const updateContentTitle = async (resourceIdentifier: string, contentIdentifier: string, value: string) => {
  const data = encodeURI(`title=${value}`);
  await authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}/titles`
    ),
    method: 'PUT',
    data: data,
  });
};

export const getMyResources = (): Promise<AxiosResponse<Resource[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/owners/users/current`),
    method: 'GET',
  });
};

export const getResourceThumbnailUrl = (identifier: string) => {
  return encodeURI(`${API_PATHS.guiBackendResourcesContentPath}/contents/${identifier}/thumbnails/default`);
};

export const putAccessType = (resourceIdentifier: string, accessType: AccessTypes) => {
  const data = encodeURI(`access=${accessType}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/access`),
    method: 'PUT',
    data,
  });
};
