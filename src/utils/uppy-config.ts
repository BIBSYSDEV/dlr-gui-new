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
import { Resource } from '../types/resource.types';
import ThumbnailGenerator from '@uppy/thumbnail-generator';

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
  shouldAllowMultipleFiles: boolean,
  onCreateFile: (newResource: Resource) => void
): UppyType =>
  Uppy<Uppy.StrictTypes>({
    autoProceed: true,
    restrictions: { maxNumberOfFiles: shouldAllowMultipleFiles ? null : 1 },
  })
    .use(AwsS3Multipart, {
      abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) =>
        await abortMultipartUpload(uploadId, key),
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
    })
    .use(ThumbnailGenerator, {
      id: 'ThumbnailGenerator',
      thumbnailWidth: 200,
      thumbnailHeight: 200,
      thumbnailType: 'image/jpeg',
      waitForThumbnailsBeforeUpload: false,
    });
