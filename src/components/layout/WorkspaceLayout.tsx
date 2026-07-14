import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './index';

export const WorkspaceLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* TopAppBar - Using Header fragment */}
      <Header />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>

      {/* Footer - Using Footer fragment */}
      <Footer />
    </div>
  );
};

export default WorkspaceLayout;