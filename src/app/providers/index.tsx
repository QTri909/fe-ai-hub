import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/core/components';

export { ThemeProvider } from './ThemeProvider';
export { QueryProvider } from './QueryProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};
export default AppProviders;
