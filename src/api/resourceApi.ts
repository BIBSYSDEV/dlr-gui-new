import { API_PATHS } from '../utils/constants';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import {
  Contributor,
  Creator,
  VMSResource,
  Resource,
  ResourceContents,
  ResourceCreationType,
  ResourceEvent,
  ResourceOwner,
  ResourceStatistic,
  UserAuthorizationProfileForResource,
} from '../types/resource.types';
import { AccessTypes, License } from '../types/license.types';
import { Content, emptyResourceContent, LinkMetadataFilename } from '../types/content.types';
import { authenticatedApiRequest } from './api';
import { FacetResponse, QueryObject, SearchParameters, SearchResult } from '../types/search.types';
import { ResourceAuthorization, ResourceAuthorizationProfilesName } from '../types/user.types';

enum APISearchParameters {
  FacetInstitution = 'facet_institution::',
  FacetFileType = 'facet_filetype::',
  FacetTag = 'facet_tag::',
  FacetLicense = 'facet_license::',
  FacetCreator = 'facet_creator::',
  Filter = 'filter',
  FilterSeparator = '|',
  Order = 'order',
  OrderBy = 'order_by',
  Mine = 'mine',
  ShowInaccessible = 'showInaccessible',
}

export const searchResources = ({
  query,
  limit,
  institutions,
  resourceTypes,
  licenses,
  tags,
  tagFilterOperator,
  offset,
  order,
  orderBy,
  showInaccessible,
  mine,
  creators,
}: QueryObject): AxiosPromise<SearchResult> => {
  let url = `${API_PATHS.guiBackendResourcesSearchPath}/resources/search/advanced?query=${query}`;
  if (
    institutions.length > 0 ||
    resourceTypes.length > 0 ||
    licenses.length > 0 ||
    tags.length > 0 ||
    (creators && creators.length > 0)
  ) {
    url += `&${APISearchParameters.Filter}=`;
    const filters: string[] = [];
    institutions.map((institution) => filters.push(APISearchParameters.FacetInstitution + institution));
    resourceTypes.map((resourceType) => filters.push(APISearchParameters.FacetFileType + resourceType));
    licenses.map((license) => filters.push(APISearchParameters.FacetLicense + license));
    tags.map((tag) => filters.push(APISearchParameters.FacetTag + tag));
    creators?.map((creator) => filters.push(APISearchParameters.FacetCreator + creator));
    if (filters.length > 0) {
      url += filters.join(APISearchParameters.FilterSeparator);
    }
  }
  url += `&${APISearchParameters.Mine}=${mine}&${APISearchParameters.ShowInaccessible}=${showInaccessible}&${APISearchParameters.OrderBy}=${orderBy}&${APISearchParameters.Order}=${order}`;
  if (offset > 0) url += `&${SearchParameters.offset}=${offset}`;
  if (limit > 0) url += `&${SearchParameters.limit}=${limit}`;
  url += `&${SearchParameters.tagFilterOperator}=${tagFilterOperator}`;
  return authenticatedApiRequest({
    url: encodeURI(url),
    method: 'GET',
  }) as AxiosPromise<SearchResult>;
};

export const createResource = async (type: string, content: string): Promise<Resource> => {
  const data = encodeURI(`type=${type}&app=learning&content=${content}`);
  const apiResourceResponse = await (authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources`),
    method: 'POST',
    data: data,
  }) as AxiosPromise<any>);
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

export const publishResource = (resourceIdentifier: string) => {
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

export const getResource = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}`),
    method: 'GET',
  }) as AxiosPromise<Resource>;
};

export const getResourceDefaults = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendDefaultsPath}/resources/${resourceIdentifier}`),
    method: 'GET',
  }) as AxiosPromise<Resource>;
};

export const updateSearchIndex = (resourceIdentifier: string) => {
  authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/searchindexing`,
    method: 'PUT',
  });
};

export const getResourceTags = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags/types/tag`),
    method: 'GET',
  }) as AxiosPromise<string[]>;
};

export const deleteTag = (resourceIdentifier: string, tag: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags/${tag}/types/tag`),
    method: 'DELETE',
  });
};

export const postTag = (resourceIdentifier: string, tag: string) => {
  const encodedValue = encodeURIComponent(tag);
  const data = `tag=${encodedValue}&type=tag`;
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/tags`),
    method: 'POST',
    data,
  });
};

export const getResourceContributors = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contributors`),
    method: 'GET',
  }) as AxiosPromise<Contributor[]>;
};

export const createContributor = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contributors`),
    method: 'POST',
  }) as AxiosPromise<Contributor>;
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

export const getResourceCreators = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators`),
    method: 'GET',
  }) as AxiosPromise<Creator[]>;
};

export const postResourceCreator = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators`,
    method: 'POST',
  }) as AxiosPromise<Creator>;
};

export const deleteResourceCreator = (resourceIdentifier: string, creatorIdentifier: string) => {
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
) => {
  const data = encodeURI(`value=${value}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/creators/${creatorIdentifier}/features/${feature}`
    ),
    method: 'PUT',
    data,
  });
};

export const getResourceLicenses = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/licenses`),
    method: 'GET',
  }) as AxiosPromise<License[]>;
};

export const deleteResourceContent = (resourceIdentifier: string, contentIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}`
    ),
    method: 'DELETE',
  });
};

export const getResourceContents = async (resourceIdentifier: string): Promise<ResourceContents> => {
  const contentResponse = await (authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents`),
    method: 'GET',
  }) as AxiosPromise<Content[]>);
  const resourceContent: ResourceContents = emptyResourceContent;
  resourceContent.additionalContent = [];
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

export const postResourceContent = (resourceIdentifier: string, type: string, content: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents`),
    method: 'POST',
    data: encodeURI(`type=${type}&content=${content}`),
  }) as AxiosPromise<Content>;
};

export const getLicenses = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendLicensesPath}/licenses/users/authorized`),
    method: 'GET',
  }) as AxiosPromise<License[]>;
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

export const getContentById = (resourceIdentifier: string, contentIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}`
    ),
    method: 'GET',
  }) as AxiosPromise<Content>;
};

export const getContentPresentationData = (contentIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}/${contentIdentifier}`),
    method: 'GET',
  }) as AxiosPromise<Content>;
};

export const getMyResources = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/owners/users/current`),
    method: 'GET',
  }) as AxiosPromise<Resource[]>;
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
  }) as AxiosPromise<ResourceEvent>;
};

export const getAllFacets = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesSearchPath}/resources/facets`),
    method: 'GET',
  }) as AxiosPromise<FacetResponse>;
};

export const getResourceDefaultContent = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourceDefaultContentPath}/${resourceIdentifier}/contents/default`),
    method: 'GET',
  }) as AxiosPromise<Content>;
};

export const searchTags = (query: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesSearchPath}/suggestions/tags?prefix=${query}`),
    method: 'GET',
  }) as AxiosPromise<FacetResponse>;
};

export const getCitationFromCrossCite = (dlr_identifier_doi: string) => {
  return axios({
    headers: { Accept: 'text/x-bibliography; style=apa-6th-edition; locale=en-GB' },
    url: dlr_identifier_doi,
    method: 'GET',
  }) as AxiosPromise<string>;
};

export const getTextFileContents = (url: string): Promise<AxiosResponse<string>> => {
  return axios.get(url);
};

export const getResourceViews = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesStatisticsPath}/statistics/resources/${resourceIdentifier}`),
    method: 'GET',
  }) as AxiosPromise<ResourceStatistic>;
};

export const getMyUserAuthorizationProfileForResource = async (
  resourceIdentifier: string
): Promise<UserAuthorizationProfileForResource> => {
  const authorizationProfiles = (
    await (authenticatedApiRequest({
      url: encodeURI(
        `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/authorizations/users/authorized`
      ),
    }) as AxiosPromise<ResourceAuthorization>)
  ).data;
  return {
    isAdmin: authorizationProfiles.profiles.some((profile) => profile.name === ResourceAuthorizationProfilesName.ADMIN),
    isConsumerPublic: authorizationProfiles.profiles.some(
      (profile) => profile.name === ResourceAuthorizationProfilesName.CONSUMER_PUBLIC
    ),
    isCurator: authorizationProfiles.profiles.some(
      (profile) => profile.name === ResourceAuthorizationProfilesName.CURATOR
    ),
    isEditor: authorizationProfiles.profiles.some(
      (profile) => profile.name === ResourceAuthorizationProfilesName.EDITOR
    ),
    isOwner: authorizationProfiles.profiles.some((profile) => profile.name === ResourceAuthorizationProfilesName.OWNER),
    isConsumer: authorizationProfiles.profiles.some(
      (profile) => profile.name === ResourceAuthorizationProfilesName.CONSUMER
    ),
  };
};

export const getMyKalturaResources = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendKalturaPath}/kaltura/presentations`),
    method: 'GET',
  }) as AxiosPromise<VMSResource[]>;
};
export const getMyPanoptoResources = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendPanoptoPath}/panopto/presentations`),
    method: 'GET',
  }) as AxiosPromise<VMSResource[]>;
};

export const getResourceOwners = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/owners`),
    method: 'GET',
  }) as AxiosPromise<ResourceOwner[]>;
};
export const postKalturaPresentationImport = (resource: Resource, kalturaResource: VMSResource) => {
  const data = encodeURI(
    `identifier=${resource.identifier}&identifierContent=${resource.contents.masterContent.identifier}&kalturaPresentationId=${kalturaResource.id}&downloadUrl=${kalturaResource.downloadUrl}&title=${kalturaResource.title}`
  );
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendKalturaPath}/kaltura/presentations/import`),
    method: 'POST',
    data: data,
  });
};

export const postPanoptoPresentationImport = (resource: Resource, panoptoResource: VMSResource) => {
  const data = encodeURI(
    `identifier=${resource.identifier}&identifierContent=${resource.contents.masterContent.identifier}&panoptoPresentationId=${panoptoResource.id}&url=${panoptoResource.url}&title=${panoptoResource.title}`
  );
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendPanoptoPath}/panopto/presentations/import`),
    method: 'POST',
    data: data,
  });
};
