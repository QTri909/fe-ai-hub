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
        path: '',
        lazy: async () => {
          const { AppLayout } = await import('@/components/layout/AppLayout');
          return { Component: AppLayout };
        },
        children: [
          {
            path: ROUTES.DASHBOARD,
            lazy: async () => {
              const { DashboardPage } = await import('@/pages/dashboard');
              return { Component: DashboardPage };
            },
          },
          {
            path: ROUTES.PROJECTS,
            lazy: async () => {
              const { ProjectsPage } = await import('@/pages/projects');
              return { Component: ProjectsPage };
            },
          },
          {
            path: ROUTES.REQUIREMENTS,
            lazy: async () => {
              const { RequirementsPage } = await import('@/pages/requirements/RequirementsPage');
              return { Component: RequirementsPage };
            },
          },
          {
            path: ROUTES.REQUIREMENTS + '/:id/generate',
            lazy: async () => {
              const { TestGenerationWizard } = await import('@/pages/test-gen/TestGenerationWizard');
              return { Component: TestGenerationWizard };
            },
          },
          {
            path: ROUTES.TEST_CASES,
            lazy: async () => {
              const { TestCaseRepository } = await import('@/pages/test-cases/TestCaseRepository');
              return { Component: TestCaseRepository };
            },
          },
          {
            path: ROUTES.TEST_RUNNER,
            lazy: async () => {
              const { TestRunnerPage } = await import('@/pages/execution/TestRunnerPage');
              return { Component: TestRunnerPage };
            },
          },
        ]
      },
      {
        path: ROUTES.WORKSPACE,
        lazy: async () => {
          const { WorkspacePage } = await import('@/pages/workspace');
          return { Component: WorkspacePage };
        },
      },
      {
        path: ROUTES.WORKSPACE_LIST,
        lazy: async () => {
          const { WorkspaceListPage } = await import('@/pages/workspace-list');
          return { Component: WorkspaceListPage };
        },
      },
    ],
  },
];
export default routes;
