import { type RouteObject, Navigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { ProtectedRoute, GuestRoute, PublicRoute } from './guards';

export const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
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
