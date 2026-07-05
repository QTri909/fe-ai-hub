import React, { useState } from 'react';
import { Wand2, Save, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestGenerationWizard = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<any[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Mock API call
    setTimeout(() => {
      setGeneratedCases([
        {
          id: 1,
          scenario: 'Successful login with valid Google account',
          given: 'the user is on the login page',
          when: 'the user clicks "Login with Google" and completes auth',
          then: 'the user should be redirected to the dashboard'
        },
        {
          id: 2,
          scenario: 'Login cancellation',
          given: 'the user is on the Google auth page',
          when: 'the user cancels the authentication process',
          then: 'the user should be returned to the login page with an error message'
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Context Area */}
      <div className="w-1/3 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-1">AI Test Generation</h2>
          <p className="text-sm text-gray-400">Configure AI settings to generate test cases.</p>
        </div>
        <div className="p-6 flex-1 overflow-auto space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Requirement Context</h3>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-sm text-gray-300">
              <strong className="block text-white mb-1">PROJ-1: Login with OAuth</strong>
              <p className="mb-2">As a user, I want to login with OAuth so that I can securely access the platform.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Framework</label>
              <select className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
                <option>Playwright</option>
                <option>Selenium</option>
                <option>Cypress</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
              <select className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500">
                <option>JavaScript</option>
                <option>Python</option>
                <option>TypeScript</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* AI Output Area */}
      <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
          <h2 className="text-lg font-bold text-white">Generated Test Cases (Gherkin)</h2>
          {generatedCases.length > 0 && (
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Save size={16} />
              Save & Approve All
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto p-6">
          {isGenerating ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                  <div className="h-5 bg-gray-800 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : generatedCases.length > 0 ? (
            <div className="space-y-4">
              {generatedCases.map(tc => (
                <div key={tc.id} className="bg-gray-950 border border-gray-800 rounded-lg p-6 relative group">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-white"><Play size={16} /></button>
                  </div>
                  <h3 className="text-indigo-400 font-bold mb-4 font-mono text-sm">Scenario: {tc.scenario}</h3>
                  <div className="font-mono text-sm text-gray-300 space-y-1">
                    <p><span className="text-blue-400 font-semibold">Given</span> {tc.given}</p>
                    <p><span className="text-emerald-400 font-semibold">When</span> {tc.when}</p>
                    <p><span className="text-purple-400 font-semibold">Then</span> {tc.then}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Wand2 size={48} className="mb-4 opacity-20" />
              <p>Click "Generate Now" to let AI create test cases</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
