import React, { useState, useEffect } from 'react';
import { Play, Terminal, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const TestRunnerPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('Idle');

  const handleRun = () => {
    setIsRunning(true);
    setStatus('Preparing (Auto-Agent)');
    setLogs(['> Initializing execution engine...', '> Resolving dependencies...']);
    
    setTimeout(() => {
      setStatus('Running');
      setLogs(prev => [...prev, '> npx playwright test', 'Running 2 tests using 1 worker...']);
      
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count === 1) setLogs(prev => [...prev, '✓ TC-001 Successful login (3.2s)']);
        if (count === 2) {
          setLogs(prev => [...prev, '✗ TC-002 Login cancellation (5.1s)', 'Error: expect(page).toHaveURL("/login")']);
          clearInterval(interval);
          setIsRunning(false);
          setStatus('Failed');
        }
      }, 1500);
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Test Execution Runner</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`font-medium ${
              status === 'Idle' ? 'text-gray-500' :
              status === 'Running' || status.includes('Preparing') ? 'text-blue-400 animate-pulse' :
              status === 'Failed' ? 'text-red-400' : 'text-emerald-400'
            }`}>{status}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Base URL (e.g. https://staging.app.com)" 
            className="w-80 bg-gray-900 border border-gray-800 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
            defaultValue="http://localhost:5173"
          />
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'Running...' : 'Execute Test Suite'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Queue Status */}
        <div className="w-1/3 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-950/50">
            <h2 className="font-bold text-gray-200">Execution Queue</h2>
          </div>
          <div className="p-4 flex-1 overflow-auto space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-3">
                {status === 'Idle' || status.includes('Preparing') || status === 'Running' ? (
                   <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                   <CheckCircle2 size={18} className="text-emerald-500" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-200">TC-001</div>
                  <div className="text-xs text-gray-500">Successful login...</div>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Passed</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle size={18} className="text-red-500" />
                <div>
                  <div className="text-sm font-medium text-gray-200">TC-002</div>
                  <div className="text-xs text-gray-500">Login cancellation</div>
                </div>
              </div>
              <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded">Failed</span>
            </div>
            
            {status.includes('Preparing') && (
              <div className="flex items-center p-3 bg-blue-900/10 rounded-lg border border-blue-500/20 animate-pulse">
                <Loader2 size={18} className="text-blue-400 animate-spin mr-3" />
                <span className="text-sm text-blue-400">Auto-Agent is exploring UI...</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Terminal */}
        <div className="flex-1 bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden flex flex-col font-mono text-sm">
          <div className="p-3 border-b border-gray-800 bg-gray-900 flex items-center gap-2">
            <Terminal size={16} className="text-gray-500" />
            <span className="text-gray-400">Console Output</span>
          </div>
          <div className="p-4 flex-1 overflow-auto text-gray-300 space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={`${
                log.includes('✗') || log.includes('Error') ? 'text-red-400' : 
                log.includes('✓') ? 'text-emerald-400' : 
                log.startsWith('>') ? 'text-blue-400' : 'text-gray-300'
              }`}>
                {log}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-4 bg-gray-400 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
