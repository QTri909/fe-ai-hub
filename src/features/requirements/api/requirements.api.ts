import { httpClient } from '@/infrastructure/http/client';
import type {
  Requirement,
  RequirementDetail,
  RequirementPage,
  GenerateTestCasesPayload,
  GenerateTestCasesResponse,
  AcceptanceCriteria,
} from '../types/requirements.types';

const BASE_URL = '/core-managerment-service/api/v1/requirements';

export const requirementApi = {
  /**
   * 1. Lấy tất cả Requirements (có phân trang)
   * GET /api/v1/requirements?page=0&size=10
   */
  getAll: async (page = 0, size = 10): Promise<RequirementPage> => {
    const response = await httpClient.get<RequirementPage>(BASE_URL, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * 2. Lấy Requirements theo Project
   * GET /api/v1/requirements/by-project/{projectId}?page=0&size=10
   */
  getByProjectId: async (projectId: string, page = 0, size = 10): Promise<RequirementPage> => {
    const response = await httpClient.get<RequirementPage>(`${BASE_URL}/by-project/${projectId}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * 3. Lấy chi tiết 1 Requirement
   * GET /api/v1/requirements/{id}
   */
  getById: async (id: string): Promise<Requirement> => {
    const response = await httpClient.get<Requirement>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * 4. Lấy Requirement Detail (kèm Acceptance Criteria + Test Case counts)
   * GET /api/v1/requirements/{id}/detail
   */
  getDetail: async (id: string): Promise<RequirementDetail> => {
    const response = await httpClient.get<RequirementDetail>(`${BASE_URL}/${id}/detail`);
    return response.data;
  },

  /**
   * 5. Generate Test Cases từ AI
   * POST /api/v1/requirements/{id}/generate-test-cases
   */
  generateTestCases: async (
    id: string,
    payload: GenerateTestCasesPayload
  ): Promise<GenerateTestCasesResponse> => {
    const response = await httpClient.post<GenerateTestCasesResponse>(
      `${BASE_URL}/${id}/generate-test-cases`,
      payload,
      {
        timeout: 120000, // 2 minutes for AI generation
      }
    );
    return response.data;
  },

  generateAllInOne: async (
    id: string,
    payload: GenerateTestCasesPayload
  ): Promise<{ status: string; job_id: string; message: string }> => {
    const response = await httpClient.post<{ status: string; job_id: string; message: string }>(
      `${BASE_URL}/${id}/generate-all-in-one`,
      payload,
      { timeout: 30000 }
    );
    return response.data;
  },

  getJobStatus: async (
    requirementId: string,
    jobId: string
  ): Promise<{ status: string; progress?: number; message?: string; result?: any }> => {
    const response = await httpClient.get<{ status: string; progress?: number; message?: string; result?: any }>(
      `${BASE_URL}/${requirementId}/generate-jobs/${jobId}`
    );
    return response.data;
  },

  /**
   * (Legacy) Lấy Acceptance Criteria theo Requirement
   * GET /api/v1/acceptance-criterias/by-requirement/{requirementId}
   */
  getAcceptanceCriteriaByRequirement: async (
    requirementId: string
  ): Promise<AcceptanceCriteria[]> => {
    const response = await httpClient.get<AcceptanceCriteria[]>(
      `/core-managerment-service/api/v1/acceptance-criterias/by-requirement/${requirementId}`
    );
    return response.data;
  },
};
