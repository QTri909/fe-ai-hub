import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { axiosConfig } from '@/core/config';
import { useAuthStore } from '@/core/store/auth.store';
import { ROUTES } from '@/core/constants';

export const httpClient = axios.create(axiosConfig);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Request interceptor to inject the access token from store
httpClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Response interceptor to handle 401 errors
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Sometimes 401/403 comes without response object due to CORS
    const isUnauthorized = 
      (error.response && (error.response.status === 401 || error.response.status === 403)) || 
      (error.message === 'Network Error' && !error.response);

    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore.getState();
      
      if (!authStore.isAuthenticated) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Create a separate instance to avoid triggering this interceptor again
        const refreshClient = axios.create(axiosConfig);
        const { data } = await refreshClient.post<{ accessToken: string }>('/auth-service/api/v1/auth/refresh');
        
        const newAccessToken = data.accessToken;
        authStore.setAccessToken(newAccessToken);
        
        processQueue(null, newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearTokens();
        window.location.href = ROUTES.LOGIN;
        return new Promise(() => {}); // Stop execution
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
