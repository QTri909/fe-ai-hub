import { httpClient } from '@/infrastructure/http/client';

import type { Page } from '@/features/project/types/project.types';

/** Response item from GET /api/test-cases/all-table */
export interface TestCaseAllTableItem {
  testCaseId: number;
  testCaseCode: string;
  title: string;
  stepCount: number;
  scriptCount: number;
  testDataCount: number;
  requirementKey: string;
  requirementTitle: string;
  lastRunStatus: 'PASSED' | 'FAILED' | 'PENDING' | null;
  lastRunTime: string | null;
  steps: any[];
  scripts: any[];
}

export interface TestCase {
  testCaseId: number;
  testCaseCode: string;
  title: string;
  description?: string;
  precondition?: string;
  type?: string;
  status?: string;
  priority?: string;
  requirementId?: string;
  expectedResult?: string;
  actualResult?: string;
  steps?: any[];
  testData?: any[];
  scripts?: any[];
}

export const testCaseApi = {
  getAllTestCases: async (): Promise<TestCase[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/test-cases`);
    return response.data;
  },

  getAllTestCasesTable: async (page = 0, size = 10): Promise<Page<TestCaseAllTableItem>> => {
    const response = await httpClient.get<Page<TestCaseAllTableItem>>(
      `/core-managerment-service/api/test-cases/all-table`,
      { params: { page, size } }
    );
    return response.data;
  },

  getTestCasesByRequirement: async (reqId: string): Promise<TestCase[]> => {
    const response = await httpClient.get(
      `/core-managerment-service/api/test-cases/by-requirement/${reqId}`
    );
    return response.data;
  },

  saveBatchTestCases: async (reqId: string, testCases: any[], suiteId?: number): Promise<any[]> => {
    const url = suiteId
      ? `/core-managerment-service/api/test-cases/save-batch/${reqId}?suiteId=${suiteId}`
      : `/core-managerment-service/api/test-cases/save-batch/${reqId}`;
    const response = await httpClient.post(url, testCases);
    return response.data;
  },

  updateTestCase: async (id: number, data: Partial<TestCase>): Promise<TestCase> => {
    const response = await httpClient.put(`/core-managerment-service/api/test-cases/${id}`, data);
    return response.data;
  },

  getTestCaseSteps: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/test-cases/${id}/steps`);
    return response.data;
  },

  getTestCaseTestData: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(
      `/core-managerment-service/api/test-cases/${id}/test-data`
    );
    return response.data;
  },

  getTestCaseScripts: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-managerment-service/api/test-cases/${id}/scripts`);
    return response.data;
  },

  updateTestStep: async (
    testCaseId: number,
    stepId: number,
    data: { stepOrder?: number; actionDescription?: string; expectedResult?: string }
  ): Promise<any> => {
    const response = await httpClient.put(
      `/core-managerment-service/api/test-cases/${testCaseId}/steps/${stepId}`,
      data
    );
    return response.data;
  },

  updateTestData: async (
    testCaseId: number,
    testDataId: number,
    data: { dataName?: string; inputData?: any; expectedData?: any }
  ): Promise<any> => {
    const response = await httpClient.put(
      `/core-managerment-service/api/test-cases/${testCaseId}/test-data/${testDataId}`,
      data
    );
    return response.data;
  },

  createTestData: async (
    testCaseId: number,
    data: { dataName: string; inputData?: any; expectedData?: any }
  ): Promise<any> => {
    const response = await httpClient.post(
      `/core-managerment-service/api/test-cases/${testCaseId}/test-data`,
      data
    );
    return response.data;
  },

  deleteTestData: async (
    testCaseId: number,
    testDataId: number
  ): Promise<void> => {
    await httpClient.delete(
      `/core-managerment-service/api/test-cases/${testCaseId}/test-data/${testDataId}`
    );
  },

  updateScript: async (
    testCaseId: number,
    scriptId: number,
    data: { scriptContent?: string }
  ): Promise<any> => {
    const response = await httpClient.put(
      `/core-managerment-service/api/test-cases/${testCaseId}/scripts/${scriptId}`,
      data
    );
    return response.data;
  },

  deleteTestCase: async (id: number): Promise<void> => {
    await httpClient.delete(`/core-managerment-service/api/test-cases/${id}`);
  },

  generateScript: async (
    tcId: number,
    baseUrl: string,
    scriptLanguage: string = 'javascript',
    framework: string = 'playwright'
  ): Promise<any> => {
    const response = await httpClient.post(
      `/core-managerment-service/api/test-cases/${tcId}/generate-script`,
      {
        baseUrl,
        scriptLanguage,
        framework,
      }
    );
    return response.data;
  },

  executeScript: async (tcId: number, baseUrl: string, maxFixAttempts?: number): Promise<any> => {
    const response = await httpClient.post(
      `/core-managerment-service/api/test-cases/${tcId}/execute`,
      {
        baseUrl,
        maxFixAttempts,
      }
    );
    return response.data;
  },
};
