import { Resource, ResourceOwner } from './resource.types';

export interface WorklistRequest {
  identifier: string;
  resourceIdentifier: string;
  submitter: string;
  institution: string;
  submittedDate: string;
  type: WorkListRequestType;
  description: string;
  state: string;
  stateDate: string;
  resource?: Resource;
  resourceOwners?: ResourceOwner[];
}

export enum WorkListRequestType {
  DOIRequest = 'dlr_resource_identifier_doi_request',
  ReportComplaint = 'dlr_resource_complaint',
  Expired = 'dlr_resource_expired',
  OWNERSHIP_REQUEST = 'dlr_resource_owner_request',
}
