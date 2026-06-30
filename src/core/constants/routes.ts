export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
  OAUTH2_CALLBACK: '/oauth2/callback',
  WORKSPACE: '/workspace',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
