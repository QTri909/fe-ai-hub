import { httpClient } from '@/infrastructure/http/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  workspaceId?: string;
  projectId?: string;
}

export interface SyncStatus {
  status: 'syncing' | 'idle' | 'error';
  lastSyncTime?: string;
  message?: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await httpClient.get<Notification[]>('/core-managerment-service/api/v1/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await httpClient.patch(`/core-managerment-service/api/v1/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await httpClient.patch('/core-managerment-service/api/v1/notifications/read-all');
  },

  getSyncStatus: async (): Promise<SyncStatus> => {
    const response = await httpClient.get<SyncStatus>('/integration-service/api/v1/jira/status');
    return response.data;
  },

  triggerSync: async (): Promise<void> => {
    await httpClient.post('/integration-service/api/v1/jira/sync');
  },
};