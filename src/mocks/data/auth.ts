import type { User, UserProfile } from '@/features/auth/api/auth.api';

export const mockUser: User = {
  id: 'user-001',
  email: 'demo@jat-platform.com',
  fullName: 'Demo User',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=demo',
};

export const mockProfile: UserProfile = {
  id: 'user-001',
  email: 'demo@jat-platform.com',
  fullName: 'Demo User',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=demo',
  provider: 'LOCAL',
  status: 'ACTIVE',
  createdAt: '2025-01-15T08:00:00Z',
  roles: ['ADMIN'],
};

export const mockAccessToken = 'jat_mock_token_eyJhbGciOiJIUzI1NiJ9.demo';
