import type { Page } from '@/features/project/types/project.types';

export interface AcceptanceCriteria {
  acId: number;
  requirementId: string;
  content: string;
  orderIndex: number;
}

export interface Requirement {
  id: string;
  projectId: string;
  requirementKey: string;
  title: string;
  description?: string;
  type?: string;
  status?: string;
  priority?: string;
  reporterId?: string;
  assigneeId?: string;
  acceptanceCriteriaList?: { id: string; content: string; orderIndex: number }[];
  createdAt?: string;
  updatedAt?: string;
}

/** Response from GET /{id}/detail */
export interface RequirementDetail {
  requirementId: string;
  requirementKey: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  acceptanceCriteria: AcceptanceCriteria[];
  totalTestCases: number;
  generatedTestCases: number;
}

/** Payload for POST /{id}/generate-test-cases */
export interface GenerateTestCasesPayload {
  title?: string;
  description?: string;
  acceptanceCriteria?: string[];
  scriptLanguage?: string;
  framework?: string;
  maxTestCases?: number;
  generateScript?: boolean;
  generateTestData?: boolean;
  maxLajRetries?: number;
  baseUrl?: string;
  enableUIExploration?: boolean;
}

export interface GenerateTestCasesResponse {
  testCases: Array<{
    testCaseId?: number;
    testCaseCode?: string;
    scenario?: string;
    title?: string;
    precondition?: string;
    steps: Array<{
      action?: string;
      actionDescription?: string;
      expected_result?: string;
      expectedResult?: string;
    }>;
  }>;
}

export type RequirementPage = Page<Requirement>;
