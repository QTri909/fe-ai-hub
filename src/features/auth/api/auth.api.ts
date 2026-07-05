import { httpClient } from '@/infrastructure/http/client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export const authApi = {
  getMe: async (): Promise<User> => {
    const response = await httpClient.get<User>('/auth-service/api/v1/auth/me');
    return response.data;
  }
};
