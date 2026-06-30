import { appConfig } from './app.config';

export const axiosConfig = {
  baseURL: appConfig.VITE_API_URL,
  timeout: appConfig.VITE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
};
