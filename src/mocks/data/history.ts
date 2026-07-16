import type {
  GenerationHistoryResponse,
  TestRun,
  RecentActivity,
} from '@/features/history/types/history.types';

// ─── Generation History ──────────────────────────────────

export const mockGenerationHistories: Record<string, GenerationHistoryResponse> = {
  'req-001': {
    requirementId: 'req-001',
    requirementKey: 'REQ-001',
    requirementTitle: 'User Registration',
    generationEvents: [
      {
        generatedAt: new Date(Date.now() - 3600000).toISOString(),
        totalTestCases: 5,
        draftCount: 0,
        generatedCount: 5,
        failedCount: 0,
        testCases: [
          {
            testCaseCode: 'TC-R001-01',
            title: 'Valid registration with email',
            status: 'GENERATED',
          },
          { testCaseCode: 'TC-R001-02', title: 'Duplicate email rejection', status: 'GENERATED' },
          { testCaseCode: 'TC-R001-03', title: 'Weak password validation', status: 'GENERATED' },
          { testCaseCode: 'TC-R001-04', title: 'Missing required fields', status: 'GENERATED' },
          { testCaseCode: 'TC-R001-05', title: 'Email format validation', status: 'GENERATED' },
        ],
      },
      {
        generatedAt: new Date(Date.now() - 7200000).toISOString(),
        totalTestCases: 3,
        draftCount: 1,
        generatedCount: 2,
        failedCount: 0,
        testCases: [
          {
            testCaseCode: 'TC-R001-01',
            title: 'Valid registration with email',
            status: 'GENERATED',
          },
          { testCaseCode: 'TC-R001-02', title: 'Duplicate email rejection', status: 'GENERATED' },
          { testCaseCode: 'TC-R001-D1', title: 'SSO login flow', status: 'DRAFT' },
        ],
      },
    ],
  },
  'req-002': {
    requirementId: 'req-002',
    requirementKey: 'REQ-002',
    requirementTitle: 'Product Search',
    generationEvents: [
      {
        generatedAt: new Date(Date.now() - 600000).toISOString(),
        totalTestCases: 4,
        draftCount: 1,
        generatedCount: 2,
        failedCount: 1,
        testCases: [
          { testCaseCode: 'TC-R002-01', title: 'Search by product name', status: 'GENERATED' },
          { testCaseCode: 'TC-R002-02', title: 'Search by category', status: 'GENERATED' },
          { testCaseCode: 'TC-R002-D1', title: 'Search with special characters', status: 'DRAFT' },
          { testCaseCode: 'TC-R002-F1', title: 'Search with empty query', status: 'FAILED' },
        ],
      },
    ],
  },
};

// ─── Execution / Test Run History ────────────────────────

export const mockTestRuns: TestRun[] = [
  {
    id: 'run-001',
    projectId: 'proj-001',
    name: 'Sprint #24 Regression',
    status: 'PASSED',
    totalTests: 42,
    passedTests: 38,
    failedTests: 4,
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 82800000).toISOString(),
    triggeredBy: 'Demo User',
  },
  {
    id: 'run-002',
    projectId: 'proj-001',
    name: 'Smoke Test - Auth Module',
    status: 'FAILED',
    totalTests: 12,
    passedTests: 8,
    failedTests: 4,
    startedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 171600000).toISOString(),
    triggeredBy: 'CI Pipeline',
  },
  {
    id: 'run-003',
    projectId: 'proj-001',
    name: 'Build Verification',
    status: 'IN_PROGRESS',
    totalTests: 24,
    passedTests: 15,
    failedTests: 0,
    startedAt: new Date(Date.now() - 300000).toISOString(),
    triggeredBy: 'Demo User',
  },
  {
    id: 'run-004',
    projectId: 'proj-002',
    name: 'Cart & Checkout Regression',
    status: 'PASSED',
    totalTests: 56,
    passedTests: 54,
    failedTests: 2,
    startedAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 256800000).toISOString(),
    triggeredBy: 'Auto Trigger',
  },
];

// ─── Recent Activity ──────────────────────────────────────

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'act-001',
    projectId: 'proj-001',
    projectName: 'JAT Platform',
    type: 'TEST_GENERATED',
    message: 'Generated 5 test cases for requirement REQ-001 (User Registration)',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    metadata: { requirementId: 'req-001', testCaseCount: '5' },
  },
  {
    id: 'act-002',
    projectId: 'proj-001',
    projectName: 'JAT Platform',
    type: 'TEST_RUN_COMPLETED',
    message: 'Sprint #24 Regression completed: 38/42 passed',
    timestamp: new Date(Date.now() - 82800000).toISOString(),
    metadata: { runId: 'run-001', passed: '38', total: '42' },
  },
  {
    id: 'act-003',
    projectId: 'proj-002',
    projectName: 'E-Commerce Platform',
    type: 'REQUIREMENT_SYNCED',
    message: 'Synced 3 new requirements from Jira project ECOM',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    metadata: { projectKey: 'ECOM', count: '3' },
  },
  {
    id: 'act-004',
    projectId: 'proj-003',
    projectName: 'Mobile App',
    type: 'PROJECT_CREATED',
    message: 'Project Mobile App created and connected to Jira',
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    metadata: { workspaceId: 'ws-001' },
  },
  {
    id: 'act-005',
    projectId: 'proj-002',
    projectName: 'E-Commerce Platform',
    type: 'TEST_RUN_COMPLETED',
    message: 'Cart & Checkout Regression completed: 54/56 passed',
    timestamp: new Date(Date.now() - 256800000).toISOString(),
    metadata: { runId: 'run-004', passed: '54', total: '56' },
  },
];
