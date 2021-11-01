import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { AxiosPromise } from 'axios';
import { WorklistRequest } from '../types/Worklist.types';

export const getWorkListItemDOI = (): AxiosPromise<WorklistRequest[]> => {
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

export const reportResource = (resourceId: string, description: string): AxiosPromise<string> => {
  const data = encodeURI(`dlr_resource_complaint_description=${description}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesFeedbacksPath}/feedbacks/resources/${resourceId}/complaints`),
    method: 'POST',
    data,
  });
};

export const getWorkListReports = (): AxiosPromise<WorklistRequest[]> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint`),
    method: 'GET',
  });
};

export const refuseComplaintReport = (workListIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint/items/${workListIdentifier}/completion`
    ),
    method: 'POST',
  });
};

export const getWorkListItemsExpired = (): AxiosPromise<WorklistRequest[]> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_expired`),
    method: 'GET',
  });
};

export const getWorkListItemsOwnership = (): AxiosPromise<WorklistRequest[]> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_owner_request`),
    method: 'GET',
  });
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
