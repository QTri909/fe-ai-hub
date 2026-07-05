import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      setAccessToken: (accessToken: string) => 
        set({ accessToken, isAuthenticated: true }),
      clearTokens: () =>
        set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'jat_auth_store',
    }
  )
);
