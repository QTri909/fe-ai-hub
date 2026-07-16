import { httpClient } from '@/infrastructure/http/client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

export const authApi = {
  getMe: async (): Promise<User> => {
    const response = await httpClient.get<User>('/auth-service/api/v1/auth/me');
    return response.data;
  },
  getProfile: async (): Promise<UserProfile> => {
    const response = await httpClient.get<UserProfile>('/auth-service/api/v1/users/me');
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await httpClient.put<UserProfile>('/auth-service/api/v1/users/me', data);
    return response.data;
  },
};
