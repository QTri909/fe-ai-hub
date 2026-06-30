import { type RouteObject, Navigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { ProtectedRoute, GuestRoute, PublicRoute } from './guards';

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.HOME,
        lazy: async () => {
          const { LandingPage } = await import('@/pages/landing');
          return { Component: LandingPage };
        },
      },
      {
        path: ROUTES.OAUTH2_CALLBACK,
        lazy: async () => {
          const { GoogleCallbackPage } = await import('@/pages/auth');
          return { Component: GoogleCallbackPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/pages/404');
          return { Component: NotFoundPage };
        },
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        lazy: async () => {
          const { LoginPage } = await import('@/pages/login');
          return { Component: LoginPage };
        },
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        lazy: async () => {
          const { DashboardPage } = await import('@/pages/dashboard');
          return { Component: DashboardPage };
        },
      },
    ],
  },
];
export default routes;
