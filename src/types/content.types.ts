import { ResourceContents } from './resource.types';

export interface Content {
  identifier: string;
  features: ContentFeature;
}

interface ContentFeature {
  dlr_content: string;
  dlr_content_checksum_MD5?: string;
  dlr_content_content_type?: string;
  dlr_content_default?: string;
  dlr_content_identifier?: string;
  dlr_content_master?: string;
  dlr_content_mime_type?: string;
  dlr_content_original?: string;
  dlr_content_size?: string;
  dlr_content_size_bytes?: string;
  dlr_content_time_created?: string;
  dlr_content_type?: string;
  dlr_thumbnail_default?: string;
  dlr_content_title: string;
}

export const emptyContents: Content[] = [
  {
    identifier: '',
    features: {
      dlr_content_title: '',
      dlr_content: '',
    },
  },
];

export const emptyResourceContent: ResourceContents = {
  masterContent: { identifier: '', features: { dlr_content_title: '', dlr_content: '' } },
  additionalContent: [],
};

export enum resourceType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface Preview {
  type: string;
  url: string;
}

export const emptyPreview: Preview = {
  type: '',
  url: '',
};

export const LinkMetadataFilename = 'metadata_external.json';
