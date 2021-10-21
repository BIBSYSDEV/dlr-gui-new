import axios from 'axios';
import { SoundCloudResponse, TwentyThreeVideoResponse } from '../types/content.types';

export const getSoundCloudInformation = (dlr_content_url: string) => {
  return axios.get<SoundCloudResponse>(dlr_content_url);
};

export const getTwentyThreeVideoInformation = (dlr_content_url: string) => {
  return axios.get<TwentyThreeVideoResponse>(dlr_content_url);
};
