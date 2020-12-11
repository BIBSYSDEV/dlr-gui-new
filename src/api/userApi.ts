import { API_PATHS } from '../utils/constants';
import Axios, { AxiosResponse } from 'axios';
import { User } from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { authenticatedApiRequest } from './api';

export const getAnonymousWebToken = (): Promise<AxiosResponse<string>> => {
  return Axios({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/anonymous`),
    method: 'GET',
  });
};

export const getUserData = (): Promise<AxiosResponse<User>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendUsersPath}/users/authorized`),
    method: 'GET',
  });
};

export const getTokenExpiry = (token: string): Promise<AxiosResponse<AuthTokenClaims>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendAuthPath}/tokens/jwts/${token}/claims`),
    method: 'GET',
  });
};

export const logout = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/logout`),
    method: 'GET',
  });
};
