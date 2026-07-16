import { create } from 'zustand';
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

function getInitialState() {
  try {
    const raw = localStorage.getItem('jat_auth_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state?.accessToken) {
        return {
          accessToken: state.accessToken,
          user: state.user ?? null,
          isAuthenticated: state.isAuthenticated ?? true,
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    accessToken: null,
    user: null,
    isAuthenticated: false,
  };
}

const initial = getInitialState();

export const useAuthStore = create<AuthState>()((set) => ({
  ...initial,
  setAccessToken: (accessToken: string) => set({ accessToken, isAuthenticated: true }),
  setUser: (user: User | null) => set({ user }),
  clearTokens: () => set({ accessToken: null, isAuthenticated: false }),
  clearTokensAndUser: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));

// Persist changes to localStorage
useAuthStore.subscribe((state) => {
  try {
    const toPersist = {
      state: {
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      },
      version: 0,
    };
    localStorage.setItem('jat_auth_store', JSON.stringify(toPersist));
  } catch {
    // ignore
  }
});
