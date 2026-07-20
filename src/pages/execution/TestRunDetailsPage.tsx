import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, Loader2, AlertCircle, Bug, RefreshCw, Download, Target, Square, Code, Minus } from 'lucide-react';
import { testRunApi } from '@/features/project/api/testRuns.api';
import type { TestRun, TestRunItem } from '@/features/project/api/testRuns.api';

export function TestRunDetailsPage() {
    const { projectId, runId } = useParams();
    const navigate = useNavigate();
    const [run, setRun] = useState<TestRun | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<TestRunItem | null>(null);

    useEffect(() => {
        if (runId) {
            testRunApi.getRunDetails(Number(runId)).then(res => {
                setRun(res);
                if (res.runItems && res.runItems.length > 0) {
                    setSelectedItem(res.runItems[0]);
                }
                setLoading(false);
            });
        }
    }, [runId]);

    const formatDuration = (ms: number) => {
        if (!ms) return '00:00:00';
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin inline-block mr-2"/> Loading Details...</div>;
    if (!run) return <div className="p-8 text-center text-red-500">Run not found.</div>;

    const skippedCount = run.totalTests - (run.passedCount || 0) - (run.failedCount || 0);

    return (
        <div className="p-8 max-w-[1400px] mx-auto text-gray-900 min-h-screen bg-gray-50/50">

            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
                <button
                    type="button"
                    onClick={() => navigate(`/projects/${projectId}/test-runs`)}
                    className="mb-6 flex items-center gap-2 text-gray-900 font-bold hover:text-black transition"
                >
                    <ArrowLeft size={18} /> Back to Test Runs
                </button>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold flex items-center gap-3 text-gray-900">
                            RUN-{run.runId.toString().padStart(3, '0')} • {run.testSuite?.suiteName}
                            {run.status === 'FAILED' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-200">
                                    <XCircle size={16} className="text-red-500" /> Failed
                                </span>
                            ) : run.status === 'COMPLETED' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Passed
                                </span>
                            ) : null}
                        </h1>
                        <div className="flex gap-6 text-sm text-gray-600 mt-3 font-medium">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm border border-gray-400 flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-sm"></span>
                                </span>
                                Environment: <strong className="text-gray-900">{run.environment}</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={16} className="text-gray-400" />
                                Started at: <strong className="text-gray-900">{new Date(run.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                            </span>
                            <span className="flex items-center gap-1.5 border-l border-gray-300 pl-6">
                                <Clock size={16} className="text-gray-400" />
                                Duration: <strong className="text-gray-900">{formatDuration(run.durationMs)}</strong>
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition shadow-sm">
                            <Bug size={18} className="text-blue-600" /> Create Jira Bug
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition shadow-sm">
                            <RefreshCw size={18} className="text-blue-600" /> Sync Results to Jira
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition shadow-sm">
                            <Download size={18} className="text-blue-600" /> Download Report
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="border border-gray-200 p-4 rounded-xl flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold mb-0.5">Total</p>
                            <h2 className="text-2xl font-extrabold text-gray-900">{run.totalTests || 0}</h2>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-xl flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold mb-0.5">Passed</p>
                            <h2 className="text-2xl font-extrabold text-gray-900">{run.passedCount || 0}</h2>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-xl flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                            <XCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold mb-0.5">Failed</p>
                            <h2 className="text-2xl font-extrabold text-gray-900">{run.failedCount || 0}</h2>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-xl flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Minus className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold mb-0.5">Skipped</p>
                            <h2 className="text-2xl font-extrabold text-gray-900">{Math.max(0, skippedCount)}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left pane: Test Cases List */}
                <div className="col-span-4 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[700px] shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="font-extrabold text-gray-900">Test Cases <span className="ml-2 bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm">{run.runItems?.length || 0}</span></h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {run.runItems?.map(item => {
                            const isPassed = item.status === 'PASSED';
                            const isSelected = selectedItem?.runItemId === item.runItemId;
                            
                            return (
                                <div 
                                    key={item.runItemId}
                                    onClick={() => setSelectedItem(item)}
                                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between border-l-4 ${
                                        isSelected ? (isPassed ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500')
                                        : (isPassed ? 'bg-white hover:bg-gray-50 border-emerald-500 shadow-sm' : 'bg-white hover:bg-gray-50 border-red-500 shadow-sm')
                                    }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        {isPassed ? <CheckCircle2 className="text-emerald-500 shrink-0" size={18} /> : <XCircle className="text-red-500 shrink-0" size={18} />}
                                        <div className="truncate flex items-center gap-2 flex-1">
                                            <p className="text-sm font-bold truncate text-gray-900">{item.testCase?.testCaseCode || 'UNKNOWN'}</p>
                                            <p className="text-sm text-gray-500 truncate">{item.testCase?.title || 'Untitled'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-2">
                                        <span className={`text-sm font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {isPassed ? 'Passed' : 'Failed'}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 w-16 text-right">
                                            {formatDuration(item.durationMs)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <button className="text-blue-700 font-bold text-sm hover:underline">View all test cases</button>
                    </div>
                </div>

                {/* Right pane: Details */}
                <div className="col-span-8 bg-white border border-gray-200 rounded-2xl h-[700px] overflow-y-auto p-8 shadow-sm">
                    {selectedItem ? (
                        <div>
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-extrabold text-gray-900">
                                        {selectedItem.testCase?.testCaseCode || 'UNKNOWN'} <span className="font-semibold text-gray-600 ml-2">{selectedItem.testCase?.title || ''}</span>
                                    </h2>
                                    {selectedItem.status === 'FAILED' ? (
                                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                                            <XCircle size={14} className="text-red-500"/> Failed
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                                            <CheckCircle2 size={14} className="text-emerald-500"/> Passed
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">
                                    Duration: <span className="text-gray-900 font-bold">{formatDuration(selectedItem.durationMs)}</span>
                                </span>
                            </div>

                            {(() => {
                                const failedStep = selectedItem.testResult?.stepResults?.find(
                                    (sr: any) => sr.status === 'FAILED'
                                );

                                const displayFailedStep = failedStep 
                                    ? `${failedStep.testStep?.stepOrder || ''}. ${failedStep.testStep?.actionDescription || ''}`
                                    : "N/A (Global compilation/syntax error or setup failure)";

                                const displayExpected = failedStep
                                    ? (failedStep.testStep?.expectedResult || "No expected result specified.")
                                    : "Playwright test script should execute successfully without environment/compilation errors.";

                                const displayActual = failedStep
                                    ? (failedStep.actualResult || "Step failed execution.")
                                    : "System encountered a global error (e.g. test is not defined, database lock, or setup issue).";

                                return (
                                    <div className="space-y-6">
                                        {selectedItem.status === 'FAILED' ? (
                                            <>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <AlertCircle size={16} className="text-red-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Failed Step</h3>
                                                        <p className="text-gray-700 font-semibold">{displayFailedStep}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Target size={16} className="text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Expected Result</h3>
                                                        <p className="text-gray-700">{displayExpected}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Square size={16} className="text-orange-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Actual Result</h3>
                                                        <p className="text-red-700 bg-red-50/50 p-3 rounded-lg border border-red-100/50 font-mono text-sm whitespace-pre-wrap">{displayActual}</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                                                <CheckCircle2 className="text-emerald-600" size={24} />
                                                <div>
                                                    <h3 className="text-sm font-bold text-emerald-950 mb-0.5">All Steps Passed</h3>
                                                    <p className="text-emerald-700 text-sm">This test case completed all automated steps successfully.</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* List all steps for context */}
                                        {selectedItem.testResult?.stepResults && selectedItem.testResult.stepResults.length > 0 && (
                                            <div className="mt-8 border-t border-gray-100 pt-6">
                                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Step Execution Details</h3>
                                                <div className="space-y-3">
                                                    {selectedItem.testResult.stepResults
                                                        .sort((a: any, b: any) => (a.testStep?.stepOrder || 0) - (b.testStep?.stepOrder || 0))
                                                        .map((sr: any, idx: number) => {
                                                            const isStepPassed = sr.status === 'PASSED';
                                                            const isStepFailed = sr.status === 'FAILED';
                                                            return (
                                                                <div key={sr.stepResultId || idx} className="flex items-center gap-3 text-sm">
                                                                    {isStepPassed ? (
                                                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                                                    ) : isStepFailed ? (
                                                                        <XCircle size={16} className="text-red-500 shrink-0" />
                                                                    ) : (
                                                                        <Minus size={16} className="text-gray-400 shrink-0" />
                                                                    )}
                                                                    <span className={isStepFailed ? "text-red-800 font-bold" : "text-gray-700"}>
                                                                        {sr.testStep?.stepOrder}. {sr.testStep?.actionDescription}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {selectedItem.testResult?.executionLog && (
                                <div className="flex items-start gap-4 mt-8">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-2">
                                        <Code size={16} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2">Error Log</h3>
                                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-5">
                                            <pre className="text-sm font-mono text-red-800 whitespace-pre-wrap overflow-x-auto">
                                                {selectedItem.testResult.executionLog}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedItem.screenshotUrl && (
                                <div className="flex items-start gap-4 mt-8">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <FileText size={16} className="text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2">Failure Screenshot</h3>
                                        <img src={selectedItem.screenshotUrl.startsWith('http') ? selectedItem.screenshotUrl : `/${selectedItem.screenshotUrl}`} alt="Error Screenshot" className="rounded-xl border border-gray-200 shadow-sm max-w-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-3">
                            <FileText size={64} className="opacity-20" />
                            <p className="font-medium text-lg text-gray-500">Select a test case to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}