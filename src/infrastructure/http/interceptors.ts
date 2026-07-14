import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/core/store';
import { logger } from '@/core/lib';
import type { ErrorResponse } from '@/core/types';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: unknown) => void;
}> = [];

const isPublicAuthRequest = (config: InternalAxiosRequestConfig) => {
  const url = config.url || '';
  return [
    '/auth-service/api/v1/auth/login',
    '/auth-service/api/v1/auth/register',
    '/auth-service/api/v1/auth/refresh',
    '/oauth2/authorization/google',
  ].some((path) => url.includes(path));
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // Request Interceptor: Inject Access Token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (isPublicAuthRequest(config)) {
        return config;
      }

      const { accessToken } = useAuthStore.getState();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle errors & token refresh
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized (Access Token expired)
      const anyRequest = originalRequest as { _retry?: boolean; headers?: Record<string, string> };
      if (isPublicAuthRequest(originalRequest as InternalAxiosRequestConfig)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !anyRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        anyRequest._retry = true;
        isRefreshing = true;

        const { accessToken, setAccessToken, clearTokens } = useAuthStore.getState();

        if (accessToken) {
          try {
            logger.info('Access token expired. Requesting refresh...');
            // Direct request for token refresh via Cookie
const response = await axiosInstance.post('/auth-service/api/v1/auth/refresh', {}, {
              withCredentials: true
            });

            // Extract tokens from expected standard response structure
            const responseData = response.data as { accessToken: string };
            const newAccessToken = responseData.accessToken;
            setAccessToken(newAccessToken);

            processQueue(null, newAccessToken);
            isRefreshing = false;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            logger.error('Refresh token failed. Logging out user...', refreshError);
            processQueue(refreshError, null);
            clearTokens();
            isRefreshing = false;
            return Promise.reject(refreshError);
          }
        } else {
          clearTokens();
        }
      }

      // Map to generic ErrorResponse
      const errorResponse: ErrorResponse = {
        message: 'An unexpected error occurred',
        status: error.response?.status,
      };

      if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as Record<string, unknown>;
        errorResponse.message = (responseData.message as string) || errorResponse.message;
        errorResponse.code = responseData.code as string;
        errorResponse.details = responseData.details as Record<string, string[]>;
      } else {
        errorResponse.message = error.message || errorResponse.message;
      }

      return Promise.reject(errorResponse);
    }
  );
};
export default setupInterceptors;