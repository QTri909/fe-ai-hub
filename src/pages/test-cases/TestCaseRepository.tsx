import React, { useState } from 'react';

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

import { Search, Filter, Play, Trash, Code, Edit3, Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { testCaseApi, type TestCase } from '@/features/project/api/testCases.api';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';

export const TestCaseRepository = () => {
  const navigate = useNavigate();
  const [selectedTc, setSelectedTc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'data' | 'script'>('steps');

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

  // Generate Script modal state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateBaseUrl, setGenerateBaseUrl] = useState('');

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

    const baseUrl =
      window.prompt('Enter base URL to run tests against:', 'https://example.com') || '';
    if (!baseUrl) return;

    try {
      setIsGeneratingScript(true);
      const response = await testCaseApi.executeScript(selectedTc.testCaseId, baseUrl);

      // Luôn luôn refresh dữ liệu để cập nhật script/URL mới từ DB trước khi bung thông báo chặn UI
      await refreshDetails();

      if (response.passed) {
        alert('Test passed successfully! Duration: ' + response.executionTime + 'ms');
      } else {
        let msg =
          'Test failed after ' +
          response.attempts +
          ' attempts. Error: ' +
          (response.errorMessage || 'Unknown');
        if (response.scriptUpdated) {
          msg += '\n\nScript has been auto-updated (Check the latest script code!).';
        }
        alert(msg);
      }
    } catch (error: any) {
      console.error('Failed to run script:', error);
      alert('Failed to run script: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsGeneratingScript(false);
    }
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
                          tc.status === 'APPROVED'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
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
                    {['steps', 'data', 'script'].map((tab) => {
                      const label =
                        tab === 'steps'
                          ? 'Test steps'
                          : tab === 'data'
                            ? 'Test data'
                            : 'Test script';
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
                                      <button
                                        onClick={() => startDataEdit(data)}
                                        className="p-1 text-indigo-400 hover:text-indigo-300"
                                        aria-label="Edit data"
                                      >
                                        <Edit3 size={14} />
                                      </button>
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
                                  <div className="space-y-2">
                                    <input
                                      value={scriptEditForm.scriptName}
                                      onChange={(e) =>
                                        setScriptEditForm({
                                          ...scriptEditForm,
                                          scriptName: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
                                    />
                                    <textarea
                                      value={scriptEditForm.scriptContent}
                                      onChange={(e) =>
                                        setScriptEditForm({
                                          ...scriptEditForm,
                                          scriptContent: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm"
                                      rows={14}
                                    />
                                    <div className="flex gap-2">
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
    </div>
  );
};