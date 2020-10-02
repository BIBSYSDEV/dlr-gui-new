import Axios, { AxiosRequestConfig } from 'axios';
import constants, { StatusCode } from '../utils/constants';
import { setAxiosDefaults } from '../utils/axios-config';

// Set axios defaults only once through the app's lifetime
setAxiosDefaults();

// A completed request should return error:true|false alongside potential data
interface CompletedApiResponse<T> {
  error: boolean;
  data?: T;
}

// A cancelled request should return null
type ApiResponse<T> = CompletedApiResponse<T> | null;

export const apiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await Axios(axiosRequestConfig);
    if (response.status >= 400) {
      return { error: true };
    } else {
      return { error: false, data: response.data };
    }
  } catch (error) {
    return Axios.isCancel(error) ? null : { error: true };
  }
};

export const authenticatedApiRequest = async <T>(axiosRequestConfig: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const idToken = ''; //await getIdToken();
    axiosRequestConfig.headers = {
      ...axiosRequestConfig.headers,
      Authorization: `Bearer ${idToken}`,
    };
  } catch {
    return {
      error: true,
    };
  }
  return await apiRequest(axiosRequestConfig);
};

export const getAnonymousWebToken = async () => {
  return await apiRequest({
    url: `${constants.guiBackendLoginPath}/anonymous`,
    method: 'GET',
  });
};

export const searchResources = async (query: string, token: string) => {
  return await apiRequest({
    url: encodeURI(`${constants.guiBackendResourcesSearchPath}/resources/search?query=${query}`),
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default apiRequest;
