import { httpClient } from '@/infrastructure/http/client';
import type { Page, Workspace } from '../types/workspace.types';

export const workspaceApi = {
  getWorkspaces: async (page = 0, size = 10): Promise<Page<Workspace>> => {
    const response = await httpClient.get<Page<Workspace>>('/core-managerment-service/api/v1/workspaces', {
      params: { page, size }
    });
    return response.data;
  },

  getWorkspaceById: async (id: string): Promise<Workspace> => {
    const response = await httpClient.get<Workspace>(`/core-managerment-service/api/v1/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (data: { name: string; description: string; jiraUrl: string; email: string; apiToken: string; ownerId: string }): Promise<Workspace> => {
    const response = await httpClient.post<Workspace>('/core-managerment-service/api/v1/workspaces', data);
    return response.data;
  }
};
