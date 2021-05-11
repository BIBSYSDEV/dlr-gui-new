import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';
import { InstitutionProfilesNames, User } from '../types/user.types';

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

export const getRolesForUser = (email: string): Promise<AxiosResponse<User>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${email}`
    ),
    method: 'GET',
  });
};
