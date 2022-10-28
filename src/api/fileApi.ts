import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';
import { API_PATHS } from '../utils/constants';
import { createResource, postResourceContent } from './resourceApi';
import { Resource, ResourceCreationType } from '../types/resource.types';
import { authenticatedApiRequest } from './api';
import { Content } from '../types/content.types';

export enum FileApiPaths {
  ABORT = '/upload/multipart/uppy/abort',
  COMPLETE = '/upload/multipart/uppy/complete',
  CREATE = '/upload/multipart/uppy/create',
  LIST_PARTS = '/upload/multipart/uppy/listparts',
  PREPARE = '/upload/multipart/uppy/prepare',
}

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const data = encodeURI(`uploadId=${uploadId}&key=${key}`);
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.ABORT}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const data = encodeURI(`uploadId=${uploadId}&key=${key}&parts=${JSON.stringify(parts)}`);
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.COMPLETE}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const data = encodeURI(
    `filename=${file.name}&size=${file.data.size}&lastmodified=${(file.data as File).lastModified}&mimetype=${
      file.data.type
    }`
  );
  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return createMultipartUploadResponse.data;
};

export const createResourceAndMultipartUpload = async (
  file: UppyFile,
  onCreateFile: (newResource: Resource) => void
) => {
  const newResource = await createResource(ResourceCreationType.FILE, file.name);
  newResource.features.dlr_title = newResource.features.dlr_content;
  newResource.contents.masterContent.features.dlr_content_mime_type = file.type;
  const contentId = newResource.contents.masterContent.identifier;
  onCreateFile(newResource);

  const data = encodeURI(
    `filename=${file.name}&size=${file.data.size}&lastmodified=${(file.data as File).lastModified}&mimetype=${
      file.data.type
    }`
  );
  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}/${contentId}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return createMultipartUploadResponse.data;
};

export const listParts = async (uploadId: string, key: string) => {
  const data = encodeURI(`uploadId=${uploadId}&key=${key}`);
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.LIST_PARTS}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const data = encodeURI(`uploadId=${uploadId}&key=${key}&body=${JSON.stringify(body)}&number=${number}`);
  const response = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.PREPARE}`),
    method: 'POST',
    data: data,
  });
  return response.data;
};

export const setContentAsDefaultThumbnail = (resourceIdentifier: string, contentIdentifier: string) => {
  const data = encodeURI(`identifierContent=${contentIdentifier}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/defaults/thumbnail`),
    method: 'POST',
    data,
  });
};

export const setContentAsDefaultContent = (resourceIdentifier: string, contentIdentifier: string) => {
  const data = encodeURI(`identifierContent=${contentIdentifier}`);
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/defaults/default`),
    method: 'POST',
    data,
  });
};

export const setContentAsMasterContent = (resourceIdentifier: string, contentIdentifier: string) => {
  return authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendResourcesPath}/resources/${resourceIdentifier}/contents/${contentIdentifier}/master`
    ),
    method: 'POST',
    data: '',
  });
};

export const createAdditionalFileUpload = async (
  resourceIdentifier: string,
  file: UppyFile,
  onCreateContent: (newContent: Content) => void
) => {
  const responseContent = (await postResourceContent(resourceIdentifier, 'file', file.name)).data;
  responseContent.features.dlr_content_mime_type = file.type;
  onCreateContent(responseContent);
  const data = encodeURI(
    `filename=${file.name}&size=${file.data.size}&lastmodified=${(file.data as File).lastModified}&mimetype=${
      file.data.type
    }`
  );

  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPath}/${responseContent.identifier}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return createMultipartUploadResponse.data;
};
