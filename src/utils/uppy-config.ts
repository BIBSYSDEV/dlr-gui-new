import Uppy, { UppyFile } from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import {
  abortMultipartUpload,
  completeMultipartUpload,
  createMultipartUpload,
  createResourceAndMultipartUpload,
  listParts,
  prepareUploadPart,
} from '../api/fileApi';
import { Uppy as UppyType } from '../types/file.types';
import { setResource } from '../state/resourceSlice';
import { Resource } from '../types/resource.types';
import { store } from '../state/store';
interface UppyArgs {
  uploadId: string;
  key: string;
}

interface UppyPrepareArgs extends UppyArgs {
  body: Blob;
  number: number;
}

interface UppyCompleteArgs extends UppyArgs {
  parts: AwsS3Part[];
}

export const createUppy = (resourceIdentifier: string, shouldAllowMultipleFiles: boolean): UppyType =>
  Uppy<Uppy.StrictTypes>({
    autoProceed: true,
    restrictions: { maxNumberOfFiles: shouldAllowMultipleFiles ? null : 1 },
  }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => {
      if (resourceIdentifier) return await createMultipartUpload(file);
      else {
        const response = await createResourceAndMultipartUpload(file);
        const resource: Resource = {
          identifier: response.resourceIdentifier,
          features: {},
        };
        store.dispatch(setResource(resource));
        console.log('CREATED');
        return response.data;
      }
    },
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });
