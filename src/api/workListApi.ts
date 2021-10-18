import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { AxiosPromise } from 'axios';
import { WorklistRequest } from '../types/Worklist.types';

export const getWorkListItemDOI = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_identifier_doi_request`),
    method: 'GET',
  }) as AxiosPromise<WorklistRequest[]>;
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

export const reportResource = async (resourceId: string, description: string) => {
  const data = encodeURI(`dlr_resource_complaint_description=${description}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesFeedbacksPath}/feedbacks/resources/${resourceId}/complaints`),
    method: 'POST',
    data,
  }) as AxiosPromise<string>;
};

export const getWorkListReports = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint`),
    method: 'GET',
  }) as AxiosPromise<WorklistRequest[]>;
};

export const refuseComplaintReport = (workListIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint/items/${workListIdentifier}/completion`
    ),
    method: 'POST',
  });
};

export const getWorkListItemsExpired = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_expired`),
    method: 'GET',
  }) as AxiosPromise<WorklistRequest[]>;
};

export const getWorkListItemsOwnership = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_owner_request`),
    method: 'GET',
  }) as AxiosPromise<WorklistRequest[]>;
};

export const refuseOwnershipRequest = (resourceIdentifier: string, comment: string) => {
  const data = encodeURI(`comment=${comment}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/owners/requests/current/refusals`
    ),
    method: 'POST',
    data: data,
  });
};

export const approveOwnershipRequest = (resourceIdentifier: string, newOwnerId: string) => {
  const data = encodeURI(`subject=${newOwnerId}`);
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/owners/requests/current/approvals`
    ),
    method: 'POST',
    data: data,
  });
};

export const requestOwnershipFromCurator = (resourceIdentifier: string, comment: string) => {
  const data = encodeURI(`comment=${comment}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/owners/requests`),
    method: 'POST',
    data: data,
  });
};
