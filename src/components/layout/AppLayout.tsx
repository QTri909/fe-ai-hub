import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth.store';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { ROUTES } from '@/core/constants';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Header, Footer, MainWrapper } from './index';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
  { name: 'Projects', path: '/projects', icon: 'folder_copy' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

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
      <Sidebar navItems={navItems} onLogout={handleLogout} />

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