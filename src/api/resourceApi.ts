import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import {
  Contributor,
  Creator,
  Resource,
  ResourceContents,
  ResourceCreationType,
  ResourceEvent,
} from '../types/resource.types';
import { AccessTypes, License } from '../types/license.types';
import { Content, emptyResourceContent, LinkMetadataFilename } from '../types/content.types';
import { authenticatedApiRequest } from './api';
import { QueryObject, SearchParameters, SearchResult } from '../types/search.types';

export const searchResources = ({
  query,
  limit,
  institutions,
  resourceType,
  licenses,
  keywords,
  offset,
}: QueryObject): Promise<AxiosResponse<SearchResult>> => {
  let url = `${API_PATHS.guiBackendResourcesSearchPath}/resources/search?query=${query}`;
  if (
    (institutions && institutions.length > 0) ||
    resourceType.length > 0 ||
    licenses.length > 0 ||
    keywords.length > 0
  ) {
    url += '&filter=';
    const filters: string[] = [];
    if (institutions.length > 1) {
      filters.push(`facet_institution::(${institutions.join(' OR ')})`);
    } else if (institutions.length === 1) {
      filters.push(`facet_institution::${institutions[0]}`);
    }
    if (resourceType.length > 1) {
      filters.push(`facet_filetype::(${resourceType.join(' OR ')})`);
    } else if (resourceType.length === 1) {
      filters.push(`facet_filetype::${resourceType[0]}`);
    }
    if (licenses.length > 1) {
      filters.push(`facet_license::(${licenses.join(' OR ')})`);
    } else if (licenses.length === 1) {
      filters.push(`facet_license::${licenses[0]}`);
    }
    if (keywords.length > 1) {
      filters.push(`facet_keyword::(${keywords.join(' OR ')})`);
    } else if (keywords.length === 1) {
      filters.push(`facet_keyword::${keywords[0]}`);
    }
    if (filters.length > 0) {
      url += filters.join('|');
    }
  }
  if (offset > 0) url += `&${SearchParameters.offset}=${offset}`;
  if (limit > 0) url += `&${SearchParameters.limit}=${limit}`;
  return authenticatedApiRequest({
    url: encodeURI(url),
    method: 'GET',
  });
};

export const createResource = async (type: string, content: string): Promise<Resource> => {
  const data = encodeURI(`type=${type}&app=learning&content=${content}`);
  const apiResourceResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources`),
    method: 'POST',
    data: data,
  });
  const resource = apiResourceResponse.data;
  const resourceContents: Content[] = resource.contents;
  resource.contents = { additionalContent: [] };
  resourceContents.forEach((content) => {
    if (content.features.dlr_content_master === 'true') {
      resource.contents.masterContent = content;
      resource.contents.masterContent.features.dlr_content_title = content.features.dlr_content;
    } else if (content.features.dlr_content !== LinkMetadataFilename) {
      resource.contents.additionalContent.push(content);
    }
  });
  return resource;
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

export const deleteTag = (resourceIdentifier: string, tag: string): Promise<AxiosResponse> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags/${tag}/types/tag`),
    method: 'DELETE',
  });
};

export const postTag = (resourceIdentifier: string, tag: string): Promise<AxiosResponse> => {
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
): Promise<AxiosResponse> => {
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
): Promise<AxiosResponse> => {
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
): Promise<AxiosResponse> => {
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

export const getResourceContents = async (identifier: string): Promise<ResourceContents> => {
  const contentResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${identifier}/contents`),
    method: 'GET',
  });
  const resourceContent: ResourceContents = emptyResourceContent;
  contentResponse.data.forEach((content: Content) => {
    if (content.features.dlr_content_master === 'true') {
      resourceContent.masterContent = content;
      if (
        !content.features.dlr_content_title &&
        content.features.dlr_content &&
        content.features.dlr_content_type === ResourceCreationType.LINK
      ) {
        resourceContent.masterContent.features.dlr_content_title = content.features.dlr_content;
      }
    } else if (content.features.dlr_content !== LinkMetadataFilename) {
      resourceContent.additionalContent.push(content);
    }
  });
  return resourceContent;
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

export const getContentById = (
  resourceIdentifier: string,
  contentIdentifier: string
): Promise<AxiosResponse<Content>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}`
    ),
    method: 'GET',
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

export const getResourceContentEvent = (contentIdentifier: string): Promise<AxiosResponse<ResourceEvent>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesEventsPath}/resources/${contentIdentifier}/events`),
    method: 'GET',
  });
};

export const getAllFacets = (): Promise<AxiosResponse<ResourceEvent>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesSearchPath}/resources/facets`),
    method: 'GET',
  });
};
