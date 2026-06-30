import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/core/store';
import { logger } from '@/core/lib';
import type { ErrorResponse } from '@/core/types';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: unknown) => void;
}> = [];

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

        const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

        if (refreshToken) {
          try {
            logger.info('Access token expired. Requesting refresh...');
            // Direct request for token refresh
            const response = await axiosInstance.post('/auth/refresh', {
              refreshToken,
            });

            // Extract tokens from expected standard response structure
            const responseData = response.data as { data: { accessToken: string; refreshToken: string } };
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = responseData.data;
            setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });

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
