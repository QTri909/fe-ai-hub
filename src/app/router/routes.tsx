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
            path: ROUTES.PROFILE,
            lazy: async () => {
              const { ProfilePage } = await import('@/pages/profile/ProfilePage');
              return { Component: ProfilePage };
            },
          },
          {
            path: ROUTES.PROJECTS,
            lazy: async () => {
              const { ProjectsPage } = await import('@/pages/projects');
              return { Component: ProjectsPage };
            },
          },
        ],
      },
      {
        path: '/projects/:projectId',
        lazy: async () => {
          const { ProjectLayout } = await import('@/components/layout/ProjectLayout');
          return { Component: ProjectLayout };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const { ProjectDashboardPage } =
                await import('@/pages/projects/ProjectDashboardPage');
              return { Component: ProjectDashboardPage };
            },
          },
          {
            path: 'requirements',
            lazy: async () => {
              const { RequirementsPage } = await import('@/pages/requirements/RequirementsPage');
              return { Component: RequirementsPage };
            },
          },
          {
            path: 'requirements/:id/generate',
            lazy: async () => {
              const { TestGenerationWizard } =
                await import('@/pages/test-gen/TestGenerationWizard');
              return { Component: TestGenerationWizard };
            },
          },
          {
            path: 'requirements/:id/test-cases',
            lazy: async () => {
              const { TestCaseRepository } = await import('@/pages/test-cases/TestCaseRepository');
              return { Component: TestCaseRepository };
            },
          },
          {
            path: 'test-cases',
            lazy: async () => {
              const { TestCaseRepository } = await import('@/pages/test-cases/TestCaseRepository');
              return { Component: TestCaseRepository };
            },
          },
          {
            path: 'test-suites',
            lazy: async () => {
              const { TestSuiteManagementPage } =
                await import('@/pages/test-suites/TestSuiteManagementPage');
              return { Component: TestSuiteManagementPage };
            },
          },
          {
            path: 'test-runner',
            lazy: async () => {
              const { TestRunnerPage } = await import('@/pages/execution/TestRunnerPage');
              return { Component: TestRunnerPage };
            },
          },
          {
            path: 'test-runs',
            lazy: async () => {
              const { TestRunsPage } = await import('@/pages/execution/TestRunsPage');
              return { Component: TestRunsPage };
            },
          },
          {
            path: 'test-runs/:runId',
            lazy: async () => {
              const { TestRunDetailsPage } = await import('@/pages/execution/TestRunDetailsPage');
              return { Component: TestRunDetailsPage };
            },
          },
        ],
      },
      {
        path: ROUTES.WORKSPACE_LIST,
        lazy: async () => {
          const { WorkspaceLayout } = await import('@/components/layout/WorkspaceLayout');
          return { Component: WorkspaceLayout };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const { WorkspaceListPage } = await import('@/pages/workspace-list');
              return { Component: WorkspaceListPage };
            },
          },
          {
            path: 'create',
            lazy: async () => {
              const { WorkspacePage } = await import('@/pages/workspace');
              return { Component: WorkspacePage };
            },
          },
        ],
      },
    ],
  },
];
export default routes;
