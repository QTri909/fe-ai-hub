import { httpClient } from '@/infrastructure/http/client';
import type {
  GenerationHistoryResponse,
  TestRun,
  RecentActivity,
  TestCaseRunHistoryResponse,
} from '../types/history.types';

const BASE = '/core-managerment-service/api/v1/history';

export const historyApi = {
  /**
   * Fetch generation history for a specific requirement.
   * GET /api/v1/history/requirements/{requirementId}/generations
   */
  getGenerationHistory: async (requirementId: string): Promise<GenerationHistoryResponse> => {
    const response = await httpClient.get<GenerationHistoryResponse>(
      `${BASE}/requirements/${requirementId}/generations`
    );
    return response.data;
  },

  /**
   * Fetch execution (test run) history for a project.
   * GET /api/v1/history/projects/{projectId}/executions
   */
  getProjectExecutions: async (projectId: string): Promise<TestRun[]> => {
    const response = await httpClient.get<TestRun[]>(`${BASE}/projects/${projectId}/executions`);
    return response.data;
  },

  /**
   * Fetch recent activity for a project (for dashboard).
   * GET /api/v1/history/projects/{projectId}/recent-activity?limit={limit}
   */
  getRecentActivity: async (projectId: string, limit = 10): Promise<RecentActivity[]> => {
    const response = await httpClient.get<RecentActivity[]>(
      `${BASE}/projects/${projectId}/recent-activity`,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Fetch execution run history for a specific test case.
   * GET /api/v1/history/testcase/{testCaseId}/runs
   */
  getTestCaseRunHistory: async (testCaseId: number): Promise<TestCaseRunHistoryResponse> => {
    const response = await httpClient.get<TestCaseRunHistoryResponse>(
      `${BASE}/testcase/${testCaseId}/runs`
    );
    return response.data;
  },
};
