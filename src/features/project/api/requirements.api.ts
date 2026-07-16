import { httpClient } from '@/infrastructure/http/client';
import type { Page } from '@/features/project/types/project.types';

export interface Requirement {
  id: string;
  projectId: string;
  requirementKey: string;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  priority?: string;
  reporterId?: string;
  assigneeId?: string;
  acceptanceCriteriaList?: { id: string; content: string; orderIndex: number }[];
  createdAt?: string;
  updatedAt?: string;
}

export const requirementApi = {
  getRequirementsByProjectId: async (projectId: string, page = 0, size = 50): Promise<Page<Requirement>> => {
    const response = await httpClient.get<Page<Requirement>>(`/core-managerment-service/api/v1/requirements/by-project/${projectId}`, {
      params: { page, size }
    });
    return response.data;
  },
  getAcceptanceCriteriaByRequirement: async (requirementId: string): Promise<Array<{ acId: number; requirementId: string; content: string; orderIndex: number }>> => {
    const response = await httpClient.get<Array<{ acId: number; requirementId: string; content: string; orderIndex: number }>>(`/core-managerment-service/api/v1/acceptance-criterias/by-requirement/${requirementId}`);
    return response.data;
  }
};
