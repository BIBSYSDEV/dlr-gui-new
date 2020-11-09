import constants from '../utils/constants';
import { setAxiosDefaults } from '../utils/axios-config';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { SearchResult } from '../types/search.types';
import { Resource, Contributor, Creator } from '../types/resource.types';
import { License } from '../types/license.types';
import { Content } from '../types/content.types';

setAxiosDefaults();

export const authenticatedApiRequest = (axiosRequestConfig: AxiosRequestConfig) => {
  const idToken = localStorage.token;
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };
  return Axios(axiosRequestConfig);
};

export const getAnonymousWebToken = (): Promise<AxiosResponse<string>> => {
  return Axios({
    url: `${constants.guiBackendLoginPath}/anonymous`,
    method: 'GET',
  });
};

export const searchResources = (query: string): Promise<AxiosResponse<SearchResult>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesSearchPath}/resources/search?query=${query}`),
    method: 'GET',
  });
};

export const getUserData = (): Promise<AxiosResponse<User>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendUsersPath}/users/authorized`),
    method: 'GET',
  });
};

export const getTokenExpiry = (token: string): Promise<AxiosResponse<AuthTokenClaims>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendAuthPath}/tokens/jwts/${token}/claims`),
    method: 'GET',
  });
};

export const logout = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendLoginPath}/logout`),
    method: 'GET',
  });
};

export const postResource = (type: string, content: string) => {
  //TODO: helst kunne poste som JSON
  const data = `type=${type}&app=learning&content=${content}`;
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources`),
    method: 'POST',
    headers: {},
    data: data,
  });
};

export const postResourceFeature = async (resourceIdentifier: string, feature: string, value: string) => {
  const encodedValue = encodeURIComponent(value);
  const data = `value=${encodedValue}&feature=${feature}`;
  await authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${resourceIdentifier}/features`),
    method: 'POST',
    headers: {},
    data: data,
  });
};

export const getResource = (identifier: string): Promise<AxiosResponse<Resource>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}`),
    method: 'GET',
  });
};

export const getResourceDefaults = (identifier: string): Promise<AxiosResponse<Resource>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendDefaultsPath}/resources/${identifier}`),
    method: 'GET',
  });
};

export const getResourceTags = (identifier: string): Promise<AxiosResponse<string[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}/tags/types/tag`),
    method: 'GET',
  });
};

export const getResourceContributors = (identifier: string): Promise<AxiosResponse<Contributor[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}/contributors`),
    method: 'GET',
  });
};

export const getResourceCreators = (identifier: string): Promise<AxiosResponse<Creator[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}/creators`),
    method: 'GET',
  });
};

export const getResourceLicenses = (identifier: string): Promise<AxiosResponse<License[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}/licenses`),
    method: 'GET',
  });
};

export const getResourceContents = (identifier: string): Promise<AxiosResponse<Content[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${constants.guiBackendResourcesPath}/resources/${identifier}/contents`),
    method: 'GET',
  });
};
