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
}

export const testRunApi = {
    getRunsByProject: async (projectId: string): Promise<TestRun[]> => {
        return httpClient.get(`/test-runs/project/${projectId}`);
    },
    
    getRunDetails: async (runId: number): Promise<TestRun> => {
        return httpClient.get(`/test-runs/${runId}`);
    }
};
