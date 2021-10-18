import { API_PATHS } from '../utils/constants';
import { AxiosPromise } from 'axios';
import { authenticatedApiRequest } from './api';
import { InstitutionProfilesNames, institutionUser } from '../types/user.types';

export const getInstitutionAuthorizations = (accessProfile: InstitutionProfilesNames): AxiosPromise<string[]> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/${accessProfile}`
    ),
    method: 'GET',
  }) as AxiosPromise<string[]>;
};

export const getRolesForInstitutionUser = (email: string): AxiosPromise<institutionUser> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${email}`
    ),
    method: 'GET',
  }) as AxiosPromise<institutionUser>;
};
export const setRoleForInstitutionUser = (email: string, accessProfile: string): AxiosPromise<institutionUser> => {
  const data = encodeURI(`user=${email}&accessProfile=${accessProfile}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations`),
    method: 'POST',
    data,
  }) as AxiosPromise<institutionUser>;
};
export const removeRoleForInstitutionUser = (email: string, accessProfile: string): AxiosPromise<institutionUser> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${email}/accessProfiles/${accessProfile}`
    ),
    method: 'DELETE',
  }) as AxiosPromise<institutionUser>;
};
