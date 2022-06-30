import { EmbeddigSizes, SupportedFileTypes } from '../types/content.types';

export const DefaultContentSize: EmbeddigSizes = {
  small: { width: '560px', height: '315px' },
  medium: { width: '640px', height: '360px' },
  large: { width: '853px', height: '480px' },
};
//panopto uses 16:9 aspect-ratio
export const SixteenNineAspectRatio: EmbeddigSizes = {
  small: { width: '450px', height: '253px' },
  medium: {
    width: '720px',
    height: '405px',
  },
  large: {
    width: '1366px',
    height: '768px',
  },
};
//Transistor uses always 182px height.
export const TransistorDefaultSizes: EmbeddigSizes = {
  small: {
    width: '450px',
    height: '182px',
  },
  medium: {
    width: '640px',
    height: '182px',
  },
  large: {
    width: '720px',
    height: '182px',
  },
};
export const calculatePreferredWidAndHeigFromPresentationMode = (
  presentationMode: SupportedFileTypes | undefined
): EmbeddigSizes => {
  switch (presentationMode) {
    case SupportedFileTypes.Panopto:
      return SixteenNineAspectRatio;
    case SupportedFileTypes.Transistor:
      return TransistorDefaultSizes;
    default:
      return DefaultContentSize;
  }
};
