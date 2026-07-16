import type {
  Requirement,
  RequirementDetail,
  AcceptanceCriteria,
} from '@/features/requirements/types/requirements.types';

export const mockRequirements: Requirement[] = [
  {
    id: 'req-001',
    projectId: 'proj-001',
    requirementKey: 'ECP-101',
    title: 'User Registration with Email Verification',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Users should be able to register with their email address and receive a verification email before accessing the platform.',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'text', text: 'Email must be unique in the system' }],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'text',
                  text: 'Password must meet security requirements (min 8 chars, mixed case, numbers)',
                },
              ],
            },
            {
              type: 'listItem',
              content: [{ type: 'text', text: 'Verification link expires after 24 hours' }],
            },
          ],
        },
      ],
    }),
    type: 'Feature',
    status: 'DONE',
    priority: 'HIGH',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-02-10T08:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'req-002',
    projectId: 'proj-001',
    requirementKey: 'ECP-102',
    title: 'Product Search with Filters',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Implement a search feature that allows users to search products by name, category, price range, and ratings.',
            },
          ],
        },
      ],
    }),
    type: 'Feature',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-02-15T09:00:00Z',
    updatedAt: '2025-06-15T14:00:00Z',
  },
  {
    id: 'req-003',
    projectId: 'proj-001',
    requirementKey: 'ECP-103',
    title: 'Shopping Cart Persistence',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Cart items must persist across sessions for logged-in users and be synced across devices.',
            },
          ],
        },
      ],
    }),
    type: 'Story',
    status: 'TODO',
    priority: 'MEDIUM',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-06-10T09:00:00Z',
  },
  {
    id: 'req-004',
    projectId: 'proj-001',
    requirementKey: 'ECP-104',
    title: 'Payment Integration - Stripe',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Integrate Stripe payment gateway for processing payments. Support credit/debit cards and Stripe wallets.',
            },
          ],
        },
      ],
    }),
    type: 'Feature',
    status: 'IN_REVIEW',
    priority: 'CRITICAL',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-03-20T11:00:00Z',
    updatedAt: '2025-06-18T16:00:00Z',
  },
  {
    id: 'req-005',
    projectId: 'proj-001',
    requirementKey: 'ECP-105',
    title: 'Order Tracking System',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Users should be able to track their orders in real-time with status updates.',
            },
          ],
        },
      ],
    }),
    type: 'Story',
    status: 'TODO',
    priority: 'LOW',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-04-05T07:00:00Z',
    updatedAt: '2025-05-20T08:00:00Z',
  },
  {
    id: 'req-006',
    projectId: 'proj-002',
    requirementKey: 'PAY-101',
    title: 'Payment Gateway API Integration',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Integrate multiple payment gateway APIs with fallback mechanism.',
            },
          ],
        },
      ],
    }),
    type: 'Feature',
    status: 'DONE',
    priority: 'CRITICAL',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-06-10T15:00:00Z',
  },
  {
    id: 'req-007',
    projectId: 'proj-002',
    requirementKey: 'PAY-102',
    title: 'Transaction History Export',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Allow merchants to export transaction history in CSV and PDF formats.',
            },
          ],
        },
      ],
    }),
    type: 'Story',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-04-10T10:00:00Z',
    updatedAt: '2025-06-12T11:00:00Z',
  },
  {
    id: 'req-008',
    projectId: 'proj-003',
    requirementKey: 'ADM-101',
    title: 'User Management Dashboard',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Admin dashboard for managing users: create, edit, disable accounts, and assign roles.',
            },
          ],
        },
      ],
    }),
    type: 'Feature',
    status: 'DONE',
    priority: 'HIGH',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-05-30T12:00:00Z',
  },
  {
    id: 'req-009',
    projectId: 'proj-003',
    requirementKey: 'ADM-102',
    title: 'Audit Log System',
    description: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Implement audit logging for all admin actions with search and filter capabilities.',
            },
          ],
        },
      ],
    }),
    type: 'Story',
    status: 'TODO',
    priority: 'MEDIUM',
    reporterId: 'user-001',
    assigneeId: 'user-001',
    createdAt: '2025-04-15T08:00:00Z',
    updatedAt: '2025-05-25T09:00:00Z',
  },
];

export const mockAcceptanceCriteria: Record<string, AcceptanceCriteria[]> = {
  'req-001': [
    {
      acId: 1,
      requirementId: 'req-001',
      content: 'Email field validates proper email format',
      orderIndex: 1,
    },
    {
      acId: 2,
      requirementId: 'req-001',
      content: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
      orderIndex: 2,
    },
    {
      acId: 3,
      requirementId: 'req-001',
      content: 'Verification email is sent within 30 seconds of registration',
      orderIndex: 3,
    },
    {
      acId: 4,
      requirementId: 'req-001',
      content: 'Verification link expires after 24 hours and shows appropriate error',
      orderIndex: 4,
    },
    {
      acId: 5,
      requirementId: 'req-001',
      content: 'Duplicate email registration shows proper error message',
      orderIndex: 5,
    },
  ],
  'req-002': [
    {
      acId: 6,
      requirementId: 'req-002',
      content: 'Search results are displayed within 2 seconds',
      orderIndex: 1,
    },
    {
      acId: 7,
      requirementId: 'req-002',
      content: 'Filters can be combined (category + price range + rating)',
      orderIndex: 2,
    },
    {
      acId: 8,
      requirementId: 'req-002',
      content: 'Empty search results show friendly message',
      orderIndex: 3,
    },
  ],
  'req-003': [
    {
      acId: 9,
      requirementId: 'req-003',
      content: 'Cart persists after logout and login',
      orderIndex: 1,
    },
    {
      acId: 10,
      requirementId: 'req-003',
      content: 'Cart syncs across browser tabs in real-time',
      orderIndex: 2,
    },
    {
      acId: 11,
      requirementId: 'req-003',
      content: 'Cart items are preserved for at least 30 days',
      orderIndex: 3,
    },
  ],
  'req-004': [
    {
      acId: 12,
      requirementId: 'req-004',
      content: 'Payment is processed successfully with valid card details',
      orderIndex: 1,
    },
    {
      acId: 13,
      requirementId: 'req-004',
      content: 'Invalid card shows appropriate error message',
      orderIndex: 2,
    },
    {
      acId: 14,
      requirementId: 'req-004',
      content: 'Payment confirmation is shown within 5 seconds',
      orderIndex: 3,
    },
  ],
  'req-005': [
    {
      acId: 15,
      requirementId: 'req-005',
      content: 'Order status updates in real-time without page refresh',
      orderIndex: 1,
    },
    {
      acId: 16,
      requirementId: 'req-005',
      content: 'Tracking page shows estimated delivery date',
      orderIndex: 2,
    },
  ],
  'req-006': [
    {
      acId: 17,
      requirementId: 'req-006',
      content: 'Primary gateway failure automatically falls back to secondary',
      orderIndex: 1,
    },
    {
      acId: 18,
      requirementId: 'req-006',
      content: 'All transactions are logged with gateway used',
      orderIndex: 2,
    },
  ],
  'req-007': [
    {
      acId: 19,
      requirementId: 'req-007',
      content: 'CSV export includes all required columns',
      orderIndex: 1,
    },
    {
      acId: 20,
      requirementId: 'req-007',
      content: 'PDF export is properly formatted and paginated',
      orderIndex: 2,
    },
  ],
  'req-008': [
    {
      acId: 21,
      requirementId: 'req-008',
      content: 'Admin can search users by name, email, or role',
      orderIndex: 1,
    },
    { acId: 22, requirementId: 'req-008', content: 'Disabled users cannot log in', orderIndex: 2 },
  ],
  'req-009': [
    {
      acId: 23,
      requirementId: 'req-009',
      content: 'All CRUD operations on users are logged',
      orderIndex: 1,
    },
    {
      acId: 24,
      requirementId: 'req-009',
      content: 'Logs are immutable and timestamped',
      orderIndex: 2,
    },
  ],
};

export function getMockRequirementDetail(id: string): RequirementDetail | undefined {
  const req = mockRequirements.find((r) => r.id === id);
  if (!req) return undefined;

  return {
    requirementId: req.id,
    requirementKey: req.requirementKey,
    title: req.title,
    description: req.description,
    status: req.status || 'TODO',
    priority: req.priority || 'MEDIUM',
    projectId: req.projectId,
    createdAt: req.createdAt || new Date().toISOString(),
    updatedAt: req.updatedAt || new Date().toISOString(),
    acceptanceCriteria: mockAcceptanceCriteria[id] || [],
    totalTestCases: Math.floor(Math.random() * 10) + 1,
    generatedTestCases: Math.floor(Math.random() * 5) + 1,
  };
}
