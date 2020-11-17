import { setAxiosDefaults } from '../utils/axios-config';
import Axios, { AxiosRequestConfig } from 'axios';

setAxiosDefaults();

export const authenticatedApiRequest = (axiosRequestConfig: AxiosRequestConfig) => {
  const idToken = localStorage.token;
  axiosRequestConfig.headers = {
    ...axiosRequestConfig.headers,
    Authorization: `Bearer ${idToken}`,
  };
  return Axios(axiosRequestConfig);
};
