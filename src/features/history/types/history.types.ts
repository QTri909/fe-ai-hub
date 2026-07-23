// ─── GET /api/v1/history/requirements/{requirementId}/generations ───────

export interface GenerationEvent {
  generatedAt: string;
  totalTestCases: number;
  draftCount: number;
  generatedCount: number;
  failedCount: number;
  testCases: Array<{
    testCaseCode: string;
    title: string;
    status: 'DRAFT' | 'GENERATED' | 'FAILED';
  }>;
}

export interface GenerationHistoryResponse {
  requirementId: string;
  requirementKey: string;
  requirementTitle: string;
  generationEvents: GenerationEvent[];
}

// ─── GET /api/v1/history/projects/{projectId}/executions ────────────────

export interface TestRun {
  id: string;
  projectId: string;
  name: string;
  status: 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  startedAt: string;
  completedAt?: string;
  triggeredBy: string;
}

// ─── GET /api/v1/history/projects/{projectId}/recent-activity?limit=10 ──

export interface RecentActivity {
  id: string;
  projectId: string;
  projectName: string;
  type: 'TEST_GENERATED' | 'TEST_RUN_COMPLETED' | 'REQUIREMENT_SYNCED' | 'PROJECT_CREATED';
  message: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

// ─── GET /api/v1/history/testcase/{testCaseId}/runs ─────────────────────

export interface TestCaseStepResult {
  stepResultId: number;
  stepId: number;
  stepDescription: string;
  actualResult: string;
  status: string;
  executionTime: string;
  screenshotUrl: string | null;
  videoUrl: string | null;
}

export interface TestCaseRunResult {
  resultId: number;
  status: string;
  actualResult: string;
  executionLog: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  createdAt: string;
  stepResults: TestCaseStepResult[];
}

export interface TestCaseRun {
  runItemId: number;
  runId: number | null;
  runStatus: string | null;
  suiteId: number | null;
  suiteName: string | null;
  environment: string | null;
  itemStatus: string;
  executionTime: string;
  durationMs: number;
  screenshotUrl: string | null;
  videoUrl: string | null;
  testDataSnapshot?: string;
  testScriptSnapshot?: string;
  testStepsSnapshot?: string;
  finalScreenshotUrl?: string;
  result?: TestCaseRunResult;
}

export interface TestCaseRunHistoryResponse {
  testCaseId: number;
  testCaseCode: string;
  title: string;
  expectedResult?: string;
  runHistory: TestCaseRun[];
}
