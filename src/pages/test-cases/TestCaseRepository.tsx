import React, { useState } from 'react';
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
  const [stepEditForm, setStepEditForm] = useState({ stepOrder: 1, actionDescription: '', expectedResult: '' });
  const [dataEditForm, setDataEditForm] = useState({ dataName: '', inputData: '', expectedData: '' });
  const [scriptEditForm, setScriptEditForm] = useState({ scriptName: '', scriptContent: '' });

  // Checkbox selection
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);
  
  // Add to Suite modal state
  const [isAddToSuiteModalOpen, setIsAddToSuiteModalOpen] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [isLoadingSuites, setIsLoadingSuites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.error("Failed to fetch test cases:", error);
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
        testCaseApi.getTestCaseScripts(selectedTc.testCaseId)
      ]);
      setSteps(stepsData);
      setTestData(testDataVal);
      setScripts(scriptsData);
    } catch (error) {
      console.error("Failed to fetch test case details:", error);
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
    setSelectedTestCaseIds(prev =>
      prev.includes(tcId) ? prev.filter(id => id !== tcId) : [...prev, tcId]
    );
  };

  const handleToggleAll = () => {
    if (selectedTestCaseIds.length === testCases.length) {
      setSelectedTestCaseIds([]);
    } else {
      setSelectedTestCaseIds(testCases.map(tc => tc.testCaseId));
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

const handleDeleteTestCase = async (tcId: number) => {
    if (!window.confirm("Are you sure you want to delete this test case? This will remove it from all test suites and cannot be undone.")) return;
    try {
      await testCaseApi.deleteTestCase(tcId);
      setTestCases(prev => prev.filter(tc => tc.testCaseId !== tcId));
      if (selectedTc?.testCaseId === tcId) {
        setSelectedTc(null);
      }
      alert("Test case deleted successfully.");
    } catch (error) {
      console.error("Failed to delete test case:", error);
      alert("Failed to delete test case. Please try again.");
    }
  };

  const startStepEdit = (step: any) => {
    setEditingTab('steps');
    setEditingStepId(step.testStepId ?? null);
    setStepEditForm({
      stepOrder: Number(step.stepOrder ?? 1),
      actionDescription: step.actionDescription ?? step.action ?? '',
      expectedResult: step.expectedResult ?? ''
    });
  };

  const saveStepEdit = async (step: any) => {
    if (!selectedTc || editingStepId === null) return;
    try {
      await testCaseApi.updateTestStep(selectedTc.testCaseId, editingStepId, {
        stepOrder: Number(stepEditForm.stepOrder),
        actionDescription: stepEditForm.actionDescription,
        expectedResult: stepEditForm.expectedResult
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
      inputData: typeof item.inputData === 'string' ? item.inputData : JSON.stringify(item.inputData ?? '', null, 2),
      expectedData: typeof item.expectedData === 'string' ? item.expectedData : JSON.stringify(item.expectedData ?? '', null, 2)
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
        expectedData: parseJsonValue(dataEditForm.expectedData)
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
      scriptContent: item.scriptContent ?? ''
    });
  };

  const saveScriptEdit = async () => {
    if (!selectedTc || editingScriptId === null) return;
    try {
      await testCaseApi.updateScript(selectedTc.testCaseId, editingScriptId, {
        scriptContent: scriptEditForm.scriptContent
      });
      await refreshDetails();
      resetEditStates();
    } catch (error) {
      console.error('Failed to update test script:', error);
      alert('Failed to update test script.');
    }
  };

  const handleGenerateScript = async () => {
    if (!selectedTc) return;
    const baseUrl = window.prompt("Enter base URL:", "https://example.com") || "";
    if (!baseUrl) return;
    
    try {
      setIsGeneratingScript(true);
      const response = await testCaseApi.generateScript(selectedTc.testCaseId, baseUrl);
      
      // Debug: Log response
      console.log("Generate script response:", response);
      
      // Backend returns scriptContent as string and testData as list
      if (response.success) {
        if (response.scriptContent && typeof response.scriptContent === 'string') {
          setScripts([{
            scriptId: Date.now(),
            scriptName: response.scriptName || 'Generated Script',
            scriptLanguage: response.scriptLanguage || 'javascript',
            framework: response.framework || 'playwright',
            scriptContent: response.scriptContent
          }]);
        }
        if (response.testData && Array.isArray(response.testData)) {
          setTestData(response.testData.map((d: any, idx: number) => ({
            testDataId: Date.now() + idx,
            dataName: d.dataName || '',
            inputData: d.inputData || '',
            expectedData: d.expectedData || ''
          })));
        }
        alert("Script and test data generated successfully!");
      } else {
        alert("Failed to generate script: " + (response.message || "Unknown error from AI service"));
      }
    } catch (error: any) {
      console.error("Failed to generate script:", error);
      alert("Failed to generate script: " + (error.response?.data?.message || error.message));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRunScript = async () => {
    if (!selectedTc) return;
    if (scripts.length === 0) {
      alert("Please generate a script first before running tests.");
      return;
    }
    
    const baseUrl = window.prompt("Enter base URL to run tests against:", "https://example.com") || "";
    if (!baseUrl) return;
    
    try {
      setIsGeneratingScript(true);
      const response = await testCaseApi.executeScript(selectedTc.testCaseId, baseUrl);
      
      // Luôn luôn refresh dữ liệu để cập nhật script/URL mới từ DB trước khi bung thông báo chặn UI
      await refreshDetails();

      if (response.passed) {
        alert("Test passed successfully! Duration: " + response.executionTime + "ms");
      } else {
        let msg = "Test failed after " + response.attempts + " attempts. Error: " + (response.errorMessage || "Unknown");
        if (response.scriptUpdated) {
          msg += "\n\nScript has been auto-updated (Check the latest script code!).";
        }
        alert(msg);
      }
    } catch (error: any) {
      console.error("Failed to run script:", error);
      alert("Failed to run script: " + (error.response?.data?.message || error.message));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Test Case Repository</h1>
        <button 
          onClick={() => navigate(`/projects/${projectId}/test-runner`)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Play size={18} fill="currentColor" />
          Run Selected Tests
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search test cases..." 
              className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-950 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          
          {selectedTestCaseIds.length > 0 && (
            <button 
              onClick={handleOpenAddToSuite}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium animate-fade-in"
            >
              Add to Test Suite ({selectedTestCaseIds.length})
            </button>
          )}
        </div>

        {/* Master-Detail Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Master List */}
          <div className={`flex-1 overflow-auto ${selectedTc ? 'border-r border-gray-800' : ''}`}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-950/50 sticky top-0">
                <tr>
                  <th className="p-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-700 bg-gray-900"
                      checked={testCases.length > 0 && selectedTestCaseIds.length === testCases.length}
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
                {testCases.map(tc => (
                  <tr 
                    key={tc.testCaseId} 
                    onClick={() => setSelectedTc(tc)}
                    className={`border-t border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedTc?.testCaseId === tc.testCaseId ? 'bg-gray-800/50' : ''}`}
                  >
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-700 bg-gray-900"
                        checked={selectedTestCaseIds.includes(tc.testCaseId)}
                        onChange={() => handleToggleSelect(tc.testCaseId)}
                      />
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-sm">{tc.testCaseCode}</td>
                    <td className="p-4 text-gray-200 font-medium">{tc.title}</td>
                    <td className="p-4 text-gray-500 text-sm">{tc.requirementId}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tc.status === 'APPROVED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
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
            <div className="w-1/2 bg-gray-900 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-800 bg-gray-950/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-400 font-mono text-sm">{selectedTc.testCaseCode}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDeleteTestCase(selectedTc.testCaseId)}
                      className="text-red-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete Test Case"
                    >
                      <Trash size={16} />
                    </button>
                    <button onClick={() => setSelectedTc(null)} className="text-gray-500 hover:text-gray-300">×</button>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedTc.title}</h2>
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Expected Result</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      defaultValue={selectedTc.expectedResult || ''}
                      placeholder="Enter expected result..."
                      className="flex-1 bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      onBlur={async (e) => {
                        const val = e.target.value;
                        if (val !== selectedTc.expectedResult) {
                          try {
                            await testCaseApi.updateTestCase(selectedTc.testCaseId, { expectedResult: val });
                            setSelectedTc({...selectedTc, expectedResult: val});
                            setTestCases(testCases.map(tc => tc.testCaseId === selectedTc.testCaseId ? {...tc, expectedResult: val} : tc));
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
{/* Tabs + Generate/Run Script Button */}
                <div className="flex justify-between items-center border-b border-gray-800">
                  <div className="flex gap-4">
                    {['steps', 'data', 'script'].map(tab => {
                      const label = tab === 'steps' ? 'Test steps' : tab === 'data' ? 'Test data' : 'Test script';
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
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
                        onClick={handleGenerateScript}
                        disabled={isGeneratingScript}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Code size={14} />
                        {isGeneratingScript ? 'Generating...' : 'Generate Script + Test Data'}
                      </button>
                    )}
                    {scripts.length > 0 && (
                      <button
                        onClick={handleRunScript}
                        disabled={isGeneratingScript}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Play size={14} />
                        {isGeneratingScript ? 'Running...' : 'Run Script'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-auto">
                {isLoadingDetails ? (
                  <div className="text-gray-400 text-sm">Loading details...</div>
                ) : (
                  <>
                    {activeTab === 'steps' && (
                      <div>
                        {steps.length > 0 ? (
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
                                {steps.map((step: any, idx: number) => {
                                  const isEditing = editingStepId === (step.testStepId ?? null) && editingTab === 'steps';
                                  return (
                                    <tr key={step.testStepId || idx} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 bg-gray-950">
                                       <td className="px-4 py-3 text-center text-gray-500">
                                         {isEditing ? (
                                             <input
                                               value={stepEditForm.stepOrder}
                                               onChange={(e) => setStepEditForm({ ...stepEditForm, stepOrder: Number(e.target.value) })}
                                               className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-center"
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
                                               onChange={(e) => setStepEditForm({ ...stepEditForm, actionDescription: e.target.value })}
                                               className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                                               rows={3}
                                             />
                                             <div className="flex gap-2">
                                               <button onClick={() => saveStepEdit(step)} className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded text-xs">
                                                 <Save size={12} /> Save
                                               </button>
                                               <button onClick={() => resetEditStates()} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded text-xs">
                                                 <X size={12} /> Cancel
                                               </button>
                                             </div>
                                           </div>
                                         ) : (
                                           <div className="flex items-start justify-between gap-2">
                                             <div className="whitespace-pre-wrap">{step.actionDescription ?? step.action ?? ''}</div>
                                             <button onClick={() => startStepEdit(step)} className="text-indigo-400 hover:text-indigo-300 p-1" aria-label="Edit steps">
                                               <Edit3 size={14} />
                                             </button>
                                           </div>
                                         )}
                                       </td>
                                      <td className="px-4 py-3 whitespace-pre-wrap">
                                        {isEditing ? (
                                          <textarea
                                            value={stepEditForm.expectedResult}
                                            onChange={(e) => setStepEditForm({ ...stepEditForm, expectedResult: e.target.value })}
                                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                                            rows={3}
                                          />
                                        ) : (
                                          step.expectedResult ?? ''
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm p-4 bg-gray-950 rounded-lg border border-gray-800">No steps generated for this test case.</div>
                        )}
                      </div>
                    )}
                    {activeTab === 'data' && (
                      <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                        {testData.length > 0 ? (
                          testData.map((data: any) => {
                            const isEditing = editingDataId === (data.testDataId ?? null) && editingTab === 'data';
                            return (
                              <div key={data.testDataId} className="mb-4 border border-gray-800 rounded-lg p-3">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      value={dataEditForm.dataName}
                                      onChange={(e) => setDataEditForm({ ...dataEditForm, dataName: e.target.value })}
                                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                                    />
                                    <textarea
                                      value={dataEditForm.inputData}
                                      onChange={(e) => setDataEditForm({ ...dataEditForm, inputData: e.target.value })}
                                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono"
                                      rows={6}
                                    />
                                    <textarea
                                      value={dataEditForm.expectedData}
                                      onChange={(e) => setDataEditForm({ ...dataEditForm, expectedData: e.target.value })}
                                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono"
                                      rows={6}
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={saveDataEdit} className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded text-xs">
                                        <Save size={12} /> Save
                                      </button>
                                      <button onClick={() => resetEditStates()} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded text-xs">
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between">
                                      {data.dataName && <div className="text-gray-400 font-semibold mb-1 text-xs">{data.dataName}</div>}
                                      <button onClick={() => startDataEdit(data)} className="text-indigo-400 hover:text-indigo-300 p-1" aria-label="Edit data">
                                        <Edit3 size={14} />
                                      </button>
                                    </div>
                                    <pre className="text-sm text-emerald-400 font-mono overflow-auto max-h-48">
                                      {data.inputData}
                                    </pre>
                                    {data.expectedData && (
                                      <pre className="text-sm text-blue-400 font-mono overflow-auto max-h-48 mt-2 border-t border-gray-800 pt-2">
                                        {data.expectedData}
                                      </pre>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-sm">No test data generated for this test case.</div>
                        )}
                      </div>
                    )}
                    {activeTab === 'script' && (
                      <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 h-full">
                        {scripts.length > 0 ? (
                          scripts.map((script: any) => {
                            const isEditing = editingScriptId === (script.scriptId ?? null) && editingTab === 'script';
                            return (
                              <div key={script.scriptId} className="mb-4 border border-gray-800 rounded-lg p-3">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      value={scriptEditForm.scriptName}
                                      onChange={(e) => setScriptEditForm({ ...scriptEditForm, scriptName: e.target.value })}
                                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                                    />
                                    <textarea
                                      value={scriptEditForm.scriptContent}
                                      onChange={(e) => setScriptEditForm({ ...scriptEditForm, scriptContent: e.target.value })}
                                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm font-mono"
                                      rows={14}
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={saveScriptEdit} className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded text-xs">
                                        <Save size={12} /> Save
                                      </button>
                                      <button onClick={() => resetEditStates()} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded text-xs">
                                        <X size={12} /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <div className="text-gray-500 text-xs mb-1">
                                        {script.scriptName} ({script.scriptLanguage || script.framework})
                                      </div>
                                      <button onClick={() => startScriptEdit(script)} className="text-indigo-400 hover:text-indigo-300 p-1" aria-label="Edit script">
                                        <Edit3 size={14} />
                                      </button>
                                    </div>
                                    <pre className="text-sm text-gray-300 font-mono overflow-auto max-h-96">
                                      {script.scriptContent}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-sm">No script generated for this test case.</div>
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
