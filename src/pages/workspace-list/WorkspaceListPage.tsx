import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/core/store/auth.store';
import { workspaceApi } from '@/features/workspace/api/workspace.api';
import type { Workspace } from '@/features/workspace/types/workspace.types';
import { useWorkspaceStore } from '@/core/store/workspace.store';

export const WorkspaceListPage = () => {
  const navigate = useNavigate();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setActiveWorkspace = useWorkspaceStore(state => state.setActiveWorkspace);
  
  // Auth state
  const [userEmail, setUserEmail] = useState<string>('Loading...');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const user = await authApi.getMe();
        setUserEmail(user.email);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUserEmail('Guest');
        // Force logout if we can't fetch the user profile (token expired or invalid)
        clearTokens();
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };
    fetchUser();
  }, [clearTokens, navigate]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await workspaceApi.getWorkspaces();
        setWorkspaces(data.content || []);
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleLogout = () => {
    clearTokens();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen grid-bg relative">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full bg-[#171f33]/70 backdrop-blur-xl border-b border-[#494454]/50 z-50 shadow-sm">
        <nav className="flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto h-16">
          <div className="flex items-center gap-8">
            <span className="font-['Inter'] text-2xl font-bold text-[#d0bcff] tracking-tight">Workspace Hub</span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-[#d0bcff] font-bold border-b-2 border-[#d0bcff] pb-1 text-sm transition-colors duration-200">Documentation</a>
              <a href="#" className="text-[#cbc3d7] font-medium text-sm hover:text-[#d0bcff] transition-colors duration-200">System Status</a>
              <a href="#" className="text-[#cbc3d7] font-medium text-sm hover:text-[#d0bcff] transition-colors duration-200">Security</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#cbc3d7] hover:text-[#d0bcff] transition-all p-2 rounded-full active:scale-95">notifications</button>
            <button className="material-symbols-outlined text-[#cbc3d7] hover:text-[#d0bcff] transition-all p-2 rounded-full active:scale-95">settings</button>
            <div className="h-8 w-[1px] bg-[#494454]/30 mx-2"></div>
            
            {/* User Dropdown */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-[#d0bcff] overflow-hidden ring-2 ring-[#d0bcff]/10 group-hover:ring-[#d0bcff]/30 transition-all flex items-center justify-center bg-[#31394d]">
                  <span className="font-bold text-xs text-[#d0bcff]">ME</span>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#131b2e] border border-[#494454]/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                <div className="px-4 py-3 border-b border-[#494454]/30 bg-[#171f33]/50">
                  <div className="text-[13px] text-[#dae2fd] font-medium truncate">
                    {userEmail}
                  </div>
                </div>
                <div 
                  className="px-4 py-3 text-[13px] font-medium text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign out
                </div>
              </div>
            </div>

          </div>
        </nav>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 pt-[120px] pb-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-['Inter'] text-[32px] font-semibold leading-10 text-[#dae2fd]">Your Workspaces</h1>
            <Link 
              to={ROUTES.WORKSPACE} 
              className="flex items-center gap-1 bg-[#d0bcff] text-[#3c0091] px-4 py-2 rounded-lg text-[12px] font-medium uppercase tracking-widest hover:shadow-lg hover:shadow-[#d0bcff]/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create New
            </Link>
          </div>
          <p className="text-[14px] text-[#cbc3d7]">Select a workspace to enter the automation dashboard.</p>
        </div>

        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#131b2e] border border-[#494454]/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#d0bcff]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#d0bcff]">hub</span>
            </div>
            <div>
              <div className="text-[#cbc3d7] text-[12px] font-medium uppercase tracking-wider">Active Instances</div>
              <div className="text-[#dae2fd] text-[20px] font-medium">{workspaces.length} Sites</div>
            </div>
          </div>
          <div className="bg-[#131b2e] border border-[#494454]/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#4edea3]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4edea3]">check_circle</span>
            </div>
            <div>
              <div className="text-[#cbc3d7] text-[12px] font-medium uppercase tracking-wider">System Health</div>
              <div className="text-[#dae2fd] text-[20px] font-medium">N/A</div>
            </div>
          </div>
          <div className="bg-[#131b2e] border border-[#494454]/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#adc6ff]">query_stats</span>
            </div>
            <div>
              <div className="text-[#cbc3d7] text-[12px] font-medium uppercase tracking-wider">Weekly Deployments</div>
              <div className="text-[#dae2fd] text-[20px] font-medium">0</div>
            </div>
          </div>
          <div className="bg-[#131b2e] border border-[#494454]/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#ffb4ab]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ffb4ab]">emergency</span>
            </div>
            <div>
              <div className="text-[#cbc3d7] text-[12px] font-medium uppercase tracking-wider">Open Incidents</div>
              <div className="text-[#dae2fd] text-[20px] font-medium">0</div>
            </div>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#d0bcff] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#cbc3d7]">
              No workspaces found. Create one to get started.
            </div>
          ) : (
            workspaces.map((ws, index) => {
              // Phân bổ màu sắc ngẫu nhiên cho đẹp giống design mẫu
              const colorClasses = [
                { bg: 'bg-[#d0bcff]/10 text-[#d0bcff] shadow-[#d0bcff]/20', icon: 'forest' },
                { bg: 'bg-[#0566d9] text-[#e6ecff] shadow-[#adc6ff]/20', icon: 'shopping_cart' },
                { bg: 'bg-[#2d3449] text-[#d0bcff] shadow-black/20 border border-[#d0bcff]/20', icon: 'payments' },
              ];
              const style = colorClasses[index % colorClasses.length];

              return (
                <Link 
                  key={ws.id}
                  to={ROUTES.DASHBOARD}
                  onClick={() => setActiveWorkspace(ws)}
                  className="bg-[#131b2e] border border-[#494454]/30 rounded-xl p-6 group hover:border-[#d0bcff] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden block"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-1 bg-[#4edea3]/10 px-2 py-[2px] rounded-full border border-[#4edea3]/30">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                      <span className="text-[#4edea3] text-[12px] font-medium">Connected</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${style.bg}`}>
                      <span className="material-symbols-outlined text-[32px]">{style.icon}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-[#dae2fd] text-[24px] font-semibold leading-8 mb-1">{ws.name}</h3>
                      <div className="flex items-center gap-2 text-[#cbc3d7]">
                        <span className="material-symbols-outlined text-[16px]">link</span>
                        <span className="font-['JetBrains_Mono'] text-[13px]">{ws.jiraUrl ? ws.jiraUrl.replace(/^https?:\/\//, '') : `${ws.name.toLowerCase().replace(/\s+/g, '-')}.atlassian.net`}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-[#494454]/20 pt-4">
                      <div className="flex -space-x-2">
                        {/* No members data yet */}
                      </div>
                      <button className="text-[#d0bcff] font-bold text-[12px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        Enter Dashboard
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })
          )}

          {/* Create New Card */}
          <Link to={ROUTES.WORKSPACE} className="border-2 border-dashed border-[#494454] bg-transparent rounded-xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-solid hover:border-[#d0bcff] hover:bg-[#222a3d] transition-all duration-300 cursor-pointer min-h-[280px]">
            <div className="w-16 h-16 rounded-full bg-[#d0bcff]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[40px] text-[#d0bcff]">add</span>
            </div>
            <div className="text-center">
              <span className="block text-[#dae2fd] text-[24px] font-semibold leading-8">Connect New Jira Site</span>
              <span className="block text-[#cbc3d7] text-[14px] mt-1">Add an Enterprise workspace to your hub</span>
            </div>
          </Link>
        </div>

        {/* System Message / Logs */}
        <div className="mt-12 bg-[#060e20] border border-[#494454]/10 rounded-xl overflow-hidden shadow-inner">
          <div className="bg-[#171f33] px-4 py-2 border-b border-[#494454]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#cbc3d7] text-[16px]">terminal</span>
              <span className="font-['JetBrains_Mono'] text-[12px] font-medium text-[#cbc3d7] uppercase tracking-widest">Global Event Stream</span>
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab]/40"></span>
              <span className="w-2 h-2 rounded-full bg-[#adc6ff]/40"></span>
              <span className="w-2 h-2 rounded-full bg-[#4edea3]/40"></span>
            </div>
          </div>
          <div className="p-4 font-['JetBrains_Mono'] text-[13px] text-[#cbc3d7]/80 space-y-1">
            <div className="animate-pulse">[<span className="text-[#d0bcff]">{new Date().toLocaleTimeString('en-GB')}</span>] <span className="text-[#cbc3d7]">LISTENING:</span> Waiting for telemetry packets... <span className="bg-[#cbc3d7]/20 px-1 rounded">_</span></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspaceListPage;
