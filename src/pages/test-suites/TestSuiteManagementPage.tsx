import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, X, ChevronDown, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';
import { httpClient } from '@/infrastructure/http/client';

export interface TestCaseDetails {
  testCaseId?: number;
  testCaseCode?: string;
  title?: string;
  description?: string;
  precondition?: string;
  expectedResult?: string;
  status?: string;
}

export interface TestStep {
  testStepId?: number;
  stepOrder?: number;
  actionDescription?: string;
  expectedResult?: string;
}

export interface SuiteItem {
  suiteItemId: number;
  testCase?: TestCaseDetails;
}

export const TestSuiteManagementPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoE2eModalOpen, setIsAutoE2eModalOpen] = useState(false);
  const [autoE2ePrompt, setAutoE2ePrompt] = useState('');
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TestSuite> | null>(null);

  const [expandedSuiteId, setExpandedSuiteId] = useState<number | null>(null);
  const [suiteItems, setSuiteItems] = useState<Record<number, SuiteItem[]>>({});
  const [isLoadingItems, setIsLoadingItems] = useState<Record<number, boolean>>({});

  const [selectedTestCaseForDetails, setSelectedTestCaseForDetails] = useState<TestCaseDetails | null>(null);
  const [tcDetails, setTcDetails] = useState<{steps: TestStep[], data: unknown[]}>({ steps: [], data: [] });
  const [isLoadingTcDetails, setIsLoadingTcDetails] = useState(false);

  const fetchSuites = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const data = await testSuiteApi.getTestSuitesByProject(projectId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSuites(Array.isArray(data) ? data : (data as any)?.content || (data as any)?.data || []);
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
      setSuites([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSuites();
  }, [fetchSuites]);

  const [isLinkingFlow, setIsLinkingFlow] = useState<Record<number, boolean>>({});

  const handleLinkFlow = async (suiteId: number) => {
    setIsLinkingFlow(prev => ({ ...prev, [suiteId]: true }));
    try {
      await testSuiteApi.linkFlow(suiteId);
      // Refresh suites
      await fetchSuites();
    } catch (error) {
      console.error('Failed to link flow', error);
      alert('Failed to link flow. See console for details.');
    } finally {
      setIsLinkingFlow(prev => ({ ...prev, [suiteId]: false }));
    }
  };

  const handleToggleExpand = async (suiteId: number) => {
    if (expandedSuiteId === suiteId) {
      setExpandedSuiteId(null);
      return;
    }
    setExpandedSuiteId(suiteId);
    
    // Fetch if not already fetched
    if (!suiteItems[suiteId]) {
      try {
        setIsLoadingItems(prev => ({ ...prev, [suiteId]: true }));
        const items = await testSuiteApi.getTestSuiteItems(suiteId);
        setSuiteItems(prev => ({ ...prev, [suiteId]: items }));
      } catch (error) {
        console.error('Failed to fetch suite items', error);
      } finally {
        setIsLoadingItems(prev => ({ ...prev, [suiteId]: false }));
      }
    }
  };

  const handleViewTestCaseDetails = async (testCase?: TestCaseDetails) => {
    if (!testCase || !testCase.testCaseId) return;
    setSelectedTestCaseForDetails(testCase);
    setIsLoadingTcDetails(true);
    try {
      const [stepsRes, dataRes] = await Promise.all([
        httpClient.get(`/core-management-service/api/test-cases/${testCase.testCaseId}/steps`).then(r => r.data),
        httpClient.get(`/core-management-service/api/test-cases/${testCase.testCaseId}/test-data`).then(r => r.data)
      ]);
      setTcDetails({ steps: Array.isArray(stepsRes) ? stepsRes : [], data: Array.isArray(dataRes) ? dataRes : [] });
    } catch (e) {
      console.error(e);
      setTcDetails({ steps: [], data: [] });
    } finally {
      setIsLoadingTcDetails(false);
    }
  };

  const handleSave = async () => {
    if (!projectId || !editForm?.suiteName) return;
    try {
      if (editForm.suiteId) {
        await testSuiteApi.updateTestSuite(editForm.suiteId, {
          suiteName: editForm.suiteName,
          description: editForm.description || '',
          status: editForm.status || 'DRAFT'
        });
      } else {
        await testSuiteApi.createTestSuite({
          suiteName: editForm.suiteName,
          description: editForm.description || '',
          projectId: projectId,
          testCaseIds: []
        });
      }
      setIsModalOpen(false);
      setEditForm(null);
      fetchSuites();
    } catch (error) {
      console.error('Failed to save test suite:', error);
      alert('Failed to save test suite');
    }
  };

  const handleAutoCreateE2ESuite = async () => {
    if (!autoE2ePrompt.trim() || !projectId) return;
    setIsAutoCreating(true);
    try {
      await httpClient.post(`/api/test-suites/project/${projectId}/auto-create-e2e`, { prompt: autoE2ePrompt });
      await fetchSuites();
      setIsAutoE2eModalOpen(false);
      setAutoE2ePrompt('');
    } catch (error) {
      console.error('Failed to auto create E2E suite:', error);
      alert('Failed to auto create E2E suite. See console.');
    } finally {
      setIsAutoCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this Test Suite?')) {
      try {
        await testSuiteApi.deleteTestSuite(id);
        fetchSuites();
      } catch (error) {
        console.error('Failed to delete test suite:', error);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Test Suites</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAutoE2eModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:scale-105"
          >
            ✨ Ask AI (Auto E2E)
          </button>
          <button 
            onClick={() => {
              setEditForm({ suiteName: '', description: '', status: 'DRAFT' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Create Suite
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search test suites..." 
              className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-950/50 sticky top-0">
              <tr>
                <th className="p-4 text-sm font-medium text-gray-400">Code</th>
                <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                <th className="p-4 text-sm font-medium text-gray-400">Description</th>
                <th className="p-4 text-sm font-medium text-gray-400">Test Cases</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suites.map(suite => (
                <React.Fragment key={suite.suiteId}>
                  <tr className="border-t border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleExpand(suite.suiteId)}
                        className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 focus:outline-none"
                      >
                        {expandedSuiteId === suite.suiteId ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <span className="font-mono text-sm">{suite.suiteCode}</span>
                      </button>
                    </td>
                    <td className="p-4 text-gray-200 font-medium">{suite.suiteName}</td>
                    <td className="p-4 text-gray-500 text-sm">{suite.description}</td>
                    <td className="p-4 text-gray-300">{suite.totalTestCases}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-800 text-gray-300 border-gray-700">
                        {suite.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditForm(suite);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(suite.suiteId)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row showing Test Cases */}
                  {expandedSuiteId === suite.suiteId && (
                    <tr className="bg-gray-950/50 border-t border-gray-800/30">
                      <td colSpan={6} className="p-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Assigned Test Cases</h3>
                            {!suite.isE2eFlow && (
                              <button 
                                onClick={() => handleLinkFlow(suite.suiteId)} 
                                disabled={isLinkingFlow[suite.suiteId]}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                              >
                                {isLinkingFlow[suite.suiteId] ? <Loader2 size={16} className="animate-spin" /> : null}
                                Link as E2E Flow
                              </button>
                            )}
                            {suite.isE2eFlow && (
                              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/20 flex items-center gap-2">
                                <CheckCircle2 size={16} /> E2E Flow Linked
                              </span>
                            )}
                          </div>
                          {isLoadingItems[suite.suiteId] ? (
                            <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                              <Loader2 size={16} className="animate-spin" /> Loading test cases...
                            </div>
                          ) : suiteItems[suite.suiteId] && suiteItems[suite.suiteId].length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {suiteItems[suite.suiteId].map((item) => (
                                <button 
                                  key={item.suiteItemId} 
                                  onClick={() => handleViewTestCaseDetails(item.testCase)}
                                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors text-left"
                                >
                                  <span className="text-indigo-400 font-mono text-xs font-bold">{item.testCase?.testCaseCode || 'TC-???'}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    item.testCase?.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-900 text-gray-400'
                                  }`}>
                                    {item.testCase?.status || 'DRAFT'}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm py-2">No test cases assigned to this suite yet.</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {suites.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No Test Suites found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-[500px] shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editForm.suiteId ? 'Edit Test Suite' : 'Create Test Suite'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Suite Name *</label>
                <input 
                  type="text" 
                  value={editForm.suiteName || ''} 
                  onChange={e => setEditForm({...editForm, suiteName: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={editForm.description || ''} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              {editForm.suiteId && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={editForm.status || 'DRAFT'}
                    onChange={e => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DEPRECATED">DEPRECATED</option>
                  </select>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-950/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={!editForm.suiteName}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >Save Test Suite</button>
            </div>
          </div>
        </div>
      )}

      {/* Test Case Details Modal */}
      {selectedTestCaseForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-[800px] max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400 font-mono">{selectedTestCaseForDetails.testCaseCode}</span>
                {selectedTestCaseForDetails.title}
              </h2>
              <button onClick={() => setSelectedTestCaseForDetails(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 overflow-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Description</h3>
                <p className="text-gray-200 text-sm">{selectedTestCaseForDetails.description || 'No description.'}</p>
              </div>
              {selectedTestCaseForDetails.precondition && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Precondition</h3>
                  <p className="text-gray-200 text-sm">{selectedTestCaseForDetails.precondition}</p>
                </div>
              )}
              {selectedTestCaseForDetails.expectedResult && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Overall Expected Result</h3>
                  <p className="text-gray-200 text-sm">{selectedTestCaseForDetails.expectedResult}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Test Steps</h3>
                {isLoadingTcDetails ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 size={16} className="animate-spin" /> Loading steps...</div>
                ) : tcDetails.steps.length > 0 ? (
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
                        {tcDetails.steps.map((step, idx) => (
                          <tr key={step.testStepId || idx} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 bg-gray-950">
                            <td className="px-4 py-3 text-center text-gray-500">{step.stepOrder || idx + 1}</td>
                            <td className="px-4 py-3 whitespace-pre-wrap">{step.actionDescription}</td>
                            <td className="px-4 py-3 whitespace-pre-wrap">{step.expectedResult}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm p-4 bg-gray-950 rounded-lg border border-gray-800">No steps available.</div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end bg-gray-950/50">
              <button onClick={() => setSelectedTestCaseForDetails(null)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto E2E Modal */}
      {isAutoE2eModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">✨</span> Auto Generate E2E Suite
              </h2>
              <button 
                onClick={() => !isAutoCreating && setIsAutoE2eModalOpen(false)}
                className="text-gray-400 hover:text-white"
                disabled={isAutoCreating}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-4">
                Describe the End-to-End flow you want to create. AI will automatically select the required test cases from this project and link their scripts together.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
                <textarea
                  value={autoE2ePrompt}
                  onChange={e => setAutoE2ePrompt(e.target.value)}
                  placeholder="e.g. Create an E2E flow from registering a new user, logging in, to placing an order."
                  className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 h-32 resize-none"
                  disabled={isAutoCreating}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t border-gray-800 bg-gray-900/50">
              <button
                onClick={() => setIsAutoE2eModalOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white font-medium"
                disabled={isAutoCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleAutoCreateE2ESuite}
                disabled={isAutoCreating || !autoE2ePrompt.trim()}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
              >
                {isAutoCreating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
