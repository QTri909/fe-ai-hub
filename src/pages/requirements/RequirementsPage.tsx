import React, { useState } from 'react';
import { Search, Filter, Plus, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequirementsPage = () => {
  const navigate = useNavigate();
  const [selectedReq, setSelectedReq] = useState<any>(null);

  // Mock data for MVP
  const mockRequirements = [
    { id: '1', key: 'PROJ-1', title: 'Login with OAuth', type: 'Story', status: 'To Do', priority: 'High' },
    { id: '2', key: 'PROJ-2', title: 'Generate Test Cases', type: 'Story', status: 'In Progress', priority: 'Highest' },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Requirements</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          New Requirement
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search requirements..." 
              className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-950 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Main Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Table */}
          <div className={`flex-1 overflow-auto ${selectedReq ? 'border-r border-gray-800' : ''}`}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-950/50 sticky top-0">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-400">ID</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Priority</th>
                </tr>
              </thead>
              <tbody>
                {mockRequirements.map(req => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedReq(req)}
                    className={`border-t border-gray-800/50 cursor-pointer hover:bg-gray-800/50 transition-colors ${selectedReq?.id === req.id ? 'bg-gray-800/50' : ''}`}
                  >
                    <td className="p-4 text-gray-300">{req.key}</td>
                    <td className="p-4 text-gray-200 font-medium">{req.title}</td>
                    <td className="p-4 text-gray-400">{req.type}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{req.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details Drawer */}
          {selectedReq && (
            <div className="w-96 bg-gray-900 overflow-auto flex flex-col">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{selectedReq.key}</span>
                  <button onClick={() => setSelectedReq(null)} className="text-gray-500 hover:text-gray-300">×</button>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">{selectedReq.title}</h2>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">{selectedReq.type}</span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">{selectedReq.status}</span>
                </div>
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-gray-300 text-sm mb-6">As a user, I want to login with OAuth so that I can securely access the platform.</p>
                
                <h3 className="text-sm font-medium text-gray-400 mb-2">Acceptance Criteria</h3>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2 mb-8">
                  <li>User can click Login with Google</li>
                  <li>System redirects to Google Auth</li>
                  <li>User is authenticated and redirected to dashboard</li>
                </ul>

                <button 
                  onClick={() => navigate(`/requirements/${selectedReq.id}/generate`)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Wand2 size={18} />
                  Generate Test Cases (AI)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
