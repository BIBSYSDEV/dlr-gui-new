import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';

export enum DLR_Institution_Roles {
  Administrator = 'dlr_institution_administrator',
  Curator = 'dlr_institution_curator',
  Editor = 'dlr_institution_editor',
}

export const getInstitutionAuthorizations = (accessProfile: DLR_Institution_Roles): Promise<AxiosResponse<any>> => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/${accessProfile}`
    ),
    method: 'GET',
  });
};
