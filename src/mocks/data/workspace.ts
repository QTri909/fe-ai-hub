import type { Workspace } from '@/features/workspace/types/workspace.types';

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-001',
    name: 'My Workspace',
    description: 'Main workspace for Jira integration and automation testing',
    ownerId: 'user-001',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-06-20T10:30:00Z',
    jiraUrl: 'https://demo.atlassian.net',
  },
  {
    id: 'ws-002',
    name: 'Mobile App Team',
    description: 'Mobile application development and testing',
    ownerId: 'user-001',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-06-18T14:00:00Z',
    jiraUrl: 'https://mobile-team.atlassian.net',
  },
  {
    id: 'ws-003',
    name: 'QA Sandbox',
    description: 'Test environment for QA experiments',
    ownerId: 'user-001',
    createdAt: '2025-04-10T07:00:00Z',
    updatedAt: '2025-06-15T11:45:00Z',
    jiraUrl: 'https://qa-sandbox.atlassian.net',
  },
];
