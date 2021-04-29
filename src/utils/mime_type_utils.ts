import { Resource } from '../types/resource.types';
import { SupportedFileTypes } from '../types/content.types';

const documentTypeFromMime = (resource: Resource): string => {
  switch (resource.contents.masterContent.features.dlr_content_mime_type) {
    case SupportedFileTypes.Document:
    case SupportedFileTypes.Image:
    case SupportedFileTypes.PDF:
    case SupportedFileTypes.Video:
    case SupportedFileTypes.Link:
    case SupportedFileTypes.Download:
    case SupportedFileTypes.MediaSite:
    case SupportedFileTypes.Youtube:
    case SupportedFileTypes.Vimeo:
      return resource.contents.masterContent.features.dlr_content_mime_type;
    case 'audio-service/x-spotify':
      return SupportedFileTypes.Spotify;
    case 'audio-service/x-soundcloud':
      return SupportedFileTypes.Soundcloud;
    case 'video-service/x-youtube':
      return SupportedFileTypes.Youtube;
    case 'video-service/x-twentythree':
      return SupportedFileTypes.Video23;
    case 'video-service/x-mediasite':
      return SupportedFileTypes.MediaSite;
    case 'video-service/x-kaltura':
      return SupportedFileTypes.Kaltura;
    case 'video-service/x-vimeo':
      return SupportedFileTypes.Vimeo;
    case 'text/html':
      return SupportedFileTypes.Link;
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/svg+xml':
      return SupportedFileTypes.Image;
    case 'application/pdf':
      return SupportedFileTypes.PDF;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.oasis.opendocument.text':
    case 'application/vnd.oasis.opendocument.spreadsheet':
    case 'application/vnd.oasis.opendocument.presentation':
      return SupportedFileTypes.Document;
    case 'text/plain':
    case 'application/json':
    case 'application/xml':
      return SupportedFileTypes.Text;
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/quicktime':
    case 'video/avi':
    case 'video/x-matroska':
      return SupportedFileTypes.Video;
    case 'audio/mpeg':
    case 'audio/ogg':
      return SupportedFileTypes.Audio;
    default:
      return SupportedFileTypes.Download;
  }
};

export const determinePresentationMode = (resource: Resource): string => {
  if (resource.contents.masterContent.features.dlr_content_type_link_scheme_http === 'true') {
    return SupportedFileTypes.LinkSchemeHttp;
  } else if (
    (resource.contents.masterContent.features.dlr_content_type_link_header_http_x_frame_options === 'deny' ||
      resource.contents.masterContent.features.dlr_content_type_link_header_http_x_frame_options === 'sameorigin') &&
    resource.contents.masterContent.features.dlr_content_mime_type !== 'video-service/x-vimeo' &&
    resource.contents.masterContent.features.dlr_content_mime_type !== 'video-service/x-youtube'
  ) {
    return SupportedFileTypes.LinkXFrameOptionsPresent;
  } else {
    return documentTypeFromMime(resource);
  }
};
