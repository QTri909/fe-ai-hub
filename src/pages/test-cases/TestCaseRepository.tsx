import React, { useState } from 'react';
import { Search, Filter, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestCaseRepository = () => {
  const navigate = useNavigate();
  const [selectedTc, setSelectedTc] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'data' | 'script'>('steps');

  // Mock data
  const mockTestCases = [
    { id: 'TC-001', title: 'Successful login with valid Google account', status: 'APPROVED', priority: 'High', reqId: 'PROJ-1' },
    { id: 'TC-002', title: 'Login cancellation', status: 'DRAFT', priority: 'Medium', reqId: 'PROJ-1' },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Test Case Repository</h1>
        <button 
          onClick={() => navigate('/test-runner')}
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
        </div>

        {/* Master-Detail Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Master List */}
          <div className={`flex-1 overflow-auto ${selectedTc ? 'border-r border-gray-800' : ''}`}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-950/50 sticky top-0">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-700 bg-gray-900" /></th>
                  <th className="p-4 text-sm font-medium text-gray-400">Code</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Req</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTestCases.map(tc => (
                  <tr 
                    key={tc.id} 
                    onClick={() => setSelectedTc(tc)}
                    className={`border-t border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedTc?.id === tc.id ? 'bg-gray-800/50' : ''}`}
                  >
                    <td className="p-4"><input type="checkbox" className="rounded border-gray-700 bg-gray-900" onClick={e => e.stopPropagation()}/></td>
                    <td className="p-4 text-gray-300 font-mono text-sm">{tc.id}</td>
                    <td className="p-4 text-gray-200 font-medium">{tc.title}</td>
                    <td className="p-4 text-gray-500 text-sm">{tc.reqId}</td>
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
                  <span className="text-indigo-400 font-mono text-sm">{selectedTc.id}</span>
                  <button onClick={() => setSelectedTc(null)} className="text-gray-500 hover:text-gray-300">×</button>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">{selectedTc.title}</h2>
                
                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-800">
                  {['steps', 'data', 'script'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                        activeTab === tab 
                          ? 'border-indigo-500 text-indigo-400' 
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Test {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 flex-1 overflow-auto">
                {activeTab === 'steps' && (
                  <div className="font-mono text-sm text-gray-300 space-y-3 bg-gray-950 p-4 rounded-lg border border-gray-800">
                    <p><span className="text-blue-400 font-semibold mr-2">Given</span>the user is on the login page</p>
                    <p><span className="text-emerald-400 font-semibold mr-2">When</span>the user clicks "Login with Google" and completes auth</p>
                    <p><span className="text-purple-400 font-semibold mr-2">Then</span>the user should be redirected to the dashboard</p>
                  </div>
                )}
                {activeTab === 'data' && (
                  <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                    <pre className="text-sm text-emerald-400 font-mono">
{`{
  "users": [
    {
      "email": "test@example.com",
      "role": "admin"
    }
  ]
}`}
                    </pre>
                  </div>
                )}
                {activeTab === 'script' && (
                  <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 h-full">
                    <pre className="text-sm text-gray-300 font-mono">
{`import { test, expect } from '@playwright/test';

test('Successful login with valid Google account', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Login with Google');
  // Complete auth
  await expect(page).toHaveURL('/dashboard');
});`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
