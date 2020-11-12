import Axios from 'axios';
import { AwsS3Part } from '@uppy/aws-s3-multipart';
import { UppyFile } from '@uppy/core';
import i18n from '../translations/i18n';
import { StatusCode } from '../utils/constants';

import { API_PATHS } from '../utils/constants';
import { createResource } from './resourceApi';
import { setAxiosDefaults } from '../utils/axios-config';
import { ResourceCreationType } from '../types/resource.types';
import { authenticatedApiRequest } from './api';

setAxiosDefaults();

export enum FileApiPaths {
  ABORT = '/contents/upload/multipart/uppy/abort',
  COMPLETE = '/contents/upload/multipart/uppy/complete',
  CREATE = '/contents/upload/multipart/uppy/create',
  DOWNLOAD = '/download',
  LIST_PARTS = '/contents/upload/multipart/uppy/listparts',
  PREPARE = '/contents/upload/multipart/uppy/prepare',
}

export const downloadFile = async (registrationId: string, fileId: string) => {
  const url = `${FileApiPaths.DOWNLOAD}/${registrationId}/files/${fileId}`;
  try {
    const idToken = localStorage.token;
    const response = await Axios.get(url, { headers: { Authorization: `Bearer ${idToken}` } });
    if (response.status === StatusCode.OK) {
      return response.data.presignedDownloadUrl;
    } else {
      return { error: i18n.t('feedback:error.download_file') };
    }
  } catch {
    return { error: i18n.t('feedback:error.download_file') };
  }
};

export const abortMultipartUpload = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  }; //TODO: convert to params

  const idToken = localStorage.token;
  const response = await Axios.post(FileApiPaths.ABORT, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

export const completeMultipartUpload = async (uploadId: string, key: string, parts: AwsS3Part[]) => {
  const payload = {
    uploadId,
    key,
    parts,
  }; //TODO: convert to params

  const idToken = localStorage.token;
  const response = await Axios.post(FileApiPaths.COMPLETE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
export const createMultipartUpload = async (file: UppyFile) => {
  const createResourceResponse = await createResource(ResourceCreationType.FILE, file.name);

  const data = `filename=${file.name}&size=${file.data.size}&lastmodified=${
    (file.data as File).lastModified
  }&mimetype=${file.data.type}&identifier=${createResourceResponse.data.identifier}`;

  const createMultipartUploadResponse = await authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendResourcesContentPathVersion2}${FileApiPaths.CREATE}`),
    method: 'POST',
    data: data,
  });
  return createMultipartUploadResponse.data;
};

export const listParts = async (uploadId: string, key: string) => {
  const payload = {
    uploadId,
    key,
  }; //TODO: convert to params

  const idToken = localStorage.token;
  const response = await Axios.post(FileApiPaths.LIST_PARTS, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};

export const prepareUploadPart = async (uploadId: string, key: string, body: Blob, number: number) => {
  const payload = {
    uploadId,
    key,
    body: JSON.stringify(body),
    number,
  }; //TODO: convert to params

  const idToken = localStorage.token;
  const response = await Axios.post(FileApiPaths.PREPARE, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
};
