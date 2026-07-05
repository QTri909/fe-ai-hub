export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
  OAUTH2_CALLBACK: '/oauth2/callback',
  WORKSPACE: '/workspace',
  WORKSPACE_LIST: '/workspaces',
  REQUIREMENTS: '/requirements',
  PROJECTS: '/projects',
  TEST_CASES: '/test-cases',
  TEST_RUNNER: '/test-runner',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
