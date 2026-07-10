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
    const response = await httpClient.get<Page<Requirement>>(`/core-management-service/api/v1/requirements/by-project/${projectId}`, {
      params: { page, size }
    });
    return response.data;
  },
};
