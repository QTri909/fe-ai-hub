import React, { useState, useEffect } from 'react';
import { Wand2, Save, Play, RefreshCw, AlertCircle, Edit, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '@/infrastructure/http/client';
import { requirementApi } from '@/features/requirements';
import type { Requirement } from '@/features/requirements';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';
import { testCaseApi } from '@/features/project/api/testCases.api';
import { RequirementContent } from '@/components/common/RequirementContent';

// Helper to parse description JSON
const parseDescription = (description: string | undefined) => {
  if (!description) return null;
  try {
    const parsed = JSON.parse(description);
    if (parsed && typeof parsed === 'object' && parsed.content) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const TestGenerationWizard = () => {
  const navigate = useNavigate();
  const { projectId, id: reqId } = useParams<{ projectId: string; id: string }>();

  const [requirement, setRequirement] = useState<Requirement | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<any[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);
  const [isAddToSuiteModalOpen, setIsAddToSuiteModalOpen] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [isLoadingSuites, setIsLoadingSuites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI Exploration settings
  const [baseUrl, setBaseUrl] = useState<string>('https://automationexercise.com');
  const [enableUIExploration, setEnableUIExploration] = useState<boolean>(false);
  const [explorationStatus, setExplorationStatus] = useState<string>('');

  useEffect(() => {
    if (projectId && reqId) {
      requirementApi.getByProjectId(projectId, 0, 100).then((res) => {
        const req = res.content?.find((r: Requirement) => r.id === reqId);
        if (req) setRequirement(req);
      });
    }
  }, [projectId, reqId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setExplorationStatus('');
    try {
      const response = await httpClient.post(
        `/core-managerment-service/api/v1/requirements/${reqId}/generate-test-cases`,
        {
          scriptLanguage: 'JAVASCRIPT',
          framework: 'playwright',
          maxTestCases: 5,
          generateScript: false,
          generateTestData: false,
          maxLajRetries: 3,
          baseUrl: baseUrl,
          enableUIExploration: enableUIExploration,
        },
        {
          timeout: 120000, // 2 minutes for AI generation
        }
      );
      if (response.data) {
        setGeneratedCases(response.data.testCases || []);
      }
    } catch (error) {
      console.error('Failed to generate test cases', error);
      alert('Failed to generate test cases. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSelect = (tcId: number) => {
    setSelectedTestCaseIds((prev) =>
      prev.includes(tcId) ? prev.filter((id) => id !== tcId) : [...prev, tcId]
    );
  };

  const handleToggleAll = () => {
    const validCases = generatedCases.filter((tc: any) => tc.testCaseId);
    if (selectedTestCaseIds.length === validCases.length) {
      setSelectedTestCaseIds([]);
    } else {
      setSelectedTestCaseIds(validCases.map((tc: any) => tc.testCaseId));
    }
  };

  const handleOpenAddToSuite = async () => {
    if (!projectId) return;
    try {
      setIsLoadingSuites(true);
      setIsAddToSuiteModalOpen(true);
      const suites = await testSuiteApi.getTestSuitesByProject(projectId);
      setTestSuites(suites);
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
    } finally {
      setIsLoadingSuites(false);
    }
  };

  const handleAddToSuiteSubmit = async () => {
    if (!selectedSuiteId || selectedTestCaseIds.length === 0) return;
    try {
      setIsSubmitting(true);
      await testSuiteApi.addTestCasesToSuite(selectedSuiteId, selectedTestCaseIds);
      setIsAddToSuiteModalOpen(false);
      setSelectedTestCaseIds([]);
      alert('Successfully added test cases to suite!');
    } catch (error) {
      console.error('Failed to add test cases to suite:', error);
      alert('Failed to add test cases to suite. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Context Area */}
      <div className="flex w-1/3 flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="border-b border-gray-800 p-6">
          <h2 className="mb-1 text-lg font-bold text-white">AI Test Generation</h2>
          <p className="text-sm text-gray-400">Configure AI settings to generate test cases.</p>
        </div>

        <div className="flex-1 space-y-6 overflow-auto p-6">
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
            {/* Requirement Header */}
            <div className="border-b border-gray-800 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-xs text-indigo-300">
                  {requirement?.requirementKey || 'AUT-3'}
                </span>
                <h4 className="font-semibold text-white">
                  {requirement?.title || 'Verify Register'}
                </h4>
              </div>
            </div>

            {/* User Story & Description */}
            <div className="border-b border-gray-800 p-4">
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">User Story</div>
              <div className="text-sm leading-relaxed text-gray-300">
                {requirement?.description ? (
                  parseDescription(requirement.description) ? (
                    <RequirementContent content={parseDescription(requirement.description)} />
                  ) : (
                    <p className="whitespace-pre-wrap">{requirement.description}</p>
                  )
                ) : (
                  <p>
                    As a new visitor of Automation Exercise, I want to register for a new account
                    using my email and personal details, so that I can purchase products and manage
                    my orders.
                  </p>
                )}
              </div>
            </div>

            {/* Acceptance Criteria */}
            {requirement?.acceptanceCriteriaList &&
            requirement.acceptanceCriteriaList.length > 0 ? (
              <div className="p-4">
                <div className="mb-3 text-xs font-semibold text-gray-500 uppercase">
                  Acceptance Criteria ({requirement.acceptanceCriteriaList.length})
                </div>
                <div className="space-y-3">
                  {requirement.acceptanceCriteriaList.map((ac, index) => (
                    <div key={ac.id} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
                        {index + 1}
                      </span>
                      <p className="flex-1 text-sm text-gray-300">{ac.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No acceptance criteria defined</p>
              </div>
            )}
          </div>

          {/* UI Exploration Settings */}
          <div className="space-y-3 rounded-lg border border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://automationexercise.com"
                className="w-48 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="uiExploration"
                checked={enableUIExploration}
                onChange={(e) => setEnableUIExploration(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900"
              />
              <label htmlFor="uiExploration" className="cursor-pointer text-sm text-gray-300">
                Enable UI Exploration Mode
              </label>
            </div>

            {explorationStatus && (
              <div className="mt-1 text-xs text-indigo-400">{explorationStatus}</div>
            )}
          </div>

          <div className="flex gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
            <AlertCircle className="shrink-0 text-indigo-400" size={20} />
            <div className="text-sm text-indigo-200">
              <p>
                <strong>Note:</strong> Test Script generation and Language/Framework selection will
                be available after the human review step.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 p-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* AI Output Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950/50 p-6">
          <div className="flex items-center gap-3">
            {generatedCases.length > 0 && (
              <input
                type="checkbox"
                className="rounded border-gray-700 bg-gray-900"
                checked={
                  selectedTestCaseIds.length > 0 &&
                  selectedTestCaseIds.length ===
                    generatedCases.filter((tc: any) => tc.testCaseId).length
                }
                onChange={handleToggleAll}
                title="Select All"
              />
            )}
            <h2 className="text-lg font-bold text-white">Generated Test Cases</h2>
          </div>
          <div className="flex gap-2">
            {selectedTestCaseIds.length > 0 && (
              <button
                onClick={handleOpenAddToSuite}
                className="animate-fade-in flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Add to Test Suite ({selectedTestCaseIds.length})
              </button>
            )}
            {generatedCases.length > 0 && (
              <button
                onClick={() => navigate(`/projects/${projectId}/requirements/${reqId}/test-cases`)}
                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Go to Test Repository
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-800 bg-gray-950 p-6">
                  <div className="mb-4 h-5 w-1/3 rounded bg-gray-800"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-800/50"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-800/50"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-800/50"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : generatedCases.length > 0 ? (
            <div className="space-y-4">
              {generatedCases.map((tc, index) => (
                <div
                  key={tc.testCaseId || tc.testCaseCode || index}
                  className="group relative flex gap-4 rounded-lg border border-gray-800 bg-gray-950 p-6"
                >
                  {tc.testCaseId && (
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        className="rounded border-gray-700 bg-gray-900"
                        checked={selectedTestCaseIds.includes(tc.testCaseId)}
                        onChange={() => handleToggleSelect(tc.testCaseId)}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditForm({ ...tc });
                        }}
                        className="text-gray-400 hover:text-indigo-400"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    <h3 className="mb-4 font-mono text-sm font-bold text-indigo-400">
                      Scenario: {tc.scenario || tc.title}
                    </h3>
                    {tc.precondition && (
                      <div className="mb-4">
                        <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Preconditions
                        </span>
                        <p className="text-sm text-gray-300">{tc.precondition}</p>
                      </div>
                    )}
                    {tc.steps && tc.steps.length > 0 && (
                      <div>
                        <span className="mb-2 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Test Steps
                        </span>
                        <div className="overflow-x-auto rounded-lg border border-gray-800">
                          <table className="w-full text-left text-sm text-gray-300">
                            <thead className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase">
                              <tr>
                                <th className="w-12 px-4 py-2 text-center">#</th>
                                <th className="px-4 py-2">Action</th>
                                <th className="px-4 py-2">Expected Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tc.steps.map((step: any, idx: number) => (
                                <tr
                                  key={idx}
                                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                                >
                                  <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                                  <td className="px-4 py-3 whitespace-pre-wrap">
                                    {step.action || step.actionDescription}
                                  </td>
                                  <td className="px-4 py-3 whitespace-pre-wrap">
                                    {step.expected_result || step.expectedResult}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <Wand2 size={48} className="mb-4 opacity-20" />
              <p>Click "Generate Now" to let AI create test cases</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingIndex !== null && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-[600px] flex-col rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950/50 p-4">
              <h2 className="text-lg font-bold text-white">Edit Test Case</h2>
              <button
                onClick={() => setEditingIndex(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-auto p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Title / Scenario
                </label>
                <input
                  type="text"
                  value={editForm.title || editForm.scenario || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value, scenario: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Precondition</label>
                <textarea
                  rows={3}
                  value={editForm.precondition || ''}
                  onChange={(e) => setEditForm({ ...editForm, precondition: e.target.value })}
                  className="w-full resize-none rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-800 bg-gray-950/50 p-4">
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await testCaseApi.updateTestCase(editForm.testCaseId, editForm);
                    const newCases = [...generatedCases];
                    newCases[editingIndex] = editForm;
                    setGeneratedCases(newCases);
                    setEditingIndex(null);
                  } catch (e) {
                    console.error(e);
                    alert('Failed to save changes to backend');
                  }
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Suite Modal */}
      {isAddToSuiteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-white">
              Add {selectedTestCaseIds.length} Test Case(s) to Test Suite
            </h3>

            {isLoadingSuites ? (
              <div className="text-sm text-gray-400">Loading test suites...</div>
            ) : testSuites.length === 0 ? (
              <div className="mb-6 text-sm text-gray-400">
                No test suites found for this project. Please create a test suite first.
              </div>
            ) : (
              <div className="mb-6 space-y-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase">
                  Select Test Suite
                </label>
                <select
                  value={selectedSuiteId || ''}
                  onChange={(e) => setSelectedSuiteId(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 p-2.5 text-gray-200 outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose a Test Suite --</option>
                  {testSuites.map((suite) => (
                    <option key={suite.suiteId} value={suite.suiteId}>
                      {suite.suiteName} ({suite.suiteCode})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddToSuiteModalOpen(false)}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToSuiteSubmit}
                disabled={!selectedSuiteId || isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add to Suite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
