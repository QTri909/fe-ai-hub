import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Edit, Trash2, X, ChevronDown, ChevronRight, Loader2, CheckCircle2, Play } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';
import { testRunApi } from '@/features/project/api/testRuns.api';
import { testCaseApi } from '@/features/project/api/testCases.api';
import { httpClient } from '@/infrastructure/http/client';
import { useAuthStore } from '@/core/store/auth.store';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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

  const navigate = useNavigate();

  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  const [availableTestCases, setAvailableTestCases] = useState<Array<{ testCaseId: number; testCaseCode: string; title: string }>>([]);
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(false);
  const [isTestCaseDropdownOpen, setIsTestCaseDropdownOpen] = useState(false);

  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [isExecutingSuite, setIsExecutingSuite] = useState<TestSuite | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveLogs]);

  const fetchTestRuns = async () => {
    if (!projectId) return;
    try {
      setIsLoadingRuns(true);
      const data = await testRunApi.getRunsByProject(projectId);
      setTestRuns(data || []);
    } catch (error) {
      console.error('Failed to fetch test runs:', error);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTestRuns();
    }
  }, [projectId]);

  const connectToWebSocket = (runId: number) => {
    const socketUrl = 'http://localhost:8080/ws-execution';
    const topic = `/topic/test-run/${runId}`;
    setLiveLogs(['🔌 Connecting to execution engine...']);
    const accessToken = useAuthStore.getState().accessToken;
    const connectHeaders: Record<string, string> = {};
    if (accessToken) {
      connectHeaders.Authorization = `Bearer ${accessToken}`;
    }
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setLiveLogs(prev => [...prev, `✅ Connected. Listening for logs...`]);
        client.subscribe(topic, (message) => {
          setLiveLogs(prev => [...prev, message.body]);
        });
      },
      onStompError: (frame) => {
        setLiveLogs(prev => [...prev, `❌ WebSocket Error: ${frame.headers['message']}`]);
      },
      onWebSocketClose: () => {
        setLiveLogs(prev => [...prev, `🔌 Connection closed.`]);
      }
    });
    client.activate();
    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  };

  const closeLogsModal = () => {
    setIsLogsModalOpen(false);
    disconnectWebSocket();
  };

  const fetchSuites = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const data = await testSuiteApi.getTestSuitesByProject(projectId);
      setSuites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
      setSuites([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSuites();
  }, [fetchSuites]);

  const [isLinkingFlow, setIsLinkingFlow] = useState<Record<number, boolean>>({});

  const handleLinkFlow = async (suiteId: number) => {
    setIsLinkingFlow(prev => ({ ...prev, [suiteId]: true }));
    try {
      await testSuiteApi.linkFlow(suiteId);
      await fetchSuites();
    } catch (error) {
      console.error('Failed to link flow', error);
      alert('Failed to link flow. See console for details.');
    } finally {
      setIsLinkingFlow(prev => ({ ...prev, [suiteId]: false }));
    }
  };

  const handleRunTests = async (suiteId: number) => {
    let baseUrl = '';
    if (projectId) {
      try {
        const { environmentsApi } = await import('@/features/project/api/environments.api');
        const envs = await environmentsApi.getEnvironmentsByProject(projectId);
        const validEnvs = envs.filter(e => e.baseUrl && e.baseUrl.trim() !== '');
        const defaultEnv = validEnvs.find(e => e.isDefault) || validEnvs[0];
        if (defaultEnv && defaultEnv.baseUrl) {
          baseUrl = defaultEnv.baseUrl;
        }
      } catch (err) {
        console.error('Failed to auto-fetch environment base URL:', err);
      }
    }
    if (!baseUrl) {
      baseUrl = window.prompt("Enter base URL to run tests against:", "") || "";
    }
    if (!baseUrl.trim()) {
      alert("Base URL is required to run tests.");
      return;
    }
    const suite = suites.find(s => s.suiteId === suiteId);
    try {
      setIsExecutingSuite(suite || null);
      setIsLogsModalOpen(true);
      const runRes = await httpClient.post('/core-managerment-service/api/v1/test-runs', {
        suiteId,
        projectId,
        environment: baseUrl
      });
      const runId = runRes.data.runId;
      connectToWebSocket(runId);
      const response = await testSuiteApi.executeTestSuite(suiteId, baseUrl, runId);
      setLiveLogs(prev => [...prev, `\n✅ Execution finished. Status: ${response.status}. Passed: ${response.passed}/${response.total}`]);
      await fetchSuites();
      await fetchTestRuns();
    } catch (error: any) {
      console.error('Failed to run tests', error);
      setLiveLogs(prev => [...prev, `\n🚨 Failed to run test suite: ${error.response?.data?.message || error.message}`]);
    } finally {
      setIsExecutingSuite(null);
    }
  };

  const handleToggleExpand = async (suiteId: number) => {
    if (expandedSuiteId === suiteId) {
      setExpandedSuiteId(null);
      return;
    }
    setExpandedSuiteId(suiteId);
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
        httpClient.get(`/core-managerment-service/api/test-cases/${testCase.testCaseId}/steps`).then(r => r.data),
        httpClient.get(`/core-managerment-service/api/test-cases/${testCase.testCaseId}/test-data`).then(r => r.data)
      ]);
      setTcDetails({ steps: Array.isArray(stepsRes) ? stepsRes : [], data: Array.isArray(dataRes) ? dataRes : [] });
    } catch (e) {
      console.error(e);
      setTcDetails({ steps: [], data: [] });
    } finally {
      setIsLoadingTcDetails(false);
    }
  };

  const fetchAvailableTestCases = async () => {
    try {
      setIsLoadingTestCases(true);
      const data = await testCaseApi.getAllTestCases();
      setAvailableTestCases(
        (data || []).map(tc => ({
          testCaseId: tc.testCaseId,
          testCaseCode: tc.testCaseCode,
          title: tc.title
        }))
      );
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
    } finally {
      setIsLoadingTestCases(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditForm({ suiteName: '', description: '', status: 'DRAFT' });
    setSelectedTestCaseIds([]);
    setIsTestCaseDropdownOpen(false);
    setIsModalOpen(true);
    fetchAvailableTestCases();
  };

  const handleOpenEditModal = async (suite: TestSuite) => {
    setEditForm(suite);
    setSelectedTestCaseIds([]);
    setIsTestCaseDropdownOpen(false);
    setIsModalOpen(true);
    await fetchAvailableTestCases();
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
          testCaseIds: selectedTestCaseIds
        });
      }
      setIsModalOpen(false);
      setEditForm(null);
      setSelectedTestCaseIds([]);
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

  const toggleTestCase = (id: number) => {
    setSelectedTestCaseIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedTestCasesLabel = availableTestCases
    .filter(tc => selectedTestCaseIds.includes(tc.testCaseId))
    .map(tc => `${tc.testCaseCode} - ${tc.title}`)
    .join(', ') || 'Select test cases...';

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Test Suites</h1>
        <div className="flex gap-3">
          <button
            onClick={handleOpenCreateModal}
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
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/projects/${projectId}/test-suites/${suite.suiteId}`)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-left"
                      >
                        {suite.suiteName}
                      </button>
                    </td>
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
                          onClick={() => navigate(`/projects/${projectId}/test-suites/${suite.suiteId}`)}
                          className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-800"
                          title="View suite details"
                        >
                          <ChevronRight size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(suite)}
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

                  {expandedSuiteId === suite.suiteId && (
                    <tr className="bg-gray-950/50 border-t border-gray-800/30">
                      <td colSpan={6} className="p-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Assigned Test Cases</h3>
                            <div className="flex gap-2">
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
                              <button
                                onClick={() => handleRunTests(suite.suiteId)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Play size={14} />
                                Run Tests
                              </button>
                            </div>
                          </div>
                          {suite.isE2eFlow && (
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/20 flex items-center gap-2 w-fit mb-3">
                              <CheckCircle2 size={16} /> E2E Flow Linked
                            </span>
                          )}
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

                          <div className="mt-6 pt-6 border-t border-gray-800">
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Suite Execution History</h3>
                            {isLoadingRuns ? (
                              <div className="text-sm text-gray-500">Loading history...</div>
                            ) : (
                              (() => {
                                const suiteRuns = testRuns.filter(r => r.testSuite?.suiteId === suite.suiteId);
                                if (suiteRuns.length === 0) {
                                  return <div className="text-gray-500 text-sm py-2">No execution runs recorded for this suite.</div>;
                                }
                                return (
                                  <div className="overflow-x-auto rounded-lg border border-gray-800">
                                    <table className="w-full text-left text-sm text-gray-300">
                                      <thead className="bg-gray-950 text-xs font-semibold text-gray-400 uppercase border-b border-gray-800">
                                        <tr>
                                          <th className="py-2.5 px-4">Run ID</th>
                                          <th className="py-2.5 px-4">Environment</th>
                                          <th className="py-2.5 px-4 text-center">Total</th>
                                          <th className="py-2.5 px-4 text-center">Passed</th>
                                          <th className="py-2.5 px-4 text-center">Failed</th>
                                          <th className="py-2.5 px-4">Status</th>
                                          <th className="py-2.5 px-4">Started At</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-800 text-xs text-gray-300">
                                        {suiteRuns.map(run => (
                                          <tr key={run.runId} className="hover:bg-gray-800/40 transition cursor-pointer" onClick={() => navigate(`/projects/${projectId}/test-runs/${run.runId}`)}>
                                            <td className="py-3 px-4 font-bold text-indigo-400">RUN-{run.runId.toString().padStart(3, '0')}</td>
                                            <td className="py-3 px-4 font-mono text-[10px]">{run.environment}</td>
                                            <td className="py-3 px-4 text-center">{run.totalTests || 0}</td>
                                            <td className="py-3 px-4 text-center text-emerald-400 font-bold">{run.passedCount || 0}</td>
                                            <td className="py-3 px-4 text-center text-red-400 font-bold">{run.failedCount || 0}</td>
                                            <td className="py-3 px-4">
                                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                run.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                              }`}>
                                                {run.status}
                                              </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-400">{new Date(run.startTime).toLocaleString()}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              })()
                            )}
                          </div>
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
              {!editForm.suiteId && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Test Cases</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTestCaseDropdownOpen(prev => !prev)}
                      className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-3 py-2 text-left focus:outline-none focus:border-indigo-500 flex items-center justify-between"
                    >
                      <span className="truncate text-sm">{selectedTestCasesLabel}</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    {isTestCaseDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-[200px] overflow-y-auto border border-gray-800 rounded-lg bg-gray-900 shadow-xl">
                        {isLoadingTestCases ? (
                          <div className="text-sm text-gray-500 p-3">Loading test cases...</div>
                        ) : availableTestCases.length === 0 ? (
                          <div className="text-sm text-gray-500 p-3">No test cases available.</div>
                        ) : (
                          availableTestCases.map(tc => (
                            <label
                              key={tc.testCaseId}
                              className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTestCaseIds.includes(tc.testCaseId)}
                                onChange={() => toggleTestCase(tc.testCaseId)}
                                className="rounded border-gray-700 bg-gray-950 text-indigo-500 focus:ring-indigo-500"
                              />
                              <span className="text-indigo-400 font-mono text-xs">{tc.testCaseCode}</span>
                              <span className="text-gray-300 text-sm">{tc.title}</span>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
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
      {isLogsModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex h-full max-h-[80vh] w-full max-w-4xl flex-col rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play size={18} className="text-indigo-400" />
                Live Execution Logs - Suite: {isExecutingSuite?.suiteName}
              </h3>
              <button
                type="button"
                onClick={closeLogsModal}
                className="rounded text-gray-400 hover:bg-gray-800 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-sm text-gray-300">
              {liveLogs.length === 0 ? (
                <div className="animate-pulse text-gray-500">Waiting for logs...</div>
              ) : (
                liveLogs.map((log, index) => {
                  let colorClass = "text-gray-300";
                  if (log.includes("✅") || log.includes("PASSED") || log.includes("passed")) colorClass = "text-emerald-400";
                  if (log.includes("❌") || log.includes("🚨") || log.includes("FAILED") || log.includes("Error")) colorClass = "text-red-400";
                  if (log.includes("ℹ️") || log.includes("INFO")) colorClass = "text-blue-400";
                  if (log.includes("WARN")) colorClass = "text-yellow-400";
                  if (log.includes("[STEP]")) colorClass = "text-indigo-300 font-semibold";

                  return (
                    <div key={index} className={`mb-1 whitespace-pre-wrap break-words ${colorClass}`}>
                      {log}
                    </div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>

            <div className="border-t border-gray-800 bg-gray-900 p-4 rounded-b-xl flex justify-between items-center">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {isExecutingSuite ? (
                  <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span> Test is running...</>
                ) : (
                  <><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Execution finished.</>
                )}
              </div>
              <button
                type="button"
                onClick={closeLogsModal}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};