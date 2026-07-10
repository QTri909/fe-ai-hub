import { httpClient } from '@/infrastructure/http/client';
import type { Page, Project } from '../types/project.types';

export const projectApi = {
  getProjectsByWorkspaceId: async (workspaceId: string, page = 0, size = 20): Promise<Page<Project>> => {
    const response = await httpClient.get<Page<Project>>(`/core-management-service/api/v1/projects/by-workspace/${workspaceId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await httpClient.get<Project>(`/core-management-service/api/v1/projects/${id}`);
    return response.data;
  },

  syncProjects: async (workspaceId: string): Promise<Project[]> => {
    const response = await httpClient.post<Project[]>(`/core-management-service/api/v1/workspaces/${workspaceId}/projects/sync`);
    return response.data;
  },

  syncProjectRequirements: async (workspaceId: string, projectKey: string): Promise<any[]> => {
    const response = await httpClient.post<any[]>(`/core-management-service/api/v1/workspaces/${workspaceId}/projects/${projectKey}/requirements/sync`);
    return response.data;
  }
};
