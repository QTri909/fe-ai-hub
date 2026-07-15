import { httpClient } from '@/infrastructure/http/client';

export interface IssueTypeMapping {
  id: string;
  projectId: string;
  jiraIssueTypeId: string;
  jiraIssueTypeName: string;
  systemType: string;
}

export const mappingApi = {
  getMappings: async (workspaceId: string, projectId: string): Promise<IssueTypeMapping[]> => {
    const response = await httpClient.get<IssueTypeMapping[]>(`/core-managerment-service/api/v1/workspaces/${workspaceId}/projects/${projectId}/data-mapping`);
    return response.data;
  },

  updateMapping: async (workspaceId: string, projectId: string, mappingId: string, systemType: string): Promise<void> => {
    await httpClient.put(`/core-managerment-service/api/v1/workspaces/${workspaceId}/projects/${projectId}/data-mapping/${mappingId}`, null, {
      params: { systemType }
    });
  }
};
