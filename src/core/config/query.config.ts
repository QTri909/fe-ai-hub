import { type QueryClientConfig } from '@tanstack/react-query';
import { logger } from '@/core/lib';

export const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
};

export const handleQueryError = (error: unknown) => {
  logger.error('Global Query Error:', error);
};

export const handleMutationError = (error: unknown) => {
  logger.error('Global Mutation Error:', error);
};
