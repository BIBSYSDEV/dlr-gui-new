import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';
import { API_PATHS } from '../utils/constants';
import { createResource } from './resourceApi';
import { setAxiosDefaults } from '../utils/axios-config';
import { ResourceCreationType } from '../types/resource.types';
import { authenticatedApiRequest } from './api';

setAxiosDefaults();

export enum FileApiPaths {
  ABORT = '/upload/multipart/uppy/abort',
  COMPLETE = '/upload/multipart/uppy/complete',
  CREATE_NEW = '/upload/multipart/uppy/create',
  CREATE = '/{contentIdentifier}/upload/multipart/uppy/create ',
  LIST_PARTS = '/upload/multipart/uppy/listparts',
  PREPARE = '/upload/multipart/uppy/prepare',
}

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const data = `uploadId=${uploadId}&key=${key}`;
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.ABORT}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const data = `uploadId=${uploadId}&key=${key}&parts=${parts}`;
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.COMPLETE}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const data = `filename=${file.name}&size=${file.data.size}&lastmodified=${
    (file.data as File).lastModified
  }&mimetype=${file.data.type}`;
  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return createMultipartUploadResponse.data;
};

export interface createResourceAndMultipartUploadResponseType {
  resourceIdentifier: string;
  data: any;
}

export const createResourceAndMultipartUpload = async (file: UppyFile) => {
  const createResourceResponse = await createResource(ResourceCreationType.FILE, file.name);
  const data = `filename=${file.name}&size=${file.data.size}&lastmodified=${
    (file.data as File).lastModified
  }&mimetype=${file.data.type}&identifier=${createResourceResponse.data.identifier}`;
  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return { resourceIdentifier: createResourceResponse.data.identifier, data: createMultipartUploadResponse.data };
};

export const listParts = async (uploadId: string, key: string) => {
  const data = `uploadId=${uploadId}&key=${key}`;
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.LIST_PARTS}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const data = `uploadId=${uploadId}&key=${key}&body=${JSON.stringify(body)}&number=${number}`;
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.PREPARE}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};
