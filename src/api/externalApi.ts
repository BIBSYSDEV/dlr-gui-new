import axios, { AxiosResponse } from 'axios';
import { SoundCloudResponse, TwentyThreeVideoResponse } from '../types/content.types';

export const getSoundCloudInformation = (dlr_content_url: string): Promise<AxiosResponse<SoundCloudResponse>> => {
  return axios.get(dlr_content_url);
};

export const getTwentyThreeVideoInformation = (
  dlr_content_url: string
): Promise<AxiosResponse<TwentyThreeVideoResponse>> => {
  return axios.get(dlr_content_url);
};
