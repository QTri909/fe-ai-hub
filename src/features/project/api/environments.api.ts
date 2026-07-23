import { httpClient } from '@/infrastructure/http/client';

export interface ProjectEnvironment {
  envId?: number;
  projectId: string;
  envName: string;
  baseUrl: string;
  authUsername?: string;
  authPassword?: string;
  isDefault?: boolean;
}

export const environmentsApi = {
  getEnvironmentsByProject: async (projectId: string): Promise<ProjectEnvironment[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/project-environments/project/${projectId}`);
    return response.data;
  },

  createEnvironment: async (env: ProjectEnvironment): Promise<ProjectEnvironment> => {
    const response = await httpClient.post('/core-managerment-service/api/project-environments', env);
    return response.data;
  },

  updateEnvironment: async (envId: number, env: ProjectEnvironment): Promise<ProjectEnvironment> => {
    const response = await httpClient.put(`/core-managerment-service/api/project-environments/${envId}`, env);
    return response.data;
  },

  deleteEnvironment: async (envId: number): Promise<void> => {
    await httpClient.delete(`/core-managerment-service/api/project-environments/${envId}`);
  }
};
