export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
  OAUTH2_CALLBACK: '/oauth2/callback',
  WORKSPACE: '/workspace',
  WORKSPACE_LIST: '/workspaces',
  PROJECTS: '/projects',
} as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
