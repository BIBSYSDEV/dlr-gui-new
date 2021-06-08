import { Resource } from './resource.types';

export interface WorklistDOIRequest {
  identifier: string;
  resourceIdentifier: string;
  submitter: string;
  institution: string;
  submittedDate: string;
  type: WorklistDOIRequestType;
  description: string;
  state: string;
  stateDate: string;
  resource?: Resource;
}

export enum WorklistDOIRequestType {
  DOIRequest = 'dlr_resource_identifier_doi_request',
}
