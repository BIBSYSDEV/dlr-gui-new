import { Resource } from './resource.types';

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
}

export enum WorkListRequestType {
  DOIRequest = 'dlr_resource_identifier_doi_request',
  ReportComplaint = 'dlr_resource_complaint',
  Expired = 'dlr_resource_expired',
}
