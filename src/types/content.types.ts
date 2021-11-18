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
  dlr_content_type_link_scheme_http?: string;
  dlr_content_type_link_header_http_x_frame_options?: string;
  dlr_content_url?: string;
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

export const LinkMetadataFilename = 'metadata_external.json';

export enum SupportedFileTypes {
  Document = 'document',
  Video = 'video',
  Image = 'image',
  PDF = 'pdf',
  Link = 'link',
  Download = 'download',
  MediaSite = 'mediasite',
  Youtube = 'youtube',
  Vimeo = 'vimeo',
  Transistor = 'transistor',
  Spotify = 'spotify',
  Soundcloud = 'soundcloud',
  TwentyThreeVideo = '23video',
  Kaltura = 'kaltura',
  Panopto = 'panopto',
  Text = 'text',
  Audio = 'audio',
  LinkSchemeHttp = 'linkSchemeHttp',
  LinkXFrameOptionsPresent = 'linkXFrameOptionsPresent',
}

export interface SoundCloudResponse {
  html: string;
  author_name?: string;
  author_url?: string;
  description?: string;
  provider_name?: string;
  provider_url?: string;
  thumbnail_url?: string;
  title?: string;
  version?: number;
  height?: number;
  width?: string;
}

export interface TwentyThreeVideoResponse {
  html: string;
}
