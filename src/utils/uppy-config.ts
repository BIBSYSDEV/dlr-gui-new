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
import { Content } from '../types/content.types';
import { TFunction } from 'react-i18next';

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

export const additionalCreateFilesUppy = (
  resourceIdentifier: string,
  onCreateContent: (newConent: Content) => void
) => () =>
  Uppy<Uppy.StrictTypes>({ autoProceed: true }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => {
      if (resourceIdentifier.length > 1)
        return await createAdditionalFileUpload(resourceIdentifier, file, onCreateContent);
    },
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });

export const createThumbnailFileUppy = (
  resourceIdentifier: string,
  onCreateContent: (newConent: Content) => void
) => () =>
  Uppy<Uppy.StrictTypes>({
    autoProceed: true,
    allowMultipleUploads: true,
    restrictions: { allowedFileTypes: ['image/*'], maxNumberOfFiles: 1 },
  }).use(AwsS3Multipart, {
    abortMultipartUpload: async (_: UppyFile, { uploadId, key }: UppyArgs) => await abortMultipartUpload(uploadId, key),
    completeMultipartUpload: async (_: UppyFile, { uploadId, key, parts }: UppyCompleteArgs) =>
      await completeMultipartUpload(uploadId, key, parts),
    createMultipartUpload: async (file: UppyFile) => {
      if (resourceIdentifier.length > 1)
        return await createAdditionalFileUpload(resourceIdentifier, file, onCreateContent);
    },
    listParts: async (_: UppyFile, { uploadId, key }: UppyArgs) => await listParts(uploadId, key),
    prepareUploadPart: async (_: UppyFile, { uploadId, key, body, number }: UppyPrepareArgs) =>
      await prepareUploadPart(uploadId, key, body, number),
  });

export const uppyLocale = (t: TFunction<string>) => {
  return {
    strings: {
      dropPaste: `${t('resource.files_and_license.dashboard_component.drag_file')} %{browse}`,
      browse: t('resource.files_and_license.dashboard_component.browse'),
      dropHint: t('resource.files_and_license.drop_single_file_here'),
      uploadXFiles: {
        0: t('resource.files_and_license.dashboard_component.upload_one_file'),
        1: t('resource.files_and_license.dashboard_component.upload_x_files'),
      },
      uploadXNewFiles: {
        0: t('resource.files_and_license.dashboard_component.upload_one_more_file'),
        1: t('resource.files_and_license.dashboard_component.upload_x_more_files'),
      },
      cancel: t('resource.files_and_license.status_bar_component.cancel'),
      complete: t('resource.files_and_license.status_bar_component.complete'),
      dataUploadedOfTotal: t('resource.files_and_license.status_bar_component.dataUploadedOfTotal'),
      done: t('resource.files_and_license.status_bar_component.done'),
      filesUploadedOfTotal: {
        0: t('resource.files_and_license.status_bar_component.0'),
        1: t('resource.files_and_license.status_bar_component.1'),
      },
      pause: t('resource.files_and_license.status_bar_component.pause'),
      paused: t('resource.files_and_license.status_bar_component.paused'),
      resume: t('resource.files_and_license.status_bar_component.resume'),
      retry: t('resource.files_and_license.status_bar_component.retry'),
      uploadFailed: t('resource.files_and_license.status_bar_component.uploadFailed'),
      uploading: t('resource.files_and_license.status_bar_component.uploading'),
      xTimeLeft: t('resource.files_and_license.status_bar_component.xTimeLeft'),
    },
  };
};
