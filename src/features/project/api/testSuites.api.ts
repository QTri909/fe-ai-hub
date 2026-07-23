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

export interface TestSuiteWithTestCases {
  suiteId: number;
  suiteName: string;
  description?: string;
  projectId: string;
  status: string;
  totalTestCases: number;
  passRate?: number;
  testCoverage?: string;
  testCases: TestCaseInfo[];
  suiteItems: SuiteItemInfo[];
}

export interface TestCaseInfo {
  testCaseId: number;
  testCaseCode: string;
  title: string;
  status: string;
  description?: string;
}

export interface SuiteItemInfo {
  suiteItemId: number;
  testCaseId: number;
  executionOrder: number;
}

export const testSuiteApi = {
  getTestSuitesByProject: async (projectId: string): Promise<TestSuite[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-suites/by-project/${projectId}`);
    return response.data;
  },

  createTestSuite: async (data: { suiteName: string; description: string; projectId: string; testCaseIds: number[] }): Promise<TestSuite> => {
    const response = await httpClient.post('/core-managerment-service/api/v1/test-suites', data);
    return response.data;
  },

  updateTestSuite: async (id: number, data: { suiteName: string; description: string; status: string }): Promise<TestSuite> => {
    const response = await httpClient.put(`/core-managerment-service/api/v1/test-suites/${id}`, data);
    return response.data;
  },

  deleteTestSuite: async (id: number): Promise<void> => {
    await httpClient.delete(`/core-managerment-service/api/v1/test-suites/${id}`);
  },

  addTestCasesToSuite: async (suiteId: number, testCaseIds: number[]): Promise<any> => {
    const response = await httpClient.post(`/core-managerment-service/api/v1/test-suites/${suiteId}/add-test-cases`, testCaseIds);
    return response.data;
  },

  linkFlow: async (suiteId: number): Promise<TestSuite> => {
    const response = await httpClient.post(`/core-managerment-service/api/v1/test-suites/${suiteId}/link-flow`);
    return response.data;
  },

  executeTestSuite: async (
    suiteId: number,
    baseUrl?: string,
    runId?: number,
    authUsername?: string,
    authPassword?: string,
    environmentName?: string
  ): Promise<any> => {
    const response = await httpClient.post(`/execution-engine-service/api/execution/run-suite`, {
      suiteId,
      baseUrl,
      runId,
      authUsername,
      authPassword,
      environmentName
    });
    return response.data;
  },

  getTestSuiteItems: async (suiteId: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-suites/${suiteId}/items`);
    return response.data;
  },

  getTestSuiteWithTestCases: async (suiteId: number): Promise<TestSuiteWithTestCases> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-suites/${suiteId}/with-test-cases`);
    return response.data;
  },

  getSuiteRuns: async (suiteId: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-suites/${suiteId}/runs`);
    return response.data;
  },

  getExecutionLogs: async (runId: number): Promise<{logs: string}> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-pipeline/logs/${runId}`);
    return response.data;
  },

  getExecutionResults: async (runId: number): Promise<any> => {
    const response = await httpClient.get(`/core-managerment-service/api/v1/test-pipeline/results/${runId}`);
    return response.data;
  }
};
