import Axios from 'axios';
import { API_URL } from './constants';

export const setAxiosDefaults = () => {
  Axios.defaults.baseURL = API_URL;
  Axios.defaults.headers.common = {
    Accept: 'application/json',
  };
  Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
};
