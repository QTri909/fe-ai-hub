import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('JiraAutoTest'),
  VITE_API_URL: z.string().url().default('http://localhost:8080'),
  VITE_TIMEOUT: z.number().default(15000),
  VITE_ENABLE_LOG: z.boolean().default(true),
  MODE: z.string().default('development'),
  PROD: z.boolean().default(false),
  DEV: z.boolean().default(true),
});

const getEnv = () => {
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const rawTimeout = import.meta.env.VITE_TIMEOUT 
    ? parseInt(import.meta.env.VITE_TIMEOUT, 10) 
    : 15000;
  const rawEnableLog = import.meta.env.VITE_ENABLE_LOG !== undefined 
    ? String(import.meta.env.VITE_ENABLE_LOG) === 'true' 
    : true;

  const envData = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'JiraAutoTest',
    VITE_API_URL: rawApiUrl,
    VITE_TIMEOUT: rawTimeout,
    VITE_ENABLE_LOG: rawEnableLog,
    MODE: import.meta.env.MODE || 'development',
    PROD: import.meta.env.PROD || false,
    DEV: import.meta.env.DEV || true,
  };

  const parsed = envSchema.safeParse(envData);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables configuration');
  }

  return parsed.data;
};

export const appConfig = getEnv();
export type AppConfig = typeof appConfig;
