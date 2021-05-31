import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';
import { InstitutionProfilesNames, institutionUser } from '../types/user.types';

export const getInstitutionAuthorizations = (
  accessProfile: InstitutionProfilesNames
): Promise<AxiosResponse<string[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/${accessProfile}`
    ),
    method: 'GET',
  });
};

export const getRolesForInstitutionUser = (email: string): Promise<AxiosResponse<institutionUser>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${email}`
    ),
    method: 'GET',
  });
};
export const setRoleForInstitutionUser = (
  email: string,
  accessProfile: string
): Promise<AxiosResponse<institutionUser>> => {
  const data = encodeURI(`user=${email}&accessProfile=${accessProfile}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations`),
    method: 'POST',
    data,
  });
};
export const removeRoleForInstitutionUser = (
  email: string,
  accessProfile: string
): Promise<AxiosResponse<institutionUser>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${email}/accessProfiles/${accessProfile}`
    ),
    method: 'DELETE',
  });
};
