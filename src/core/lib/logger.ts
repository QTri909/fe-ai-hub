import { appConfig } from '@/core/config/app.config';

type LogFn = (message: string, ...args: unknown[]) => void;

interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
}

export const logger: Logger = {
  info: (message, ...args) => {
    if (appConfig.VITE_ENABLE_LOG) {
      console.log(`[INFO] [${new Date().toISOString()}]: ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (appConfig.VITE_ENABLE_LOG) {
      console.warn(`[WARN] [${new Date().toISOString()}]: ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    if (appConfig.VITE_ENABLE_LOG) {
      console.error(`[ERROR] [${new Date().toISOString()}]: ${message}`, ...args);
    }
  },
  debug: (message, ...args) => {
    if (appConfig.VITE_ENABLE_LOG && appConfig.DEV) {
      console.debug(`[DEBUG] [${new Date().toISOString()}]: ${message}`, ...args);
    }
  },
};
