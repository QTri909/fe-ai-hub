import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders, AppRouter } from '@/app';
import './index.css';

async function bootstrap() {
  // Start MSW to intercept all API calls with mock data
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    });

    // Auto-seed auth store so user is logged in immediately
    const { useAuthStore } = await import('@/core/store/auth.store');
    useAuthStore.getState().setAccessToken('mock-access-token-12345');
    useAuthStore.getState().setUser({
      id: 'user-001',
      email: 'demo@jat-platform.com',
      fullName: 'Demo User',
    });

    // Auto-seed active workspace so pages that depend on it work
    const { mockWorkspaces } = await import('@/mocks/data/workspace');
    const { useWorkspaceStore } = await import('@/core/store/workspace.store');
    if (mockWorkspaces.length > 0) {
      useWorkspaceStore.getState().setActiveWorkspace(mockWorkspaces[0]);
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>
  );
}

bootstrap();
