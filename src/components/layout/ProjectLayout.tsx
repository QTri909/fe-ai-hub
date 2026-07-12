import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth.store';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { ROUTES } from '@/core/constants';
import { Sidebar, Header, Footer, MainWrapper, type NavItem } from './index';

export const ProjectLayout = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const navItems: NavItem[] = [
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
      {/* SideNavBar - Using Sidebar fragment */}
      <Sidebar 
        navItems={navItems} 
        onLogout={handleLogout} 
        backTo="Back to Projects"
        onBack={() => navigate(ROUTES.PROJECTS)}
      />

      {/* Main Wrapper - Using MainWrapper fragment */}
      <MainWrapper>
        {/* TopAppBar - Using Header fragment */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-surface">
          <Outlet />
        </main>

        {/* Footer - Using Footer fragment */}
        <Footer />
      </MainWrapper>
    </div>
  );
};