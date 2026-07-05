import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workspace } from '@/features/workspace/types/workspace.types';

interface WorkspaceState {
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
    }),
    {
      name: 'workspace-storage',
    }
  )
);
