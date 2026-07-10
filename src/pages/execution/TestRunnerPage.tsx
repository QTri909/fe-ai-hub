import React, { useState, useEffect, useRef } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Terminal, AlertCircle } from 'lucide-react';
import { httpClient } from '@/infrastructure/http/client';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';
import { useParams } from 'react-router-dom';
import { appConfig } from '@/core/config/app.config';

export const TestRunnerPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuiteIds, setSelectedSuiteIds] = useState<number[]>([]);
  const [isLoadingSuites, setIsLoadingSuites] = useState(false);
  
  const [baseUrl, setBaseUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<string>('Idle');
  
  const [logs, setLogs] = useState<string[]>([]);
  const [structuredResults, setStructuredResults] = useState<any>(null);

  useEffect(() => {
    if (projectId) {
      setIsLoadingSuites(true);
      testSuiteApi.getTestSuitesByProject(projectId)
        .then((res: any) => {
          const suites = Array.isArray(res) ? res : res?.content || res?.data || [];
          setTestSuites(suites.filter((s: TestSuite) => s.status !== 'DEPRECATED'));
        })
        .finally(() => setIsLoadingSuites(false));
    }
  }, [projectId]);

  const handleToggleSuite = (id: number) => {
    setSelectedSuiteIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const pollExecutionResults = (suiteId: number) => {
    const maxAttempts = 120; // 10 minutes total (5s * 120)
    let attempt = 0;
    
    const poll = async () => {
      try {
        const res = await httpClient.get(`/core-management-service/api/v1/test-pipeline/results/${suiteId}`);
        const data = res.data;
        
        if (data.is_completed) {
          setIsRunning(false);
          setStatus('Completed');
          
          if (data.playwright_results_raw) {
            try {
              const pwData = JSON.parse(data.playwright_results_raw);
              setStructuredResults({
                playwright: pwData,
                expected: data.expected_results
              });
            } catch (e) {
              console.error("Failed to parse JSON result", e);
            }
          } else {
             setStructuredResults({ expected: data.expected_results });
          }
        } else {
          attempt++;
          if (attempt < maxAttempts) {
             setTimeout(poll, 5000);
          } else {
             setIsRunning(false);
             setStatus('Timeout waiting for results');
          }
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
        setIsRunning(false);
        setStatus('Failed');
      }
    };
    
    poll();
  };

  const handleRun = async () => {
    if (selectedSuiteIds.length === 0) return;
    const suiteId = selectedSuiteIds[0]; 
    
    setIsRunning(true);
    setStatus('Preparing environment...');
    setLogs(['Execution queued. Waiting for tests to finish...']);
    setStructuredResults(null);
    
    try {
      await httpClient.post(`/core-management-service/api/v1/test-pipeline/execute`, {
        testSuiteIds: selectedSuiteIds,
        baseUrl: baseUrl || null
      });
      
      setStatus('Running Test Scripts...');
      pollExecutionResults(suiteId);
      
    } catch (error) {
      console.error("Failed to start execution", error);
      setIsRunning(false);
      setStatus('Failed');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] p-8 max-w-[1400px] mx-auto w-full bg-slate-50 text-slate-900">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Test Execution Runner</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${
              status === 'Idle' ? 'text-gray-400' :
              status === 'Running' || status.includes('Preparing') ? 'text-blue-600 animate-pulse' :
              status === 'Failed' ? 'text-red-600' : 
              status.includes('Previous Run') ? 'text-orange-500' : 'text-emerald-600'
            }`}>{status}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Base URL (e.g. https://staging.app.com)" 
            className="w-80 bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 shadow-sm transition-colors"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
          <button 
            onClick={handleRun}
            disabled={isRunning || selectedSuiteIds.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-200 text-sm"
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'Running...' : `Run (${selectedSuiteIds.length})`}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Panel: Queue & Suites */}
        <div className="w-1/3 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 tracking-tight">Test Suites</h2>
          </div>
          <div className="p-5 flex-1 overflow-auto space-y-4 bg-slate-50/50">
            {isLoadingSuites ? (
              <div className="text-gray-500 text-sm">Loading test suites...</div>
            ) : testSuites.length === 0 ? (
              <div className="text-gray-500 text-sm">No test suites available.</div>
            ) : (
              testSuites.map(suite => (
                <div 
                  key={suite.suiteId}
                  onClick={() => handleToggleSuite(suite.suiteId)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSuiteIds.includes(suite.suiteId) 
                      ? 'bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      checked={selectedSuiteIds.includes(suite.suiteId!)}
                      onChange={() => handleToggleSuite(suite.suiteId!)}
                      disabled={isRunning}
                    />
                    <div>
                      <h4 className={`font-bold ${selectedSuiteIds.includes(suite.suiteId!) ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {suite.suiteName}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{suite.totalTestCases} Test Cases</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {status.includes('Preparing') && (
              <div className="flex items-center p-3 mt-4 bg-blue-50 rounded-xl border border-blue-100 animate-pulse">
                <Loader2 size={18} className="text-blue-500 animate-spin mr-3" />
                <span className="text-sm font-medium text-blue-700">Auto-Agent is checking data and exploring UI...</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Terminal & Results */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Simple Execution View */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col p-6 min-h-[400px]">
            
            {/* Header Status */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Execution Results</h2>
              
              {isRunning && (
                <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                  <span className="font-bold text-sm">
                    {logs.some(l => l.includes('AI Brain') || l.includes('Healing')) 
                      ? '✨ AI Agent is auto-healing the script...' 
                      : 'Running test cases...'}
                  </span>
                </div>
              )}
            </div>

            {/* Empty State (Not Started) */}
            {!isRunning && !structuredResults && status === 'Idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <CheckCircle2 size={48} className="mb-4 text-gray-200" />
                <p className="font-medium">Select a test suite and click Run to see results.</p>
              </div>
            )}

            {/* Empty State (Completed but no results found) */}
            {!isRunning && !structuredResults && status === 'Completed' && (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <Terminal size={24} className="text-gray-400" />
                </div>
                <p className="font-bold text-lg text-gray-900 mb-2">No Test Results</p>
                <p className="text-sm text-center max-w-md">
                  This test suite finished executing, but no structured results were generated. This might happen if the test script was completely empty or failed to compile.
                </p>
              </div>
            )}

            {/* Error State if Failed before finishing */}
            {!isRunning && status === 'Failed' && !structuredResults && (
              <div className="flex-1 flex flex-col items-center justify-center text-red-600">
                <XCircle size={48} className="mb-4 text-red-200" />
                <p className="font-bold text-lg mb-2">Execution Failed</p>
                <p className="text-sm text-red-500 font-medium">A system error occurred. Please check the backend console.</p>
              </div>
            )}

            {/* Loading Skeleton */}
            {isRunning && !structuredResults && (
              <div className="flex-1 flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Structured Test Results Detail */}
            {structuredResults && (
              <div className="flex flex-col gap-4">
                
                {/* Individual Test Cases */}
                <div className="space-y-4 mt-2">
                  {Object.entries(structuredResults.expected || {}).map(([tcCode, steps]: any) => {
                    // Find matching playwright result for this TC
                    let pwSpec = null;
                    const allSpecs: any[] = [];
                    const collectSpecs = (suites: any[]) => {
                      for (const suite of suites || []) {
                        const suiteSpecs = (suite.specs || []).map((s: any) => ({
                          ...s,
                          _suiteTitle: suite.title,
                          _suiteFile: suite.file
                        }));
                        allSpecs.push(...suiteSpecs);
                        collectSpecs(suite.suites || []);
                      }
                    };
                    collectSpecs(structuredResults.playwright?.suites || []);
                    pwSpec = allSpecs.find((s: any) => 
                      s.title?.includes(tcCode) || 
                      s.file?.includes(tcCode) ||
                      s._suiteTitle?.includes(tcCode) ||
                      s._suiteFile?.includes(tcCode)
                    );

                    const globalErrorsExist = structuredResults.playwright?.errors?.length > 0;
                    const isPassed = pwSpec?.ok === true;
                    const isFailed = (pwSpec && !pwSpec.ok) || (!pwSpec && globalErrorsExist);
                    
                    // Extract step results from playwright
                    const pwSteps: any[] = pwSpec?.tests?.[0]?.results?.[0]?.steps || [];
                    const failedStep = pwSteps.find((s: any) => s.error);
                    const errorMsg = failedStep?.error?.message
                      || pwSpec?.tests?.[0]?.results?.[0]?.error?.message
                      || pwSpec?.tests?.[0]?.results?.[0]?.errors?.[0]?.message;

                    // Get TC title from playwright spec
                    const tcTitle = pwSpec?.title?.replace(tcCode + ': ', '') || tcCode;

                    return (
                      <div key={tcCode} className={`rounded-xl border overflow-hidden transition-all shadow-sm ${
                        isPassed ? 'border-emerald-200 bg-white' 
                        : isFailed ? 'border-red-200 bg-white' 
                        : 'border-gray-200 bg-white'
                      }`}>
                        {/* TC Header */}
                        <div className={`flex justify-between items-center p-4 ${
                          isPassed ? 'bg-emerald-50/50'
                          : isFailed ? 'bg-red-50/50'
                          : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            {isPassed ? <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                             : isFailed ? <XCircle className="text-red-500 flex-shrink-0" size={20} />
                             : <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0" />}
                            <div>
                              <span className="font-bold text-gray-900">{tcCode}</span>
                              {pwSpec?.title && (
                                <span className="text-gray-500 text-sm ml-2 font-medium">{tcTitle}</span>
                              )}
                            </div>
                          </div>
                          {isPassed && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Passed</span>}
                          {isFailed && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Failed</span>}
                          {!isPassed && !isFailed && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Not Run</span>}
                        </div>

                        {/* Step breakdown for failed TCs */}
                        {isFailed && pwSteps.length > 0 && (
                          <div className="border-t border-red-100 bg-white">
                            {pwSteps.map((step: any, idx: number) => {
                              const stepFailed = !!step.error;
                              const stepPassed = !step.error && step.duration > 0;
                              return (
                                <div key={idx} className={`flex items-start gap-3 px-5 py-3 border-b border-gray-100 last:border-0 ${stepFailed ? 'bg-red-50/30' : ''}`}>
                                  <div className="flex-shrink-0 mt-0.5">
                                    {stepFailed 
                                      ? <XCircle size={16} className="text-red-500" />
                                      : stepPassed 
                                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                                        : <div className="w-4 h-4 rounded-full bg-gray-200" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-medium ${stepFailed ? 'text-red-800' : 'text-gray-700'}`}>
                                      {step.title}
                                    </span>
                                    {stepFailed && step.error?.message && (
                                      <div className="mt-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                        <pre className="text-xs text-red-800 font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">
                                          {step.error.message.split('\n').slice(0, 5).join('\n')}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs font-medium text-gray-400 flex-shrink-0">{step.duration}ms</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Fallback error if no steps (global error or old-style scripts) */}
                        {isFailed && pwSteps.length === 0 && errorMsg && (
                          <div className="border-t border-red-100 p-4 bg-red-50/50">
                            <pre className="text-sm text-red-800 font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">{errorMsg.split('\n').slice(0, 6).join('\n')}</pre>
                          </div>
                        )}
                        {isFailed && pwSteps.length === 0 && !errorMsg && globalErrorsExist && (
                          <div className="border-t border-red-100 p-4 bg-red-50/50">
                            <pre className="text-sm text-red-800 font-mono whitespace-pre-wrap break-all max-h-32 overflow-auto">
                              {structuredResults.playwright?.errors.map((e: any) => e.message || e).join('\n').split('\n').slice(0, 6).join('\n')}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};
