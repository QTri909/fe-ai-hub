import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Play, CheckCircle2, XCircle, Clock, ChevronRight, Loader2,
  Search, RefreshCw, FileText, XCircle as XIcon
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { testSuiteApi, type TestSuite, type TestSuiteWithTestCases } from '@/features/project/api/testSuites.api';
import { testRunApi, type TestRun } from '@/features/project/api/testRuns.api';
import { environmentsApi } from '@/features/project/api/environments.api';
import { httpClient } from '@/infrastructure/http/client';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const TestSuiteDetailPage: React.FC = () => {
  const { projectId, suiteId } = useParams<{ projectId: string; suiteId: string }>();
  const navigate = useNavigate();
  const [suite, setSuite] = useState<TestSuite | null>(null);
  const [suiteDetail, setSuiteDetail] = useState<TestSuiteWithTestCases | null>(null);
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>('Idle');
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const stompClientRef = React.useRef<Client | null>(null);
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveLogs]);

  const fetchSuite = useCallback(async () => {
    if (!suiteId) return;
    try {
      setIsLoading(true);
      const detail = await testSuiteApi.getTestSuiteWithTestCases(Number(suiteId));
      setSuiteDetail(detail);
      setSuite({
        suiteId: detail.suiteId,
        suiteCode: '',
        suiteName: detail.suiteName,
        description: '',
        status: detail.status,
        totalTestCases: detail.totalTestCases,
        passRate: detail.passRate,
        isE2eFlow: false
      });
    } catch (error) {
      console.error('Failed to fetch suite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [suiteId]);

  const fetchRuns = useCallback(async () => {
    if (!suiteId) return;
    try {
      setIsLoadingRuns(true);
      const data = await testSuiteApi.getSuiteRuns(Number(suiteId));
      setRuns(data || []);
    } catch (error) {
      console.error('Failed to fetch runs:', error);
      setRuns([]);
    } finally {
      setIsLoadingRuns(false);
    }
  }, [suiteId]);

  useEffect(() => {
    fetchSuite();
    fetchRuns();
  }, [fetchSuite, fetchRuns]);

  const connectToWebSocket = (runId: number) => {
    const socketUrl = 'http://localhost:8080/ws-execution';
    const topic = `/topic/test-run/${runId}`;
    
    setLiveLogs(['🔌 Connecting to execution engine...']);
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
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

  const handleRunSuite = async () => {
    if (!projectId || !suiteId) return;
    
    let baseUrl = '';
    let authUsername: string | undefined;
    let authPassword: string | undefined;
    let envName = 'default';

    try {
      const envs = await environmentsApi.getEnvironmentsByProject(projectId);
      const validEnvs = envs.filter(e => e.baseUrl && e.baseUrl.trim() !== '');
      const defaultEnv = validEnvs.find(e => e.isDefault) || validEnvs[0];
      if (defaultEnv && defaultEnv.baseUrl) {
        baseUrl = defaultEnv.baseUrl;
        authUsername = defaultEnv.authUsername;
        authPassword = defaultEnv.authPassword;
        envName = defaultEnv.envName;
      }
    } catch (err) {
      console.error('Failed to auto-fetch environment:', err);
    }

    if (!baseUrl) {
      baseUrl = window.prompt("Enter base URL to run tests against:", "") || "";
    }
    if (!baseUrl.trim()) {
      alert("Base URL is required to run tests.");
      return;
    }

    try {
      setIsRunning(true);
      setStatus('Preparing environment...');
      setLiveLogs(['Execution started. Running tests...']);
      setIsLogsModalOpen(true);

      // 1. Create a TestRun entity first
      const runRes = await httpClient.post('/core-managerment-service/api/v1/test-runs', {
        suiteId: Number(suiteId),
        projectId,
        environment: envName
      });
      const runId = runRes.data.runId;

      // 2. Connect WebSocket
      connectToWebSocket(runId);

      // 3. Trigger execution
      const response = await testSuiteApi.executeTestSuite(
        Number(suiteId), baseUrl, runId, authUsername, authPassword, envName
      );

      setLiveLogs(prev => [...prev, `\n✅ Execution finished. Status: ${response.status}. Passed: ${response.passed}/${response.total}`]);

      // Refresh runs
      await fetchRuns();
      await fetchSuite();
    } catch (error: any) {
      console.error('Failed to run tests', error);
      setLiveLogs(prev => [...prev, `\n🚨 Failed to run test suite: ${error.response?.data?.message || error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (!ms) return '00:00';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading && !suiteDetail) {
    return <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin inline-block mr-2"/> Loading Test Suite...</div>;
  }

  if (!suiteDetail) {
    return <div className="p-8 text-center text-red-500">Suite not found.</div>;
  }

  const testCases = suiteDetail.testCases || [];

  return (
    <div className="p-8 max-w-[1400px] mx-auto text-slate-900 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/projects/${projectId}/test-suites`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium"
          >
            <ArrowLeft size={18} /> Back to Test Suites
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{suiteDetail.suiteName}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{suiteDetail.suiteId}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                suiteDetail.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                suiteDetail.status === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                'bg-red-100 text-red-700'
              }`}>
                {suiteDetail.status}
              </span>
              <span className="text-gray-400">•</span>
              <span>{testCases.length} Test Cases</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRunSuite}
            disabled={isRunning || testCases.length === 0}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'Running...' : 'Run Suite'}
          </button>
        </div>
      </div>

      {/* Suite Description */}
      {suiteDetail.description && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-gray-700 text-sm">{suiteDetail.description}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel: Test Cases */}
        <div className="col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-extrabold text-gray-900">Test Cases</h2>
            <div className="relative flex-1 max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search test cases..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {testCases.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-3 text-gray-200" />
                <p>No test cases assigned to this suite yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {testCases.map((tc: any) => (
                    <tr key={tc.testCaseId} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="py-3 px-4 font-mono text-xs text-indigo-600">{tc.testCaseCode}</td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{tc.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          tc.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tc.status || 'DRAFT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Panel: Execution History */}
        <div className="col-span-7 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-extrabold text-gray-900">Execution History</h2>
            <button
              onClick={fetchRuns}
              disabled={isLoadingRuns}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              <RefreshCw size={16} className={isLoadingRuns ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {isLoadingRuns ? (
              <div className="p-6 text-center text-gray-500">
                <Loader2 className="animate-spin inline-block mr-2" /> Loading history...
              </div>
            ) : runs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Clock size={48} className="mx-auto mb-3 text-gray-200" />
                <p>No execution runs recorded for this suite.</p>
                <p className="text-xs mt-1">Click "Run Suite" to execute all test cases.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Run ID</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Environment</th>
                    <th className="py-2.5 px-4 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="py-2.5 px-4 text-center text-xs font-medium text-gray-500 uppercase">Passed</th>
                    <th className="py-2.5 px-4 text-center text-xs font-medium text-gray-500 uppercase">Failed</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 uppercase">Started At</th>
                    <th className="py-2.5 px-4 text-right text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {runs.map(run => (
                    <tr
                      key={run.runId}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate(`/projects/${projectId}/test-runs/${run.runId}`)}
                    >
                      <td className="py-3 px-4 font-bold text-indigo-600">RUN-{run.runId.toString().padStart(3, '0')}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg text-xs">
                          <span className="w-3 h-3 rounded-sm border border-blue-600 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>
                          </span>
                          {run.environment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-800">{run.totalTests || 0}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">{run.passedCount || 0}</td>
                      <td className="py-3 px-4 text-center font-bold text-red-600">{run.failedCount || 0}</td>
                      <td className="py-3 px-4">
                        {run.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
                            <CheckCircle2 size={14} className="text-emerald-500 fill-white" /> Passed
                          </span>
                        ) : run.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1 rounded-full">
                            <XCircle size={14} className="text-red-500 fill-white" /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                            <Loader2 size={14} className="animate-spin" /> {run.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-medium">{formatDate(run.startTime)}</td>
                      <td className="py-3 px-4 text-right">
                        <ChevronRight size={20} className="text-blue-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Live Logs Modal */}
      {isLogsModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex h-full max-h-[80vh] w-full max-w-4xl flex-col rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play size={18} className="text-indigo-400" />
                Live Execution Logs - Suite: {suiteDetail.suiteName}
              </h3>
              <button
                type="button"
                onClick={closeLogsModal}
                className="rounded text-gray-400 hover:bg-gray-800 hover:text-white p-1"
              >
                <XIcon size={20} />
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
                {isRunning ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Test is running...
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Execution finished.
                  </>
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
