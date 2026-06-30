import { create } from 'zustand';

interface AppState {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}));
