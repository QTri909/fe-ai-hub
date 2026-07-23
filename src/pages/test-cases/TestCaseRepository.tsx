import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { historyApi } from '@/features/history/api/history.api';

// Helper to format steps to Gherkin
const formatStepsToGherkin = (steps: any[]): string => {
  if (!steps || steps.length === 0) return '';
  
  return steps.map((step, index) => {
    const action = step.action || step.actionDescription || '';
    if (index === 0) {
      return `Given ${action}`;
    } else if (index === steps.length - 1) {
      return `Then ${action}`;
    } else if (index === 1) {
      return `When ${action}`;
    } else {
      return `And ${action}`;
    }
  }).join('\n');
};

import { Search, Filter, Play, Trash, Code, Edit3, Save, X, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { testCaseApi, type TestCase } from '@/features/project/api/testCases.api';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';

export const TestCaseRepository = () => {
  const navigate = useNavigate();
  const [selectedTc, setSelectedTc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'data' | 'script' | 'history'>('steps');

  const { id: reqId, projectId } = useParams<{ id: string; projectId: string }>();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [steps, setSteps] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [editingTab, setEditingTab] = useState<'steps' | 'data' | 'script' | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [editingDataId, setEditingDataId] = useState<number | null>(null);
  const [editingScriptId, setEditingScriptId] = useState<number | null>(null);
  const [stepEditForm, setStepEditForm] = useState({
    stepOrder: 1,
    actionDescription: '',
    expectedResult: '',
  });
  const [dataEditForm, setDataEditForm] = useState({
    dataName: '',
    inputData: '',
    expectedData: '',
  });
  const [scriptEditForm, setScriptEditForm] = useState({ scriptName: '', scriptContent: '' });

  // Checkbox selection
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);

  // Add to Suite modal state
  const [isAddToSuiteModalOpen, setIsAddToSuiteModalOpen] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [isLoadingSuites, setIsLoadingSuites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newSuiteName, setNewSuiteName] = useState('');
  const [newSuiteDescription, setNewSuiteDescription] = useState('');
  const [isCreatingSuite, setIsCreatingSuite] = useState(false);

  // Generate Script modal state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateBaseUrl, setGenerateBaseUrl] = useState('');

  // Real-time Logs state
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveLogs]);

  // Multiple Test Data matrix states
  const [isCreatingData, setIsCreatingData] = useState(false);
  const [newDataForm, setNewDataForm] = useState({
    dataName: '',
    inputData: '',
    expectedData: ''
  });

  // TestCase history states
  const [tcHistory, setTcHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    if (!selectedTc) return;
    try {
      setIsLoadingHistory(true);
      const data = await historyApi.getTestCaseRunHistory(selectedTc.testCaseId);
      setTcHistory(data?.runHistory || []);
    } catch (error) {
      console.error('Failed to fetch test case history:', error);
      setTcHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history' && selectedTc) {
      fetchHistory();
    }
  }, [activeTab, selectedTc]);

  const handleOpenAddDataModal = () => {
    setNewDataForm({
      dataName: '',
      inputData: '{\n  \n}',
      expectedData: '{\n  \n}'
    });
    setIsCreatingData(true);
  };

  const handleSaveNewData = async () => {
    if (!selectedTc) return;
    try {
      const parseJsonValue = (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };

      await testCaseApi.createTestData(selectedTc.testCaseId, {
        dataName: newDataForm.dataName,
        inputData: parseJsonValue(newDataForm.inputData),
        expectedData: parseJsonValue(newDataForm.expectedData)
      });

      setIsCreatingData(false);
      await refreshDetails();
    } catch (error) {
      console.error('Failed to create test data:', error);
      alert('Failed to create test data.');
    }
  };

  const handleDeleteData = async (testDataId: number) => {
    if (!selectedTc) return;
    if (!window.confirm('Are you sure you want to delete this test data?')) return;
    try {
      await testCaseApi.deleteTestData(selectedTc.testCaseId, testDataId);
      await refreshDetails();
    } catch (error) {
      console.error('Failed to delete test data:', error);
      alert('Failed to delete test data.');
    }
  };

  const connectToWebSocket = (testCaseId: number) => {
    const socketUrl = 'http://localhost:8080/ws-execution';
    const runIdStr = `run-single-${testCaseId}`;
    const topic = `/topic/test-run/${runIdStr}`;
    
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

  React.useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setIsLoading(true);
        if (reqId) {
          const data = await testCaseApi.getTestCasesByRequirement(reqId);
          setTestCases(data);
        } else {
          const data = await testCaseApi.getAllTestCases();
          setTestCases(data);
        }
      } catch (error) {
        console.error('Failed to fetch test cases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestCases();
  }, [reqId]);

  const refreshDetails = async () => {
    if (!selectedTc) {
      setSteps([]);
      setTestData([]);
      setScripts([]);
      return;
    }
    try {
      setIsLoadingDetails(true);
      const [stepsData, testDataVal, scriptsData] = await Promise.all([
        testCaseApi.getTestCaseSteps(selectedTc.testCaseId),
        testCaseApi.getTestCaseTestData(selectedTc.testCaseId),
        testCaseApi.getTestCaseScripts(selectedTc.testCaseId),
      ]);
      setSteps(stepsData);
      setTestData(testDataVal);
      setScripts(scriptsData);
    } catch (error) {
      console.error('Failed to fetch test case details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  React.useEffect(() => {
    if (!selectedTc) {
      setSteps([]);
      setTestData([]);
      setScripts([]);
      return;
    }
    refreshDetails();
  }, [selectedTc]);

  const resetEditStates = () => {
    setEditingTab(null);
    setEditingStepId(null);
    setEditingDataId(null);
    setEditingScriptId(null);
  };

  const handleToggleSelect = (tcId: number) => {
    setSelectedTestCaseIds((prev) =>
      prev.includes(tcId) ? prev.filter((id) => id !== tcId) : [...prev, tcId]
    );
  };

  const handleToggleAll = () => {
    if (selectedTestCaseIds.length === testCases.length) {
      setSelectedTestCaseIds([]);
    } else {
      setSelectedTestCaseIds(testCases.map((tc) => tc.testCaseId));
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
    if (isCreateMode) {
      // Create new suite then add test cases
      if (!newSuiteName.trim() || !projectId) return;
      try {
        setIsCreatingSuite(true);
const newSuite = await testSuiteApi.createTestSuite({
          projectId: projectId,
          suiteName: newSuiteName.trim(),
          description: newSuiteDescription.trim(),
          testCaseIds: selectedTestCaseIds,
        });
        setIsAddToSuiteModalOpen(false);
        setSelectedTestCaseIds([]);
        alert('Successfully created new test suite and added test cases!');
      } catch (error) {
        console.error('Failed to create suite:', error);
        alert('Failed to create test suite. Please try again.');
      } finally {
        setIsCreatingSuite(false);
      }
    } else {
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
    }
  };

  const handleDeleteTestCase = async (tcId: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this test case? This will remove it from all test suites and cannot be undone.'
      )
    )
      return;
    try {
      await testCaseApi.deleteTestCase(tcId);
      setTestCases((prev) => prev.filter((tc) => tc.testCaseId !== tcId));
      if (selectedTc?.testCaseId === tcId) {
        setSelectedTc(null);
      }
      alert('Test case deleted successfully.');
    } catch (error) {
      console.error('Failed to delete test case:', error);
      alert('Failed to delete test case. Please try again.');
    }
  };

  const startStepEdit = (step: any) => {
    setEditingTab('steps');
    setEditingStepId(step.testStepId ?? null);
    setStepEditForm({
      stepOrder: Number(step.stepOrder ?? 1),
      actionDescription: step.actionDescription ?? step.action ?? '',
      expectedResult: step.expectedResult ?? '',
    });
  };

  const saveStepEdit = async (step: any) => {
    if (!selectedTc || editingStepId === null) return;
    try {
      await testCaseApi.updateTestStep(selectedTc.testCaseId, editingStepId, {
        stepOrder: Number(stepEditForm.stepOrder),
        actionDescription: stepEditForm.actionDescription,
        expectedResult: stepEditForm.expectedResult,
      });
      await refreshDetails();
      resetEditStates();
    } catch (error) {
      console.error('Failed to update test step:', error);
      alert('Failed to update test step.');
    }
  };

  const startDataEdit = (item: any) => {
    setEditingTab('data');
    setEditingDataId(item.testDataId ?? null);
    setDataEditForm({
      dataName: item.dataName ?? '',
      inputData:
        typeof item.inputData === 'string'
          ? item.inputData
          : JSON.stringify(item.inputData ?? '', null, 2),
      expectedData:
        typeof item.expectedData === 'string'
          ? item.expectedData
          : JSON.stringify(item.expectedData ?? '', null, 2),
    });
  };

  const saveDataEdit = async () => {
    if (!selectedTc || editingDataId === null) return;
    try {
      const parseJsonValue = (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };
      await testCaseApi.updateTestData(selectedTc.testCaseId, editingDataId, {
        dataName: dataEditForm.dataName,
        inputData: parseJsonValue(dataEditForm.inputData),
        expectedData: parseJsonValue(dataEditForm.expectedData),
      });
      await refreshDetails();
      resetEditStates();
    } catch (error) {
      console.error('Failed to update test data:', error);
      alert('Failed to update test data.');
    }
  };

  const startScriptEdit = (item: any) => {
    setEditingTab('script');
    setEditingScriptId(item.scriptId ?? null);
    setScriptEditForm({
      scriptName: item.scriptName ?? '',
      scriptContent: item.scriptContent ?? '',
    });
  };

  const saveScriptEdit = async () => {
    if (!selectedTc || editingScriptId === null) return;
    try {
      await testCaseApi.updateScript(selectedTc.testCaseId, editingScriptId, {
        scriptContent: scriptEditForm.scriptContent,
      });
      await refreshDetails();
      resetEditStates();
    } catch (error) {
      console.error('Failed to update test script:', error);
      alert('Failed to update test script.');
    }
  };

  const handleOpenGenerateModal = () => {
    setGenerateBaseUrl('');
    setIsGenerateModalOpen(true);
  };

  const handleGenerateScript = async () => {
    if (!selectedTc) return;
    if (!generateBaseUrl) {
      alert('Please enter a base URL.');
      return;
    }

    try {
      setIsGeneratingScript(true);
      setIsGenerateModalOpen(false);
      const response = await testCaseApi.generateScript(
        selectedTc.testCaseId,
        generateBaseUrl,
        'javascript',
        'playwright'
      );

      // Debug: Log response
      console.log('Generate script response:', response);

      // Backend returns scriptContent as string and testData as list
      if (response.success) {
        if (response.scriptContent && typeof response.scriptContent === 'string') {
          setScripts([
            {
              scriptId: Date.now(),
              scriptName: response.scriptName || 'Generated Script',
              scriptLanguage: response.scriptLanguage || 'javascript',
              framework: response.framework || 'playwright',
              scriptContent: response.scriptContent,
            },
          ]);
        }
        if (response.testData && Array.isArray(response.testData)) {
          setTestData(
            response.testData.map((d: any, idx: number) => ({
              testDataId: Date.now() + idx,
              dataName: d.dataName || '',
              inputData: d.inputData || '',
              expectedData: d.expectedData || '',
            }))
          );
        }
        alert('Script and test data generated successfully!');
      } else {
        alert(
          'Failed to generate script: ' + (response.message || 'Unknown error from AI service')
        );
      }
    } catch (error: any) {
      console.error('Failed to generate script:', error);
      alert('Failed to generate script: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRunScript = async () => {
    if (!selectedTc) return;
    if (scripts.length === 0) {
      alert('Please generate a script first before running tests.');
      return;
    }

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
      baseUrl = window.prompt('Enter base URL to run tests against:', '') || '';
    }
    if (!baseUrl.trim()) {
      alert('Base URL is required to run tests.');
      return;
    }

    try {
      setIsGeneratingScript(true);
      setIsLogsModalOpen(true);
      connectToWebSocket(selectedTc.testCaseId);
      
      const response = await testCaseApi.executeScript(selectedTc.testCaseId, baseUrl);

      // Cập nhật status ngay trên danh sách và panel chi tiết mà không cần reload
      const newStatus = response.passed ? 'PASSED' : 'FAILED';
      setTestCases((prev) =>
        prev.map((tc) =>
          tc.testCaseId === selectedTc.testCaseId ? { ...tc, status: newStatus } : tc
        )
      );
      setSelectedTc((prev: any) => (prev ? { ...prev, status: newStatus } : prev));

      // Luôn luôn refresh dữ liệu để cập nhật script/URL mới từ DB trước khi bung thông báo chặn UI
      await refreshDetails();

      if (response.passed) {
        setLiveLogs(prev => [...prev, `\n✅ Test passed successfully! Duration: ${response.executionTime}ms`]);
      } else {
        let msg = `\n❌ Test failed after ${response.attempts || 1} attempts. Error: ${response.errorMessage || 'Unknown'}`;
        if (response.scriptUpdated) {
          msg += '\n\n🔄 Script has been auto-updated (Check the latest script code!).';
        }
        setLiveLogs(prev => [...prev, msg]);
      }
    } catch (error: any) {
      console.error('Failed to run script:', error);
      setLiveLogs(prev => [...prev, `\n🚨 Failed to run script: ${error.response?.data?.message || error.message}`]);
    } finally {
      setIsGeneratingScript(false);
      disconnectWebSocket();
    }
  };

  const closeLogsModal = () => {
    setIsLogsModalOpen(false);
    disconnectWebSocket();
  };

  return (
    <div className="relative z-0 flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Test Case Repository</h1>
        <button
          onClick={() => navigate(`/projects/${projectId}/test-runner`)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Play size={18} fill="currentColor" />
          Run Selected Tests
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        {/* Toolbar */}
        <div className="flex items-center gap-4 border-b border-gray-800 p-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search test cases..."
              className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2 pr-4 pl-10 text-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800">
            <Filter size={18} />
            Filter
          </button>

          {selectedTestCaseIds.length > 0 && (
            <button
              onClick={handleOpenAddToSuite}
              className="animate-fade-in flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Add to Test Suite ({selectedTestCaseIds.length})
            </button>
          )}
        </div>

        {/* Master-Detail Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Master List */}
          <div className={`flex-1 overflow-auto ${selectedTc ? 'border-r border-gray-800' : ''}`}>
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-sm">
                <tr>
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 bg-gray-900"
                      checked={
                        testCases.length > 0 && selectedTestCaseIds.length === testCases.length
                      }
                      onChange={handleToggleAll}
                    />
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-400">Code</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Req</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc) => (
                  <tr
                    key={tc.testCaseId}
                    onClick={() => setSelectedTc(tc)}
                    className={`cursor-pointer border-t border-gray-800/50 transition-colors hover:bg-gray-800/50 ${selectedTc?.testCaseId === tc.testCaseId ? 'bg-gray-800/50' : ''}`}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-700 bg-gray-900"
                        checked={selectedTestCaseIds.includes(tc.testCaseId)}
                        onChange={() => handleToggleSelect(tc.testCaseId)}
                      />
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-300">{tc.testCaseCode}</td>
                    <td className="p-4 font-medium text-gray-200">{tc.title}</td>
                    <td className="p-4 text-sm text-gray-500">{tc.requirementId}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          tc.status === 'PASSED' || tc.status === 'APPROVED'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : tc.status === 'FAILED'
                              ? 'border-red-500/20 bg-red-500/10 text-red-400'
                              : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {tc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details Panel */}
          {selectedTc && (
            <div className="flex w-1/2 flex-col overflow-hidden bg-gray-900">
              <div className="border-b border-gray-800 bg-gray-950/30 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-sm text-indigo-400">
                    {selectedTc.testCaseCode}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteTestCase(selectedTc.testCaseId)}
                      className="rounded p-1 text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Delete Test Case"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedTc(null)}
                      className="text-gray-500 hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">{selectedTc.title}</h2>
                <div className="mb-4">
                  <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Expected Result
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={selectedTc.expectedResult || ''}
                      placeholder="Enter expected result..."
                      className="flex-1 rounded border border-gray-800 bg-gray-950 px-3 py-1.5 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
                      onBlur={async (e) => {
                        const val = e.target.value;
                        if (val !== selectedTc.expectedResult) {
                          try {
                            await testCaseApi.updateTestCase(selectedTc.testCaseId, {
                              expectedResult: val,
                            });
                            setSelectedTc({ ...selectedTc, expectedResult: val });
                            setTestCases(
                              testCases.map((tc) =>
                                tc.testCaseId === selectedTc.testCaseId
                                  ? { ...tc, expectedResult: val }
                                  : tc
                              )
                            );
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Gherkin Display */}
                {steps.length > 0 && (
                  <div className="mb-4">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Gherkin
                    </span>
                    <pre className="rounded-lg border border-gray-800 bg-gray-950/50 p-3 text-xs text-emerald-300 whitespace-pre-wrap">
                      {selectedTc.description || formatStepsToGherkin(steps)}
                    </pre>
                  </div>
                )}

                {/* Tabs + Generate/Run Script Button */}
                <div className="flex items-center justify-between border-b border-gray-800">
                  <div className="flex gap-4">
                    {['steps', 'data', 'script', 'history'].map((tab) => {
                      const label =
                        tab === 'steps'
                          ? 'Test steps'
                          : tab === 'data'
                            ? 'Test data'
                            : tab === 'script'
                              ? 'Test script'
                              : 'Execution history';
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          className={`border-b-2 pb-3 text-sm font-medium capitalize transition-colors ${
                            activeTab === tab
                              ? 'border-indigo-500 text-indigo-400'
                              : 'border-transparent text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    {steps.length > 0 && (
                      <button
                        onClick={handleOpenGenerateModal}
                        disabled={isGeneratingScript}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Code size={14} />
                        {isGeneratingScript ? 'Generating...' : 'Generate Script + Test Data'}
                      </button>
                    )}
                    {scripts.length > 0 && (
                      <button
                        onClick={handleRunScript}
                        disabled={isGeneratingScript}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                      >
                        <Play size={14} />
                        {isGeneratingScript ? 'Running...' : 'Run Script'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 min-h-0 p-6 ${
                  activeTab === 'script' ? 'flex flex-col overflow-hidden' : 'overflow-auto'
                }`}
              >
                {isLoadingDetails ? (
                  <div className="text-sm text-gray-400">Loading details...</div>
                ) : (
                  <>
                    {activeTab === 'steps' && (
                      <div>
                        {steps.length > 0 ? (
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
                                {steps.map((step: any, idx: number) => {
                                  const isEditing =
                                    editingStepId === (step.testStepId ?? null) &&
                                    editingTab === 'steps';
                                  return (
                                    <tr
                                      key={step.testStepId || idx}
                                      className="border-b border-gray-800 bg-gray-950 last:border-0 hover:bg-gray-800/50"
                                    >
                                      <td className="px-4 py-3 text-center text-gray-500">
                                        {isEditing ? (
                                          <input
                                            value={stepEditForm.stepOrder}
                                            onChange={(e) =>
                                              setStepEditForm({
                                                ...stepEditForm,
                                                stepOrder: Number(e.target.value),
                                              })
                                            }
                                            className="w-16 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-center text-sm"
                                            type="number"
                                            min="1"
                                          />
                                        ) : (
                                          step.stepOrder || idx + 1
                                        )}
                                      </td>
                                      <td className="px-4 py-3">
                                        {isEditing ? (
                                          <div className="space-y-2">
                                            <textarea
                                              value={stepEditForm.actionDescription}
                                              onChange={(e) =>
                                                setStepEditForm({
                                                  ...stepEditForm,
                                                  actionDescription: e.target.value,
                                                })
                                              }
                                              className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                                              rows={3}
                                            />
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => saveStepEdit(step)}
                                                className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs"
                                              >
                                                <Save size={12} /> Save
                                              </button>
                                              <button
                                                onClick={() => resetEditStates()}
                                                className="flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs"
                                              >
                                                <X size={12} /> Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="whitespace-pre-wrap">
                                              {step.actionDescription ?? step.action ?? ''}
                                            </div>
                                            <button
                                              onClick={() => startStepEdit(step)}
                                              className="p-1 text-indigo-400 hover:text-indigo-300"
                                              aria-label="Edit steps"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 whitespace-pre-wrap">
                                        {isEditing ? (
                                          <textarea
                                            value={stepEditForm.expectedResult}
                                            onChange={(e) =>
                                              setStepEditForm({
                                                ...stepEditForm,
                                                expectedResult: e.target.value,
                                              })
                                            }
                                            className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                                            rows={3}
                                          />
                                        ) : (
                                          (step.expectedResult ?? '')
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-500">
                            No steps generated for this test case.
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'data' && (
                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        <div className="mb-4 flex justify-end">
                          <button
                            onClick={handleOpenAddDataModal}
                            className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700 cursor-pointer"
                          >
                            <Plus size={14} /> Add Test Data
                          </button>
                        </div>

                        {isCreatingData && (
                          <div className="mb-4 rounded-lg border border-indigo-850/40 bg-indigo-950/10 p-3 space-y-2">
                            <div className="text-xs font-bold text-indigo-400">New Test Data Matrix Row</div>
                            <input
                              value={newDataForm.dataName}
                              onChange={(e) =>
                                setNewDataForm({
                                  ...newDataForm,
                                  dataName: e.target.value,
                                })
                              }
                              placeholder="Data Name (e.g. valid credentials)"
                              className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm text-white"
                            />
                            <textarea
                              value={newDataForm.inputData}
                              onChange={(e) =>
                                setNewDataForm({
                                  ...newDataForm,
                                  inputData: e.target.value,
                                })
                              }
                              placeholder='Input Data JSON (e.g. {"username": "user1"})'
                              className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm text-white"
                              rows={4}
                            />
                            <textarea
                              value={newDataForm.expectedData}
                              onChange={(e) =>
                                setNewDataForm({
                                  ...newDataForm,
                                  expectedData: e.target.value,
                                })
                              }
                              placeholder='Expected Data JSON (e.g. {"status": "success"})'
                              className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm text-white"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveNewData}
                                className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs text-white"
                              >
                                <Save size={12} /> Save
                              </button>
                              <button
                                onClick={() => setIsCreatingData(false)}
                                className="flex items-center gap-1 rounded bg-gray-700 px-3 py-1 text-xs text-white"
                              >
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {testData.length > 0 ? (
                          testData.map((data: any) => {
                            const isEditing =
                              editingDataId === (data.testDataId ?? null) && editingTab === 'data';
                            return (
                              <div
                                key={data.testDataId}
                                className="mb-4 rounded-lg border border-gray-800 p-3"
                              >
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      value={dataEditForm.dataName}
                                      onChange={(e) =>
                                        setDataEditForm({
                                          ...dataEditForm,
                                          dataName: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                                    />
                                    <textarea
                                      value={dataEditForm.inputData}
                                      onChange={(e) =>
                                        setDataEditForm({
                                          ...dataEditForm,
                                          inputData: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm"
                                      rows={6}
                                    />
                                    <textarea
                                      value={dataEditForm.expectedData}
                                      onChange={(e) =>
                                        setDataEditForm({
                                          ...dataEditForm,
                                          expectedData: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm"
                                      rows={6}
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={saveDataEdit}
                                        className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs"
                                      >
                                        <Save size={12} /> Save
                                      </button>
                                      <button
                                        onClick={() => resetEditStates()}
                                        className="flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs"
                                      >
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between">
                                      {data.dataName && (
                                        <div className="mb-1 text-xs font-semibold text-gray-400">
                                          {data.dataName}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => startDataEdit(data)}
                                          className="p-1 text-indigo-400 hover:text-indigo-300 transition"
                                          aria-label="Edit data"
                                        >
                                          <Edit3 size={14} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteData(data.testDataId)}
                                          className="p-1 text-red-400 hover:text-red-300 transition"
                                          aria-label="Delete data"
                                        >
                                          <Trash size={14} />
                                        </button>
                                      </div>
                                    </div>
                                    <pre className="max-h-48 overflow-auto font-mono text-sm text-emerald-400">
                                      {data.inputData}
                                    </pre>
                                    {data.expectedData && (
                                      <pre className="mt-2 max-h-48 overflow-auto border-t border-gray-800 pt-2 font-mono text-sm text-blue-400">
                                        {data.expectedData}
                                      </pre>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No test data generated for this test case.
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'script' && (
                      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-800 bg-gray-950 p-4">
                        {scripts.length > 0 ? (
                          scripts.map((script: any) => {
                            const isEditing =
                              editingScriptId === (script.scriptId ?? null) &&
                              editingTab === 'script';
                            return (
                              <div
                                key={script.scriptId}
                                className="mb-4 flex min-h-0 flex-1 flex-col rounded-lg border border-gray-800 p-3 last:mb-0"
                              >
                                {isEditing ? (
                                  <div className="flex min-h-0 flex-1 flex-col">
                                    <input
                                      value={scriptEditForm.scriptName}
                                      onChange={(e) =>
                                        setScriptEditForm({
                                          ...scriptEditForm,
                                          scriptName: e.target.value,
                                        })
                                      }
                                      className="mb-2 w-full shrink-0 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                                    />
                                    <textarea
                                      value={scriptEditForm.scriptContent}
                                      onChange={(e) =>
                                        setScriptEditForm({
                                          ...scriptEditForm,
                                          scriptContent: e.target.value,
                                        })
                                      }
                                      className="min-h-0 w-full flex-1 resize-none overflow-auto rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm whitespace-pre-wrap text-gray-300"
                                    />
                                    <div className="mt-2 flex shrink-0 gap-2">
                                      <button
                                        onClick={saveScriptEdit}
                                        className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs"
                                      >
                                        <Save size={12} /> Save
                                      </button>
                                      <button
                                        onClick={() => resetEditStates()}
                                        className="flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs"
                                      >
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex min-h-0 flex-1 flex-col">
                                    <div className="mb-2 flex shrink-0 items-center justify-between">
                                      <div className="text-xs text-gray-500">
                                        {script.scriptName} (
                                        {script.scriptLanguage || script.framework})
                                      </div>
                                      <button
                                        onClick={() => startScriptEdit(script)}
                                        className="p-1 text-indigo-400 hover:text-indigo-300"
                                        aria-label="Edit script"
                                      >
                                        <Edit3 size={14} />
                                      </button>
                                    </div>
                                    <pre className="min-h-0 flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap text-gray-300">
                                      {script.scriptContent}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No script generated for this test case.
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'history' && (
                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        {isLoadingHistory ? (
                          <div className="text-sm text-gray-500">Loading history...</div>
                        ) : tcHistory && tcHistory.length > 0 ? (
                          <div className="overflow-x-auto rounded-lg border border-gray-800">
                            <table className="w-full text-left text-sm text-gray-300">
                              <thead className="border-b border-gray-800 bg-gray-900 text-xs text-gray-400 uppercase">
                                <tr>
                                  <th className="px-4 py-2">Run ID</th>
                                  <th className="px-4 py-2">Environment</th>
                                  <th className="px-4 py-2">Status</th>
                                  <th className="px-4 py-2">Execution Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tcHistory.map((run) => (
                                  <tr key={run.runId} className="border-b border-gray-800 bg-gray-950 last:border-0 hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-bold text-indigo-400">RUN-{run.runId}</td>
                                    <td className="px-4 py-3">{run.environment || 'STAGING'}</td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        run.itemStatus === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                      }`}>
                                        {run.itemStatus}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                      {new Date(run.executionTime).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No execution history found for this test case.</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Suite Modal */}
      {isAddToSuiteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-white">
              Add {selectedTestCaseIds.length} Test Case(s) to Test Suite
            </h3>

            {/* Toggle Selection Mode */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setIsCreateMode(false)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  !isCreateMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Select Existing
              </button>
              <button
                onClick={() => setIsCreateMode(true)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isCreateMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Create New
              </button>
            </div>

            {isCreateMode ? (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400 uppercase">
                    Suite Name
                  </label>
                  <input
                    type="text"
                    value={newSuiteName}
                    onChange={(e) => setNewSuiteName(e.target.value)}
                    placeholder="Enter suite name..."
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-400 uppercase">
                    Description
                  </label>
                  <textarea
                    value={newSuiteDescription}
                    onChange={(e) => setNewSuiteDescription(e.target.value)}
                    placeholder="Optional description..."
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
            ) : isLoadingSuites ? (
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
                disabled={isCreateMode ? !newSuiteName.trim() || isCreatingSuite : !selectedSuiteId || isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (isCreateMode ? 'Creating...' : 'Adding...') : (isCreateMode ? 'Create & Add' : 'Add to Suite')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Script Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Generate Script + Test Data</h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-sm text-gray-400">
              Script will be generated with JavaScript + Playwright framework. Enter the base URL below.
            </p>

            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-semibold text-gray-400 uppercase">
                Base URL
              </label>
              <input
                type="text"
                value={generateBaseUrl}
                onChange={(e) => setGenerateBaseUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
              />
              <div className="mt-2 text-xs text-gray-500">
                Language: <span className="text-indigo-400">JavaScript</span> | Framework: <span className="text-indigo-400">Playwright</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGeneratingScript ? 'Generating...' : 'Generate Now'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Live Logs Modal */}
      {isLogsModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="flex h-full max-h-[80vh] w-full max-w-4xl flex-col rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play size={18} className="text-indigo-400" />
                Live Execution Logs - {selectedTc?.testCaseCode}
              </h3>
              <button
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
                {isGeneratingScript ? (
                  <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span> Test is running...</>
                ) : (
                  <><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Execution finished.</>
                )}
              </div>
              <button
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