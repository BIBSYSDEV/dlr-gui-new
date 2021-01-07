import Uppy, { UppyFile } from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import {
  abortMultipartUpload,
  completeMultipartUpload,
  createAdditionalFileUpload,
  createMultipartUpload,
  createResourceAndMultipartUpload,
  listParts,
  prepareUploadPart,
} from '../api/fileApi';
import { Resource } from '../types/resource.types';

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

export const createUppy = (
  resourceIdentifier: string,
  shouldAllowMultipleFiles = true,
  onCreateFile: (newResource: Resource) => void
) => () =>
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
        return await createResourceAndMultipartUpload(file, onCreateFile);
      }
    },
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });

export const additionalCreateFilesUppy = (resourceIdentifier: string) => () =>
  Uppy<Uppy.StrictTypes>({ autoProceed: true }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => {
      if (resourceIdentifier.length > 1) return await createAdditionalFileUpload(resourceIdentifier, file);
    },
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });
