import React from 'react';
import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth.store';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { ROUTES } from '@/core/constants';

export const ProjectLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const navItems = [
    { name: 'Dashboard', path: `/projects/${projectId}`, icon: 'dashboard', end: true },
    { name: 'Requirements', path: `/projects/${projectId}/requirements`, icon: 'list_alt' },
    { name: 'Test Cases', path: `/projects/${projectId}/test-cases`, icon: 'checklist' },
    { name: 'Test Suites', path: `/projects/${projectId}/test-suites`, icon: 'biotech' },
    { name: 'AI Agents', path: `/projects/${projectId}/test-runner`, icon: 'smart_toy' },
  ];

  // If no active workspace, redirect to workspace list
  React.useEffect(() => {
    if (!activeWorkspace) {
      navigate(ROUTES.WORKSPACE_LIST);
    }
  }, [activeWorkspace, navigate]);

  const handleLogout = () => {
    clearTokens();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex overflow-hidden bg-surface text-on-surface font-body-md h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col py-4 px-4 z-50">
        {/* Workspace Selector */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between p-2 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-all cursor-pointer group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzGLJ0OfLNEylOJDudA6QG8FOYfl1hPs6tzqbrtSSH9d6u60f9Tx8xHX1OVSyGt9EhkhUBNZ2fz5b_fqc6DWuYgDVdEFwcaHkbWA44uYMdBJ0qQITHrvaIpS0tNF1MY_WXXiQ6kg78yteMskw27gDfNkehmAjGDM4ArGfE-VHEPkxgHHB_UzZSHN-ESrdrykf1Hi7ZGh7PLLX9UowE37hEKrakN000PFjj-k86_yEj-k9f1LvMkSDUNTOJjnV2EFiCqNjJLnE7EQ"/>
              </div>
              <div className="overflow-hidden">
                <h2 className="font-headline-md text-sm font-bold text-primary truncate">{activeWorkspace?.name || 'Loading...'}</h2>
                <p className="font-label-md text-[10px] text-on-surface-variant/70 truncate">{activeWorkspace?.jiraUrl ? activeWorkspace.jiraUrl.replace(/^https?:\/\//, '') : 'No Jira URL'}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">unfold_more</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 border-b border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="font-label-md text-xs">Back to Projects</span>
          </button>
          {navItems.map((item) => {
            const isActive = item.end 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 transition-colors duration-200 ${
                  isActive 
                    ? 'text-primary font-bold border-r-2 border-primary bg-primary/5' 
                    : 'text-on-surface-variant font-medium hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                <span className="font-label-md text-xs">{item.name}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => {/* TODO: Settings */}}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 mt-auto"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="font-label-md text-xs">Settings</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-error font-medium hover:bg-error-container/10 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-label-md text-xs">Logout</span>
          </button>
        </nav>

        <div className="mt-4 pt-4 border-t border-outline-variant/20 px-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-tertiary/10 rounded">
              <span className="material-symbols-outlined text-tertiary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            </div>
            <span className="font-code text-[10px] text-on-surface-variant">v2.4.0-stable</span>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden bg-surface">
        {/* TopAppBar */}
        <header className="h-14 flex justify-between items-center px-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4 w-1/2">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50 text-on-surface" 
                placeholder="Search Jira issues or tests..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Jira Sync: Active</span>
            </div>
            <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
              <button className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">sync</span>
              </button>
              <button className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors relative cursor-pointer">
                <span className="material-symbols-outlined text-sm">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
              </button>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/20">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgH0krT49JvFm1jJv7Rv-y8OkmMWfFfmc4GW3NvCog8fqGNEvidCxP37BsKo99iR9nIV-JnYSLuJFtmIRwXCIr50I72yqtzkLXzjZouO7ABvE3rJZkJAmzOgUy43nYQHg-dQTLIelfprdmX5gkaVU6xtZfWz6MDbEC2oT7jgITum8ER4ujzMLPclTMSiXTfu_W613QAVd-HXijOARb5Fm-DtKoDdmU2h9cBwN616fkMFM6_0E28x1c3uDCb80M9rGR33sICehXPyA"/>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
