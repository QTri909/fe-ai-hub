import { httpClient } from '@/infrastructure/http/client';

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
}

export const testCaseApi = {
  getAllTestCases: async (): Promise<TestCase[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-cases`);
    return response.data;
  },

  getTestCasesByRequirement: async (reqId: string): Promise<TestCase[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-cases/by-requirement/${reqId}`);
    return response.data;
  },

  saveBatchTestCases: async (reqId: string, testCases: any[], suiteId?: number): Promise<any[]> => {
    const url = suiteId 
      ? `/core-management-service/api/test-cases/save-batch/${reqId}?suiteId=${suiteId}` 
      : `/core-management-service/api/test-cases/save-batch/${reqId}`;
    const response = await httpClient.post(url, testCases);
    return response.data;
  },

  updateTestCase: async (id: number, data: Partial<TestCase>): Promise<TestCase> => {
    const response = await httpClient.put(`/core-management-service/api/test-cases/${id}`, data);
    return response.data;
  },

  getTestCaseSteps: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-cases/${id}/steps`);
    return response.data;
  },

  getTestCaseTestData: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-cases/${id}/test-data`);
    return response.data;
  },

  getTestCaseScripts: async (id: number): Promise<any[]> => {
    const response = await httpClient.get(`/core-management-service/api/test-cases/${id}/scripts`);
    return response.data;
  },

  deleteTestCase: async (id: number): Promise<void> => {
    await httpClient.delete(`/core-management-service/api/test-cases/${id}`);
  },

  generateScript: async (tcId: number, baseUrl: string, scriptLanguage: string = 'javascript', framework: string = 'playwright'): Promise<any> => {
    const response = await httpClient.post(`/core-management-service/api/test-cases/${tcId}/generate-script`, {
      baseUrl,
      scriptLanguage,
      framework
    });
    return response.data;
  },

  executeScript: async (tcId: number, baseUrl: string, maxFixAttempts?: number): Promise<any> => {
    const response = await httpClient.post(`/core-management-service/api/test-cases/${tcId}/execute`, {
      baseUrl,
      maxFixAttempts
    });
    return response.data;
  }
};
