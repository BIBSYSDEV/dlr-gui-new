import { StrictTypes, Uppy as UppyType } from '@uppy/core';

export interface File {
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
}

export const emptyFile: File = {
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
};

export interface Uppy extends UppyType<StrictTypes> {
  hasUploadSuccessEventListener?: boolean;
  resourceIdentifier?: string;
}
