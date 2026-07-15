import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestCaseRepository } from './TestCaseRepository';

const {
  mockGetTestCasesByRequirement,
  mockGetAllTestCases,
  mockGetTestCaseSteps,
  mockGetTestCaseTestData,
  mockGetTestCaseScripts,
} = vi.hoisted(() => ({
  mockGetTestCasesByRequirement: vi.fn(),
  mockGetAllTestCases: vi.fn(),
  mockGetTestCaseSteps: vi.fn(),
  mockGetTestCaseTestData: vi.fn(),
  mockGetTestCaseScripts: vi.fn(),
}));

vi.mock('@/features/project/api/testCases.api', () => ({
  testCaseApi: {
    getTestCasesByRequirement: mockGetTestCasesByRequirement,
    getAllTestCases: mockGetAllTestCases,
    getTestCaseSteps: mockGetTestCaseSteps,
    getTestCaseTestData: mockGetTestCaseTestData,
    getTestCaseScripts: mockGetTestCaseScripts,
    deleteTestCase: vi.fn(),
    updateTestCase: vi.fn(),
    generateScript: vi.fn(),
    executeScript: vi.fn(),
    updateTestStep: vi.fn(),
    updateTestData: vi.fn(),
    updateScript: vi.fn(),
  },
}));

vi.mock('@/features/project/api/testSuites.api', () => ({
  testSuiteApi: {
    getTestSuitesByProject: vi.fn(),
    addTestCasesToSuite: vi.fn(),
  },
}));

describe('TestCaseRepository', () => {
  beforeEach(() => {
    mockGetTestCasesByRequirement.mockResolvedValue([
      {
        testCaseId: 1,
        testCaseCode: 'TC-001',
        title: 'Login flow',
        requirementId: 'req-1',
        status: 'DRAFT',
      },
    ]);
    mockGetTestCaseSteps.mockResolvedValue([
      { testStepId: 1, stepOrder: 1, actionDescription: 'Open login page', expectedResult: 'Page loads' },
    ]);
    mockGetTestCaseTestData.mockResolvedValue([
      { testDataId: 1, dataName: 'user', inputData: '{"name":"demo"}', expectedData: '{"status":"ok"}' },
    ]);
    mockGetTestCaseScripts.mockResolvedValue([
      { scriptId: 1, scriptName: 'login.spec', scriptContent: 'test("login", () => {})' },
    ]);
    mockGetAllTestCases.mockResolvedValue([]);
  });

   it('renders edit actions for each tab', async () => {
     render(
       <MemoryRouter initialEntries={['/projects/proj-1/requirements/req-1/test-cases']}>
         <Routes>
           <Route path="/projects/:projectId/requirements/:id/test-cases" element={<TestCaseRepository />} />
         </Routes>
       </MemoryRouter>
     );

     // Wait for test cases to load
     const loginFlowCell = await screen.findByText('Login flow');
     fireEvent.click(loginFlowCell.closest('tr') as HTMLElement);

     // Wait for details to load
     await waitFor(() => expect(screen.getByText('Open login page')).toBeInTheDocument());

     // Click on tabs to reveal their edit buttons
     await waitFor(() => expect(screen.getByRole('button', { name: /edit steps/i })).toBeInTheDocument());
     await waitFor(() => expect(screen.getByRole('button', { name: /edit data/i })).toBeInTheDocument());
     await waitFor(() => expect(screen.getByRole('button', { name: /edit script/i })).toBeInTheDocument());
   });
});
