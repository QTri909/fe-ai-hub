import React, { useEffect, useState } from 'react';
import { 
  X, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, 
  Image as ImageIcon, AlertTriangle, Database, Code, ScrollText, Copy,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { historyApi } from '../api/history.api';
import type { TestCaseRunHistoryResponse, TestCaseRun } from '../types/history.types';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface TestCaseHistoryModalProps {
  testCaseId: number;
  testCaseCode: string;
  testCaseTitle: string;
  onClose: () => void;
}

export const TestCaseHistoryModal: React.FC<TestCaseHistoryModalProps> = ({
  testCaseId,
  testCaseCode,
  testCaseTitle,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<TestCaseRunHistoryResponse | null>(null);
  const [selectedRunItemId, setSelectedRunItemId] = useState<number | null>(null);
  
  // State for collapsible Technical Details
  const [isTechOpen, setIsTechOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'data' | 'script' | 'log'>('data');
  
  // State for image zoom lightbox
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await historyApi.getTestCaseRunHistory(testCaseId);
        setHistoryData(data);
        if (data?.runHistory && data.runHistory.length > 0) {
          setSelectedRunItemId(data.runHistory[0].runItemId);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [testCaseId]);

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'FAILED':
        return <XCircle size={16} className="text-rose-400" />;
      default:
        return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'FAILED':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'SKIPPED':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const parseStepsSnapshot = (snapshotStr?: string) => {
    if (!snapshotStr) return [];
    try {
      return JSON.parse(snapshotStr);
    } catch {
      return [];
    }
  };

  const getExpectedResultForStep = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('navigate') || d.includes('goto')) return 'URL is loaded and landing page is fully rendered';
    if (d.includes('username') || d.includes('password') || d.includes('fill') || d.includes('enter') || d.includes('type')) {
      return 'Target input field is correctly populated with the specified test data';
    }
    if (d.includes('click') || d.includes('submit') || d.includes('press')) {
      return 'Interaction completes successfully, page updates or redirects';
    }
    if (d.includes('verify') || d.includes('expect') || d.includes('assert') || d.includes('check')) {
      return 'Target state, element visibility, or URL matches expectation';
    }
    return 'Step executes cleanly without any errors or time-outs';
  };

  const getNormalizedSteps = (run: TestCaseRun): Array<{
    stepNumber: number;
    description: string;
    expectedResult: string;
    actualResult: string;
    status: string;
    screenshotUrl?: string;
  }> => {
    // 1. Try parsing from run.testStepsSnapshot (richest source, set by execution engine)
    if (run.testStepsSnapshot) {
      try {
        const parsed = JSON.parse(run.testStepsSnapshot);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: any, idx: number) => ({
            stepNumber: s.stepNumber || (idx + 1),
            description: s.description || s.actionDescription || "",
            expectedResult: s.expectedResult || getExpectedResultForStep(s.description || s.actionDescription || ""),
            actualResult: s.actualResult || "Executed successfully",
            status: s.status || "PASSED",
            screenshotUrl: s.screenshotUrl || undefined,
          }));
        }
      } catch (e) {
        console.error("Failed to parse testStepsSnapshot", e);
      }
    }

    // 2. Fallback to run.result?.stepResults (TestStepResult entities from DB)
    if (run.result?.stepResults && run.result.stepResults.length > 0) {
      return run.result.stepResults.map((sr, idx) => ({
        stepNumber: idx + 1,
        description: sr.stepDescription || "",
        expectedResult: getExpectedResultForStep(sr.stepDescription || ""),
        actualResult: sr.actualResult || "Executed successfully",
        status: sr.status || "PASSED",
        screenshotUrl: sr.screenshotUrl || undefined,
      }));
    }

    // 3. Last resort: parse [STEP] markers from executionLog (mirrors backend fallback)
    if (run.result?.executionLog) {
      const stepsFromLog: Array<{
        stepNumber: number; description: string; expectedResult: string;
        actualResult: string; status: string; screenshotUrl?: string;
      }> = [];
      let order = 1;
      for (const line of run.result.executionLog.split("\n")) {
        if (line.includes("[STEP]")) {
          const desc = line.substring(line.indexOf("[STEP]") + 6).trim();
          stepsFromLog.push({
            stepNumber: order++,
            description: desc,
            expectedResult: getExpectedResultForStep(desc),
            actualResult: "Executed successfully",
            status: "PASSED",
          });
        }
      }
      if (stepsFromLog.length > 0) {
        // Mark last step as FAILED when the overall run failed
        if (run.result.status?.toUpperCase() === "FAILED") {
          const last = stepsFromLog[stepsFromLog.length - 1];
          last.status = "FAILED";
          last.actualResult = run.result.actualResult || "Execution halted due to errors";
          if (run.finalScreenshotUrl) last.screenshotUrl = run.finalScreenshotUrl;
        }
        return stepsFromLog;
      }
    }

    return [];
  };


  const parseTestDataSnapshot = (snapshotStr?: string) => {
    if (!snapshotStr) return null;
    try {
      const parsed = JSON.parse(snapshotStr);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch {
      // return as text if not json
    }
    return snapshotStr;
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    const d = new Date(isoString);
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    if (ms == null) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const activeRun = historyData?.runHistory?.find(r => r.runItemId === selectedRunItemId) || historyData?.runHistory?.[0];

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative flex flex-col w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ImageIcon size={20} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Test Automation Run History</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px]">
                  {testCaseCode}
                </span>
                <span className="font-medium text-slate-350">{testCaseTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="text-sm text-slate-400">Loading history records...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          ) : !historyData || historyData.runHistory?.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm italic">
              No execution history found for this test case.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Runs Switcher (Horizontal scroll bar) */}
              <div className="flex gap-2 pb-4 border-b border-slate-800 overflow-x-auto">
                {historyData.runHistory.map((run, idx) => {
                  const isSelected = run.runItemId === selectedRunItemId;
                  const runNum = historyData.runHistory.length - idx;
                  return (
                    <button
                      key={run.runItemId}
                      onClick={() => setSelectedRunItemId(run.runItemId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <span className="font-mono">#{runNum}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${run.itemStatus === 'PASSED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="uppercase text-[9px] tracking-wider font-bold">{run.itemStatus}</span>
                    </button>
                  );
                })}
              </div>

              {activeRun && (
                <div className="space-y-6">
                  {/* 1. HEADER (Định danh Test Case) */}
                  <div className="flex items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Test Case Identifier
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2 flex-wrap">
                        <span className="text-indigo-300 font-mono select-all bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 text-sm">
                          {historyData.testCaseCode}
                        </span>
                        <span>{historyData.title}</span>
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`px-4 py-1.5 rounded-lg text-sm font-extrabold border uppercase tracking-wider shadow-lg ${
                        activeRun.itemStatus === 'PASSED' 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/5' 
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-rose-500/5'
                      }`}>
                        {activeRun.itemStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={10} /> {formatDateTime(activeRun.executionTime)}
                      </span>
                    </div>
                  </div>

                  {/* 2. TEST CASE CONTEXT (Thông tin gốc) */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                      📋 Test Case Static Context
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Preconditions & Test Data */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Precondition & Test Data
                          </span>
                          {(() => {
                            const data = parseTestDataSnapshot(activeRun.testDataSnapshot);
                            if (!data) return <p className="text-slate-500 italic">No precondition or test data specified.</p>;
                            if (typeof data === 'object') {
                              return (
                                <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 font-mono text-[11px] divide-y divide-slate-850/60 max-h-[160px] overflow-y-auto">
                                  {Object.entries(data).map(([key, val]: [string, any]) => (
                                    <div key={key} className="py-1.5 first:pt-0 last:pb-0 flex justify-between gap-4">
                                      <span className="text-indigo-400 font-semibold">{key}</span>
                                      <span className="text-slate-300 break-all text-right">{String(val)}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            return (
                              <p className="bg-slate-950 border border-slate-850 rounded-lg p-3 text-slate-350 leading-relaxed font-mono whitespace-pre-wrap">
                                {String(data)}
                              </p>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Overall Expected Result */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Overall Expected Result
                        </span>
                        <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 min-h-[100px]">
                          <p className="text-slate-300 leading-relaxed font-medium">
                            {historyData.expectedResult || "No overall expected result specified."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. EXECUTION OUTCOME (Kết quả thực tế) */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                      ⚡ Execution Outcome
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs items-start">
                      {/* Actual Result Column */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Overall Actual Result
                          </span>
                          <div className={`p-4 rounded-lg border text-sm font-semibold ${
                            activeRun.itemStatus === 'PASSED'
                              ? 'bg-emerald-950/10 border-emerald-900/20 text-emerald-400'
                              : 'bg-rose-955/10 border-rose-900/20 text-rose-450'
                          }`}>
                            {activeRun.result?.actualResult || 
                              (activeRun.itemStatus === 'PASSED' ? "Completed as expected." : "Execution halted due to errors.")}
                          </div>
                        </div>
                        {activeRun.durationMs && (
                          <div className="flex gap-4 text-xs text-slate-400 font-medium">
                            <span>Duration: <strong className="text-slate-200 font-mono">{formatDuration(activeRun.durationMs)}</strong></span>
                            <span>Environment: <strong className="text-slate-200">{activeRun.environment || "Default"}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Evidence Screenshot Column */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Evidence Screenshot
                        </span>
                        {activeRun.finalScreenshotUrl ? (
                          <div
                            onClick={() => setZoomImage(activeRun.finalScreenshotUrl!)}
                            className="relative group rounded-lg border border-slate-800 overflow-hidden cursor-zoom-in w-full h-24 shadow-md bg-slate-950 flex items-center justify-center"
                          >
                            <img
                              src={activeRun.finalScreenshotUrl}
                              alt="Evidence Screenshot"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] text-white bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800 font-semibold">
                                Zoom Screenshot
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-slate-800 border-dashed rounded-lg h-24 flex items-center justify-center text-slate-500 italic">
                            No screenshot captured
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. DETAILED STEPS (BẢNG CHI TIẾT CÁC BƯỚC) */}
                  {(() => {
                    const normalizedSteps = getNormalizedSteps(activeRun);
                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                          📝 Detailed Execution Steps
                        </h4>
                        {normalizedSteps.length > 0 ? (
                          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40 text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-900/60 border-b border-slate-800">
                                  <th className="p-3 text-slate-400 font-bold w-12 text-center">Step</th>
                                  <th className="p-3 text-slate-400 font-bold w-1/3">Action / Detail</th>
                                  <th className="p-3 text-slate-400 font-bold w-1/4">Expected Result</th>
                                  <th className="p-3 text-slate-400 font-bold w-1/4">Actual Result</th>
                                  <th className="p-3 text-slate-400 font-bold w-20 text-center">Status</th>
                                  <th className="p-3 text-slate-400 font-bold w-20 text-center">Evidence</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850">
                                {normalizedSteps.map((step, sIdx) => {
                                  const stepErr = step.status === 'FAILED';
                                  const stepSkip = step.status === 'SKIPPED';
                                  return (
                                    <tr
                                      key={sIdx}
                                      className={`hover:bg-slate-900/30 transition-colors ${
                                        stepErr ? 'bg-rose-500/5' : ''
                                      } ${stepSkip ? 'opacity-50' : ''}`}
                                    >
                                      <td className="p-3 text-center text-slate-500 font-mono font-medium border-r border-slate-850">
                                        {step.stepNumber}
                                      </td>
                                      <td className="p-3 text-slate-200 font-medium font-mono text-[11px] leading-relaxed">
                                        {step.description}
                                      </td>
                                      <td className="p-3 text-slate-400 leading-relaxed">
                                        {step.expectedResult}
                                      </td>
                                      <td className="p-3">
                                        <span className={`leading-relaxed ${stepErr ? 'text-rose-400 font-medium' : 'text-slate-500'}`}>
                                          {step.actualResult}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center border-l border-slate-850">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider inline-block ${getStatusColor(step.status)}`}>
                                          {step.status}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center border-l border-slate-850">
                                        {step.screenshotUrl ? (
                                          <button
                                            onClick={() => setZoomImage(step.screenshotUrl!)}
                                            className="flex items-center justify-center p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded text-rose-450 hover:text-rose-350 cursor-pointer mx-auto transition-colors"
                                            title="View Screenshot"
                                          >
                                            <ImageIcon size={14} />
                                          </button>
                                        ) : (
                                          <span className="text-slate-650">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-550 italic p-4 text-center border border-slate-800 rounded-lg">
                            No execution steps recorded.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 5. COLLAPSIBLE TECHNICAL DETAILS (TEST DATA, SCRIPT, LOGS) */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setIsTechOpen(!isTechOpen)}
                      className="w-full flex items-center justify-between p-4 font-bold text-xs text-slate-450 uppercase tracking-widest hover:bg-slate-850 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Code size={14} className="text-indigo-400" /> Technical Details (Test Data, Script, Logs)
                      </span>
                      {isTechOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <AnimatePresence>
                      {isTechOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-800 p-5 bg-slate-950/40 space-y-4"
                        >
                          {/* Tabs Selector */}
                          <div className="flex gap-2 border-b border-slate-850 pb-3">
                            <button
                              onClick={() => setActiveTab('data')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                                activeTab === 'data'
                                  ? 'bg-slate-800 text-white border border-slate-700'
                                  : 'text-slate-450 hover:text-slate-200'
                              }`}
                            >
                              <Database size={12} /> Test Data
                            </button>
                            <button
                              onClick={() => setActiveTab('script')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                                activeTab === 'script'
                                  ? 'bg-slate-800 text-white border border-slate-700'
                                  : 'text-slate-450 hover:text-slate-200'
                              }`}
                            >
                              <Code size={12} /> Test Script
                            </button>
                            <button
                              onClick={() => setActiveTab('log')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                                activeTab === 'log'
                                  ? 'bg-slate-800 text-white border border-slate-700'
                                  : 'text-slate-450 hover:text-slate-200'
                              }`}
                            >
                              <ScrollText size={12} /> Execution Log
                            </button>
                          </div>

                          {/* Tab Contents */}
                          <div className="text-xs">
                            {activeTab === 'data' && (
                              <div>
                                {activeRun.testDataSnapshot ? (
                                  <pre className="bg-black/40 p-3 rounded-lg text-[11px] text-indigo-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-850 leading-relaxed">
                                    {JSON.stringify(parseTestDataSnapshot(activeRun.testDataSnapshot), null, 2)}
                                  </pre>
                                ) : (
                                  <div className="text-xs text-slate-500 italic">No test data snapshot recorded.</div>
                                )}
                              </div>
                            )}

                            {activeTab === 'script' && (
                              <div className="space-y-2">
                                {activeRun.testScriptSnapshot ? (
                                  <>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(activeRun.testScriptSnapshot || '');
                                        }}
                                        className="text-[10px] text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                                      >
                                        <Copy size={10} /> Copy Test Script
                                      </button>
                                    </div>
                                    <pre className="bg-black/40 p-3 rounded-lg text-[11px] text-emerald-400 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-850 leading-relaxed">
                                      {activeRun.testScriptSnapshot}
                                    </pre>
                                  </>
                                ) : (
                                  <div className="text-xs text-slate-500 italic">No script snapshot recorded.</div>
                                )}
                              </div>
                            )}

                            {activeTab === 'log' && (
                              <div>
                                {activeRun.result?.executionLog ? (
                                  <pre className="bg-black/40 p-3 rounded-lg text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-850 leading-relaxed">
                                    {activeRun.result.executionLog}
                                  </pre>
                                ) : (
                                  <div className="text-xs text-slate-500 italic">No execution logs found.</div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox / Zoom Modal Portal */}
      <AnimatePresence>
        {zoomImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
            onClick={() => setZoomImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-lg overflow-hidden border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={zoomImage} alt="Zoom Evidence" className="w-full h-auto max-h-[85vh] object-contain" />
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition cursor-pointer border border-slate-800"
              >
                <X size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(content, document.body);
};
