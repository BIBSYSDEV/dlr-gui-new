import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { WorklistDOIRequest } from '../types/Worklist.types';

export const getWorkListItemDOI = (): Promise<AxiosResponse<WorklistDOIRequest[]>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_identifier_doi_request`),
    method: 'GET',
  });
};

export const refuseDoiRequest = (resourceIdentifier: string, comment: string) => {
  const data = encodeURI(`comment=${comment}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/identifiers/doi/requests/current/refusals`
    ),
    method: 'POST',
    data: data,
  });
};

export const createDOI = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/identifiers/doi/requests/current/approvals`
    ),
    method: 'POST',
  });
};

//api call for editors to request curators attention:
export const requestDOIFromCurator = (resourceIdentifier: string, comment: string) => {
  const data = encodeURI(`comment=${comment}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/identifiers/doi/requests`),
    method: 'POST',
    data: data,
  });
};
