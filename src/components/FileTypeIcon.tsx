import React from 'react';
import { ResourceFeatureTypes } from '../types/resource.types';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

export const getStyledFileTypeIcon = (type: string) => {
  if (type.toUpperCase() === ResourceFeatureTypes.audio.toUpperCase()) return <VolumeUpIcon />;
  if (type.toUpperCase() === ResourceFeatureTypes.image.toUpperCase()) return <PhotoOutlinedIcon />;
  if (type.toUpperCase() === ResourceFeatureTypes.presentation.toUpperCase()) return <SlideshowIcon />;
  if (type.toUpperCase() === ResourceFeatureTypes.simulation.toUpperCase()) return <SlideshowIcon />;
  if (type.toUpperCase() === ResourceFeatureTypes.video.toUpperCase()) return <VideocamIcon />;
  if (type.toUpperCase() === ResourceFeatureTypes.document.toUpperCase()) return <DescriptionOutlinedIcon />;
  return <DescriptionOutlinedIcon />; //default
};
