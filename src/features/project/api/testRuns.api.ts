import { httpClient } from '@/infrastructure/http/client';

export interface TestRun {
    runId: number;
    testSuite: {
        suiteId: number;
        suiteName: string;
    };
    environment: string;
    status: string;
    totalTests: number;
    passedCount: number;
    failedCount: number;
    startTime: string;
    endTime: string;
    durationMs: number;
    runItems: TestRunItem[];
}

export interface TestRunItem {
    runItemId: number;
    testSuite: {
        suiteId: number;
        suiteName: string;
    };
    testCase: {
        testCaseId: number;
        testCaseCode: string;
        title: string;
    };
    status: string;
    durationMs: number;
    screenshotUrl?: string;
    videoUrl?: string;
    testResult?: TestResult;
}

export interface TestResult {
    resultId: number;
    status: string;
    executionLog: string;
    durationMs: number;
    stepResults?: TestStepResult[];
}

export interface TestStepResult {
    stepResultId: number;
    status: string;
    actualResult: string;
    screenshotUrl?: string;
    videoUrl?: string;
    testStep?: {
        stepOrder: number;
        actionDescription: string;
        expectedResult?: string;
    };
}

export const testRunApi = {
    getRunsByProject: async (projectId: string): Promise<TestRun[]> => {
        const response = await httpClient.get(`/core-management-service/api/v1/test-runs/project/${projectId}`);
        return response.data;
    },
    
    getRunDetails: async (runId: number): Promise<TestRun> => {
        const response = await httpClient.get(`/core-management-service/api/v1/test-runs/${runId}`);
        return response.data;
    }
};
