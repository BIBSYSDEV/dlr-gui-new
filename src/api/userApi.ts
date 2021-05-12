import { API_PATHS } from '../utils/constants';
import Axios, { AxiosResponse } from 'axios';
import {
  emptyInstitutionAuthorities,
  InstitutionAuthorities,
  InstitutionProfilesNames,
  User,
  UserRoleFromInstitution,
} from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { authenticatedApiRequest } from './api';
import axios from 'axios';

export const getAnonymousWebToken = (): Promise<AxiosResponse<string>> => {
  return Axios({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/anonymous`),
    method: 'GET',
  });
};

export const getUserData = (idToken: string | undefined | boolean = false): Promise<AxiosResponse<User>> => {
  if (!idToken) {
    return authenticatedApiRequest({
      url: encodeURI(`${API_PATHS.guiBackendUsersPath}/users/authorized`),
      method: 'GET',
    });
  } else {
    return axios({
      method: 'GET',
      url: `${API_PATHS.guiBackendUsersPath}/users/authorized`,
      headers: { Authorization: `Bearer ${idToken}` },
    });
  }
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

export const getUserAuthorizationsInstitution = async (
  idToken: string | undefined | boolean = false
): Promise<InstitutionAuthorities> => {
  let apiResponse: AxiosResponse<UserRoleFromInstitution>;
  if (idToken) {
    apiResponse = await axios({
      url: encodeURI(
        `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/institutions/current`
      ),
      method: 'GET',
      headers: { Authorization: `Bearer ${idToken}` },
    });
  } else {
    apiResponse = await authenticatedApiRequest({
      url: encodeURI(
        `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/institutions/current`
      ),
      method: 'GET',
    });
  }

  const institutionAuthorities = { ...emptyInstitutionAuthorities };
  apiResponse.data.profiles.forEach((profile) => {
    switch (profile.name) {
      case InstitutionProfilesNames.curator:
        institutionAuthorities.isCurator = true;
        break;
      case InstitutionProfilesNames.administrator:
        institutionAuthorities.isAdministrator = true;
        break;
      case InstitutionProfilesNames.editor:
        institutionAuthorities.isEditor = true;
        break;
      case InstitutionProfilesNames.publisher:
        institutionAuthorities.isPublisher = true;
        break;
      default:
        break;
    }
  });

  return institutionAuthorities;
};
