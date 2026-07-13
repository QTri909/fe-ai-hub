import React, { useState, useEffect } from 'react';
import { Wand2, Save, Play, RefreshCw, AlertCircle, Edit, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '@/infrastructure/http/client';
import { requirementApi, type Requirement } from '@/features/project/api/requirements.api';
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
  const { projectId, id: reqId } = useParams<{ projectId: string, id: string }>();
  
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

  useEffect(() => {
    if (projectId && reqId) {
      requirementApi.getRequirementsByProjectId(projectId, 0, 100).then(res => {
        const req = res.content?.find((r: Requirement) => r.id === reqId);
        if (req) setRequirement(req);
      });
    }
  }, [projectId, reqId]);

  const [baseUrl, setBaseUrl] = useState<string>('https://example.com');
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await httpClient.post(`/core-management-service/api/v1/requirements/${reqId}/generate-test-cases`, {
        scriptLanguage: 'JAVASCRIPT',
        framework: 'playwright',
        maxTestCases: 5,
        generateScript: false,
        generateTestData: false,
        maxLajRetries: 3,
        baseUrl: baseUrl
      }, {
        timeout: 120000 // 2 minutes for AI generation
      });
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
    setSelectedTestCaseIds(prev =>
      prev.includes(tcId) ? prev.filter(id => id !== tcId) : [...prev, tcId]
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
      console.error("Failed to fetch test suites:", error);
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
      alert("Successfully added test cases to suite!");
    } catch (error) {
      console.error("Failed to add test cases to suite:", error);
      alert("Failed to add test cases to suite. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Context Area */}
      <div className="w-1/3 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-1">AI Test Generation</h2>
          <p className="text-sm text-gray-400">Configure AI settings to generate test cases.</p>
        </div>
        
        <div className="p-6 flex-1 overflow-auto space-y-6">
          <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            {/* Requirement Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-mono">
                  {requirement?.requirementKey || 'AUT-3'}
                </span>
                <h4 className="text-white font-semibold">{requirement?.title || 'Verify Register'}</h4>
              </div>
            </div>
            
            {/* User Story & Description */}
            <div className="p-4 border-b border-gray-800">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">User Story</div>
              <div className="text-sm text-gray-300 leading-relaxed">
                {requirement?.description ? (
                  parseDescription(requirement.description) ? (
                    <RequirementContent content={parseDescription(requirement.description)} />
                  ) : (
                    <p className="whitespace-pre-wrap">{requirement.description}</p>
                  )
                ) : (
                  <p>As a new visitor of Automation Exercise, I want to register for a new account using my email and personal details, so that I can purchase products and manage my orders.</p>
                )}
              </div>
            </div>

            {/* Acceptance Criteria */}
            {requirement?.acceptanceCriteriaList && requirement.acceptanceCriteriaList.length > 0 ? (
              <div className="p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Acceptance Criteria ({requirement.acceptanceCriteriaList.length})</div>
                <div className="space-y-3">
                  {requirement.acceptanceCriteriaList.map((ac, index) => (
                    <div key={ac.id} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-300 flex-1">{ac.content}</p>
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

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-indigo-400 shrink-0" size={20} />
            <div className="text-sm text-indigo-200">
              <p><strong>Note:</strong> Test Script generation and Language/Framework selection will be available after the human review step.</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* AI Output Area */}
      <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
          <div className="flex items-center gap-3">
            {generatedCases.length > 0 && (
              <input 
                type="checkbox" 
                className="rounded border-gray-700 bg-gray-900"
                checked={selectedTestCaseIds.length > 0 && selectedTestCaseIds.length === generatedCases.filter((tc: any) => tc.testCaseId).length}
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
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium animate-fade-in"
              >
                Add to Test Suite ({selectedTestCaseIds.length})
              </button>
            )}
            {generatedCases.length > 0 && (
              <button 
                onClick={() => navigate(`/projects/${projectId}/requirements/${reqId}/test-cases`)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Go to Test Repository
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {isGenerating ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                  <div className="h-5 bg-gray-800 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : generatedCases.length > 0 ? (
            <div className="space-y-4">
              {generatedCases.map((tc, index) => (
                <div key={tc.testCaseId || tc.testCaseCode || index} className="bg-gray-950 border border-gray-800 rounded-lg p-6 relative group flex gap-4">
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
                  <div className="flex-1 min-w-0">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingIndex(index);
                          setEditForm({...tc});
                        }}
                        className="text-gray-400 hover:text-indigo-400"><Edit size={16} /></button>
                    </div>
                    <h3 className="text-indigo-400 font-bold mb-4 font-mono text-sm">Scenario: {tc.scenario || tc.title}</h3>
                    {tc.precondition && (
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Preconditions</span>
                        <p className="text-sm text-gray-300">{tc.precondition}</p>
                      </div>
                    )}
                    {tc.steps && tc.steps.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Test Steps</span>
                        <div className="overflow-x-auto rounded-lg border border-gray-800">
                          <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-800">
                              <tr>
                                <th className="px-4 py-2 w-12 text-center">#</th>
                                <th className="px-4 py-2">Action</th>
                                <th className="px-4 py-2">Expected Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tc.steps.map((step: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                                  <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                                  <td className="px-4 py-3 whitespace-pre-wrap">{step.action || step.actionDescription}</td>
                                  <td className="px-4 py-3 whitespace-pre-wrap">{step.expected_result || step.expectedResult}</td>
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
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Wand2 size={48} className="mb-4 opacity-20" />
              <p>Click "Generate Now" to let AI create test cases</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingIndex !== null && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-[600px] max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
              <h2 className="text-lg font-bold text-white">Edit Test Case</h2>
              <button onClick={() => setEditingIndex(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 flex-1 overflow-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title / Scenario</label>
                <input 
                  type="text" 
                  value={editForm.title || editForm.scenario || ''} 
                  onChange={e => setEditForm({...editForm, title: e.target.value, scenario: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Precondition</label>
                <textarea 
                  rows={3}
                  value={editForm.precondition || ''} 
                  onChange={e => setEditForm({...editForm, precondition: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-950/50">
              <button onClick={() => setEditingIndex(null)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">Cancel</button>
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
                    alert("Failed to save changes to backend");
                  }
                }}  
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Suite Modal */}
      {isAddToSuiteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add {selectedTestCaseIds.length} Test Case(s) to Test Suite</h3>
            
            {isLoadingSuites ? (
              <div className="text-gray-400 text-sm">Loading test suites...</div>
            ) : testSuites.length === 0 ? (
              <div className="text-gray-400 text-sm mb-6">
                No test suites found for this project. Please create a test suite first.
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase">Select Test Suite</label>
                <select 
                  value={selectedSuiteId || ''} 
                  onChange={e => setSelectedSuiteId(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose a Test Suite --</option>
                  {testSuites.map(suite => (
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
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddToSuiteSubmit}
                disabled={!selectedSuiteId || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
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