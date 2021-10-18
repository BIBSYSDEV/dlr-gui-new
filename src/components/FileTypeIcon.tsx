import React from 'react';
import { LegacyResourceFeatureTypes, ResourceFeatureTypes } from '../types/resource.types';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VideocamIcon from '@mui/icons-material/Videocam';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EventIcon from '@mui/icons-material/Event';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CodeIcon from '@mui/icons-material/Code';
import CallSplitIcon from '@mui/icons-material/CallSplit';

export const getStyledFileTypeIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case ResourceFeatureTypes.audio.toUpperCase():
      return <VolumeUpIcon />;
    case ResourceFeatureTypes.image.toUpperCase():
      return <PhotoOutlinedIcon />;
    case ResourceFeatureTypes.presentation.toUpperCase():
      return <SlideshowIcon />;
    case ResourceFeatureTypes.simulation.toUpperCase():
      return <SlideshowIcon />;
    case ResourceFeatureTypes.video.toUpperCase():
      return <VideocamIcon />;
    case ResourceFeatureTypes.document.toUpperCase():
      return <DescriptionOutlinedIcon />;
    case LegacyResourceFeatureTypes.AudioVisual.toUpperCase():
      return <OndemandVideoIcon />;
    case LegacyResourceFeatureTypes.Collection.toUpperCase():
      return <LibraryBooksIcon />;
    case LegacyResourceFeatureTypes.Event.toUpperCase():
      return <EventIcon />;
    case LegacyResourceFeatureTypes.InteractiveResource.toUpperCase():
      return <TouchAppIcon />;
    case LegacyResourceFeatureTypes.Model.toUpperCase():
      return <SquareFootIcon />;
    case LegacyResourceFeatureTypes.PhysicalObject.toUpperCase():
      return <SquareFootIcon />;
    case LegacyResourceFeatureTypes.Software.toUpperCase():
      return <CodeIcon />;
    case LegacyResourceFeatureTypes.Sound.toUpperCase():
      return <VolumeUpIcon />;
    case LegacyResourceFeatureTypes.Workflow.toUpperCase():
      return <CallSplitIcon />;
    default:
      return <DescriptionOutlinedIcon />;
  }
};
