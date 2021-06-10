import React from 'react';
import { LegacyResourceFeatureTypes, ResourceFeatureTypes } from '../types/resource.types';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EventIcon from '@material-ui/icons/Event';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import SquareFootIcon from '@material-ui/icons/SquareFoot';
import CodeIcon from '@material-ui/icons/Code';
import CallSplitIcon from '@material-ui/icons/CallSplit';

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
