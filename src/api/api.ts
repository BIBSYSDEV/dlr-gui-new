import constants from '../utils/constants';
import { setAxiosDefaults } from '../utils/axios-config';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { SearchResult } from '../types/search.types';

setAxiosDefaults();

export const authenticatedApiRequest = (axiosRequestConfig: AxiosRequestConfig) => {
  let idToken = localStorage.token;
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
