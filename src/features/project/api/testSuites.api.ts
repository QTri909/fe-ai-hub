import { httpClient } from '@/infrastructure/http/client';

export interface TestSuite {
  suiteId: number;
  suiteCode: string;
  suiteName: string;
  description?: string;
  globalTestData?: string;
  status: string;
  totalTestCases: number;
  passRate?: number;
  isE2eFlow?: boolean;
}

export const testSuiteApi = {
  getTestSuitesByProject: async (projectId: string): Promise<TestSuite[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-suites/by-project/${projectId}`);
    return response.data;
  },
  
  createTestSuite: async (data: { suiteName: string; description: string; projectId: string; testCaseIds: number[] }): Promise<TestSuite> => {
    const response = await httpClient.post('/core-management-service/api/test-suites', data);
    return response.data;
  },

  updateTestSuite: async (id: number, data: { suiteName: string; description: string; status: string }): Promise<TestSuite> => {
    const response = await httpClient.put(`/core-management-service/api/test-suites/${id}`, data);
    return response.data;
  },

  deleteTestSuite: async (id: number): Promise<void> => {
    await httpClient.delete(`/core-management-service/api/test-suites/${id}`);
  },

  addTestCasesToSuite: async (suiteId: number, testCaseIds: number[]): Promise<any> => {
    const response = await httpClient.post(`/core-management-service/api/test-suites/${suiteId}/add-test-cases`, testCaseIds);
    return response.data;
  },

  linkFlow: async (suiteId: number): Promise<TestSuite> => {
    const response = await httpClient.post(`/core-management-service/api/test-suites/${suiteId}/link-flow`);
    return response.data;
  },

  executeTestSuites: async (testSuiteIds: number[], baseUrl?: string): Promise<any> => {
    const response = await httpClient.post(`/core-management-service/api/v1/test-pipeline/execute`, { testSuiteIds, baseUrl });
    return response.data;
  },

  getTestSuiteItems: async (suiteId: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-suites/${suiteId}/items`);
    return response.data;
  },

  getExecutionLogs: async (suiteId: number): Promise<{logs: string}> => {
    const response = await httpClient.get(`/core-management-service/api/v1/test-pipeline/logs/${suiteId}`);
    return response.data;
  },

  getExecutionResults: async (suiteId: number): Promise<any> => {
    const response = await httpClient.get(`/core-management-service/api/v1/test-pipeline/results/${suiteId}`);
    return response.data;
  }
};
