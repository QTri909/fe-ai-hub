import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/core/store/auth.store';
import { workspaceApi } from '@/features/workspace/api/workspace.api';
import type { Workspace } from '@/features/workspace/types/workspace.types';
import { useWorkspaceStore } from '@/core/store/workspace.store';

export const WorkspaceListPage = () => {
  const navigate = useNavigate();
  const clearTokensAndUser = useAuthStore((state) => state.clearTokensAndUser);
  const setUser = useAuthStore((state) => state.setUser);
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const setActiveWorkspace = useWorkspaceStore(state => state.setActiveWorkspace);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const user = await authApi.getMe();
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        clearTokensAndUser();
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };
    fetchUser();
  }, [clearTokensAndUser, navigate, setUser]);

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

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-['Inter'] text-[32px] font-semibold leading-10 text-on-surface">Your Workspaces</h1>
          <Link 
            to={`${ROUTES.WORKSPACE_LIST}/create`} 
            className="flex items-center gap-1 bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-lg text-[12px] font-medium uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New
          </Link>
        </div>
        <p className="text-[14px] text-on-surface-variant">Select a workspace to enter the automation dashboard.</p>
      </div>

      {/* Dashboard Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">hub</span>
          </div>
          <div>
            <div className="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Active Instances</div>
            <div className="text-on-surface text-[20px] font-medium">{workspaces.length} Sites</div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
          </div>
          <div>
            <div className="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">System Health</div>
            <div className="text-on-surface text-[20px] font-medium">N/A</div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">query_stats</span>
          </div>
          <div>
            <div className="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Weekly Deployments</div>
            <div className="text-on-surface text-[20px] font-medium">0</div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-error">emergency</span>
          </div>
          <div>
            <div className="text-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Open Incidents</div>
            <div className="text-on-surface text-[20px] font-medium">0</div>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="col-span-full text-center py-12 text-on-surface-variant">
            No workspaces found. Create one to get started.
          </div>
        ) : (
          workspaces.map((ws, index) => {
            const colorClasses = [
              { bg: 'bg-primary/10 text-primary shadow-md shadow-primary/20', icon: 'forest' },
              { bg: 'bg-tertiary-container/10 text-tertiary-container shadow-md shadow-tertiary-container/20', icon: 'shopping_cart' },
              { bg: 'bg-secondary/10 text-secondary shadow-md shadow-secondary/20 border border-secondary/20', icon: 'payments' },
            ];
            const style = colorClasses[index % colorClasses.length];

            return (
              <Link 
                key={ws.id}
                to={ROUTES.DASHBOARD}
                onClick={() => setActiveWorkspace(ws)}
                className="bg-surface-container-low rounded-xl p-6 group hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden block"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-1 bg-success/10 px-2 py-[2px] rounded-full border border-success/30">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    <span className="text-success text-[12px] font-medium">Connected</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${style.bg}`}>
                    <span className="material-symbols-outlined text-[32px]">{style.icon}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-on-surface text-[24px] font-semibold leading-8 mb-1">{ws.name}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      <span className="font-mono text-[13px]">{ws.jiraUrl ? ws.jiraUrl.replace(/^https?:\/\//, '') : `${ws.name.toLowerCase().replace(/\s+/g, '-')}.atlassian.net`}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
                    <div className="flex -space-x-2">
                      {/* No members data yet */}
                    </div>
                    <span className="text-primary font-bold text-[12px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Enter Dashboard
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}

        {/* Create New Card */}
        <Link to={`${ROUTES.WORKSPACE_LIST}/create`} className="border-2 border-dashed border-outline-variant bg-transparent rounded-xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-solid hover:border-primary hover:bg-surface-bright transition-all duration-300 cursor-pointer min-h-[280px]">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[40px] text-primary">add</span>
          </div>
          <div className="text-center">
            <span className="block text-on-surface text-[24px] font-semibold leading-8">Connect New Jira Site</span>
            <span className="block text-on-surface-variant text-[14px] mt-1">Add an Enterprise workspace to your hub</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WorkspaceListPage;