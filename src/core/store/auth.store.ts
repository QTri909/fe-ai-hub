import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/api/auth.api';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User | null) => void;
  clearTokens: () => void;
  clearTokensAndUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAccessToken: (accessToken: string) => 
        set({ accessToken, isAuthenticated: true }),
      setUser: (user: User | null) => 
        set({ user }),
      clearTokens: () =>
        set({ accessToken: null, isAuthenticated: false }),
      clearTokensAndUser: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'jat_auth_store',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        user: state.user 
      }),
    }
  )
);