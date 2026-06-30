export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
