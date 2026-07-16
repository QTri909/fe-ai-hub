import { http, HttpResponse, delay } from 'msw';
import { mockUser, mockProfile, mockAccessToken } from './data/auth';
import { mockWorkspaces } from './data/workspace';
import { mockProjects } from './data/project';
import {
  mockRequirements,
  mockAcceptanceCriteria,
  getMockRequirementDetail,
} from './data/requirement';
import { mockGenerationHistories, mockTestRuns, mockRecentActivities } from './data/history';
import type { RequirementPage } from '@/features/requirements/types/requirements.types';
import type { Project } from '@/features/project/types/project.types';

const baseUrl = (path: string) => `${path}`;

export const handlers = [
  // ─── AUTH ───────────────────────────────────────────────
  http.post(baseUrl('/auth-service/api/v1/auth/login'), async () => {
    await delay(300);
    return HttpResponse.json({ accessToken: mockAccessToken });
  }),

  http.post(baseUrl('/auth-service/api/v1/auth/register'), async () => {
    await delay(300);
    return HttpResponse.json({ accessToken: mockAccessToken });
  }),

  http.post(baseUrl('/auth-service/api/v1/auth/refresh'), async () => {
    await delay(100);
    return HttpResponse.json({ accessToken: mockAccessToken });
  }),

  http.get(baseUrl('/auth-service/api/v1/auth/me'), async () => {
    await delay(100);
    return HttpResponse.json(mockUser);
  }),

  http.get(baseUrl('/auth-service/api/v1/users/me'), async () => {
    await delay(100);
    return HttpResponse.json(mockProfile);
  }),

  http.put(baseUrl('/auth-service/api/v1/users/me'), async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    if (body.fullName !== undefined && body.fullName !== null && body.fullName.trim() !== '') {
      mockProfile.fullName = body.fullName;
    }
    if (body.avatarUrl !== undefined && body.avatarUrl !== null && body.avatarUrl.trim() !== '') {
      mockProfile.avatarUrl = body.avatarUrl;
    }
    return HttpResponse.json({ ...mockProfile });
  }),

  // ─── WORKSPACES ─────────────────────────────────────────
  http.get(baseUrl('/core-managerment-service/api/v1/workspaces'), async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const total = mockWorkspaces.length;
    return HttpResponse.json({
      content: mockWorkspaces.slice(page * size, (page + 1) * size),
      totalElements: total,
      totalPages: Math.ceil(total / size),
      size,
      number: page,
    });
  }),

  http.get(baseUrl('/core-managerment-service/api/v1/workspaces/:id'), async ({ params }) => {
    await delay(100);
    const ws = mockWorkspaces.find((w) => w.id === params.id);
    if (!ws) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(ws);
  }),

  http.post(baseUrl('/core-managerment-service/api/v1/workspaces'), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as any;
    const newWs = {
      id: `ws-${Date.now()}`,
      name: body.name,
      description: body.description,
      ownerId: body.ownerId || 'user-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jiraUrl: body.jiraUrl,
    };
    return HttpResponse.json(newWs, { status: 201 });
  }),

  // ─── PROJECTS ───────────────────────────────────────────
  http.get(
    baseUrl('/core-managerment-service/api/v1/projects/by-workspace/:workspaceId'),
    async ({ params, request }) => {
      await delay(200);
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '20');
      const filtered = mockProjects.filter((p) => p.workspaceId === params.workspaceId);
      const total = filtered.length;
      return HttpResponse.json({
        content: filtered.slice(page * size, (page + 1) * size),
        totalElements: total,
        totalPages: Math.ceil(total / size),
        pageable: { pageNumber: page, pageSize: size },
      });
    }
  ),

  http.get(baseUrl('/core-managerment-service/api/v1/projects/:id'), async ({ params }) => {
    await delay(100);
    const proj = mockProjects.find((p) => p.id === params.id);
    if (!proj) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(proj);
  }),

  http.post(
    baseUrl('/core-managerment-service/api/v1/workspaces/:workspaceId/projects/sync'),
    async ({ params }) => {
      await delay(500);
      const ws = params.workspaceId;
      return HttpResponse.json(mockProjects.filter((p) => p.workspaceId === ws));
    }
  ),

  http.post(
    baseUrl(
      '/core-managerment-service/api/v1/workspaces/:workspaceId/projects/:projectKey/requirements/sync'
    ),
    async () => {
      await delay(800);
      return HttpResponse.json(mockRequirements);
    }
  ),

  // ─── REQUIREMENTS ───────────────────────────────────────
  http.get(baseUrl('/core-managerment-service/api/v1/requirements'), async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const total = mockRequirements.length;
    const content = mockRequirements.slice(page * size, (page + 1) * size);
    return HttpResponse.json<RequirementPage>({
      content,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      pageable: { pageNumber: page, pageSize: size },
      page,
      size,
      first: page === 0,
      last: (page + 1) * size >= total,
    });
  }),

  http.get(
    baseUrl('/core-managerment-service/api/v1/requirements/by-project/:projectId'),
    async ({ params, request }) => {
      await delay(200);
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '10');
      const filtered = mockRequirements.filter((r) => r.projectId === params.projectId);
      const total = filtered.length;
      const content = filtered.slice(page * size, (page + 1) * size);
      return HttpResponse.json<RequirementPage>({
        content,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        pageable: { pageNumber: page, pageSize: size },
        page,
        size,
        first: page === 0,
        last: (page + 1) * size >= total,
      });
    }
  ),

  http.get(baseUrl('/core-managerment-service/api/v1/requirements/:id'), async ({ params }) => {
    await delay(100);
    const req = mockRequirements.find((r) => r.id === params.id);
    if (!req) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(req);
  }),

  http.get(
    baseUrl('/core-managerment-service/api/v1/requirements/:id/detail'),
    async ({ params }) => {
      await delay(200);
      const detail = getMockRequirementDetail(params.id as string);
      if (!detail) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(detail);
    }
  ),

  http.post(
    baseUrl('/core-managerment-service/api/v1/requirements/:id/generate-test-cases'),
    async () => {
      await delay(2000); // Simulate AI generation delay
      return HttpResponse.json({
        testCases: [
          {
            testCaseId: 1,
            testCaseCode: 'TC-001',
            scenario: 'Verify user registration with valid email',
            title: 'Successful Registration',
            precondition: 'User is on registration page',
            steps: [
              {
                action: 'Enter valid email',
                actionDescription: 'Input valid email address',
                expectedResult: 'Email field accepts input',
              },
              {
                action: 'Enter valid password',
                actionDescription: 'Input password meeting requirements',
                expectedResult: 'Password field accepts input',
              },
              {
                action: 'Click Register',
                actionDescription: 'Submit registration form',
                expectedResult: 'Success message displayed, verification email sent',
              },
            ],
          },
          {
            testCaseId: 2,
            testCaseCode: 'TC-002',
            scenario: 'Verify duplicate email registration shows error',
            title: 'Duplicate Email Registration',
            precondition: 'User is on registration page, email already exists',
            steps: [
              {
                action: 'Enter existing email',
                actionDescription: 'Input email that already exists in system',
                expectedResult: 'Email field accepts input',
              },
              {
                action: 'Enter valid password',
                actionDescription: 'Input password meeting requirements',
                expectedResult: 'Password field accepts input',
              },
              {
                action: 'Click Register',
                actionDescription: 'Submit registration form',
                expectedResult: 'Error message "Email already in use" is displayed',
              },
            ],
          },
        ],
      });
    }
  ),

  http.get(
    baseUrl('/core-managerment-service/api/v1/acceptance-criterias/by-requirement/:requirementId'),
    async ({ params }) => {
      await delay(100);
      const criteria = mockAcceptanceCriteria[params.requirementId as string] || [];
      return HttpResponse.json(criteria);
    }
  ),

  // ─── NOTIFICATIONS ──────────────────────────────────────
  http.get(baseUrl('/core-managerment-service/api/v1/notifications'), async () => {
    await delay(200);
    return HttpResponse.json([
      {
        id: '1',
        title: 'Welcome to JAT',
        message: 'Your workspace is ready for automation testing.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        title: 'Sync Completed',
        message: 'Requirements synced successfully for E-Commerce Platform.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 60000).toISOString(),
      },
    ]);
  }),

  http.patch(baseUrl('/core-managerment-service/api/v1/notifications/:id/read'), async () => {
    await delay(100);
    return HttpResponse.json({ success: true });
  }),

  http.patch(baseUrl('/core-managerment-service/api/v1/notifications/read-all'), async () => {
    await delay(100);
    return HttpResponse.json({ success: true });
  }),

  http.get(baseUrl('/integration-service/api/v1/jira/status'), async () => {
    await delay(100);
    return HttpResponse.json({
      status: 'idle',
      lastSyncTime: new Date(Date.now() - 120000).toISOString(),
      message: 'All systems operational',
    });
  }),

  http.post(baseUrl('/integration-service/api/v1/jira/sync'), async () => {
    await delay(300);
    return HttpResponse.json({ status: 'syncing', message: 'Sync initiated' });
  }),

  // ─── HISTORY ──────────────────────────────────────────────

  /** GET /api/v1/history/requirements/{requirementId}/generations */
  http.get(
    baseUrl('/core-managerment-service/api/v1/history/requirements/:requirementId/generations'),
    async ({ params }) => {
      await delay(200);
      const history = mockGenerationHistories[params.requirementId as string];
      if (!history) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(history);
    }
  ),

  /** GET /api/v1/history/projects/{projectId}/executions */
  http.get(
    baseUrl('/core-managerment-service/api/v1/history/projects/:projectId/executions'),
    async ({ params }) => {
      await delay(200);
      const runs = mockTestRuns.filter((r) => r.projectId === params.projectId);
      return HttpResponse.json(runs);
    }
  ),

  /** GET /api/v1/history/projects/{projectId}/recent-activity?limit=10 */
  http.get(
    baseUrl('/core-managerment-service/api/v1/history/projects/:projectId/recent-activity'),
    async ({ params, request }) => {
      await delay(200);
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const activities = mockRecentActivities.filter((a) => a.projectId === params.projectId);
      return HttpResponse.json(activities.slice(0, limit));
    }
  ),
];
