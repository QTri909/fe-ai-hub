import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '@/core/store/auth.store';
import { ROUTES } from '@/core/constants';
import httpClient from '@/infrastructure/http/client';

export const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const silentRefresh = async () => {
      try {
        // Trigger Silent Refresh using the HTTP-Only cookie.
        // Calling through the API Gateway, which strips /auth-service/ and forwards to auth-service
        const response = await httpClient.post<{ accessToken: string }>(
          'http://localhost:8080/auth-service/api/v1/auth/refresh', 
          {}, 
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.accessToken) {
          const { accessToken } = response.data;
          
          // Save token to global auth store
          setAccessToken(accessToken);
          
          // Update axios default Authorization header for future requests
          httpClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // Redirect cleanly to dashboard
          navigate(ROUTES.WORKSPACE, { replace: true });
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        console.error('Silent refresh failed', error);
        navigate(ROUTES.LOGIN, { replace: true, state: { error: 'Authentication failed. Please try again.' } });
      }
    };

    silentRefresh();
  }, [navigate, setAccessToken]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-body-lg text-on-surface-variant font-medium">Authenticating securely...</p>
      </div>
    </div>
  );
};
