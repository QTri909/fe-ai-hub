import { create } from 'zustand';
import type { SyncStatus } from '@/features/notification/api/notification.api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  workspaceId?: string;
  projectId?: string;
}

interface NotificationState {
  notifications: Notification[];
  syncStatus: SyncStatus;
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchSyncStatus: () => Promise<void>;
  triggerSync: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

// Mock data for development until backend API is available
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome to JAT',
    message: 'Your workspace is ready for automation testing.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  }
];

export const useNotificationStore = create<NotificationState>()(
  (set, get) => ({
    notifications: [],
    syncStatus: { status: 'idle' },
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
      try {
        // Use mock data for now - backend API not implemented
        set({ notifications: mockNotifications, unreadCount: mockNotifications.filter(n => !n.read).length });
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    },

    fetchSyncStatus: async () => {
      try {
        // Backend API not implemented yet, keep as idle
        // set({ syncStatus: await notificationApi.getSyncStatus() });
      } catch (error) {
        console.error('Failed to fetch sync status:', error);
      }
    },

    triggerSync: async () => {
      try {
        // Backend API not implemented yet
        // await notificationApi.triggerSync();
        // Temporarily simulate sync
        get().fetchSyncStatus();
      } catch (error) {
        console.error('Failed to trigger sync:', error);
      }
    },

    markAsRead: async (id: string) => {
      try {
        // Backend API not implemented yet
        // await notificationApi.markAsRead(id);
        const notifications = get().notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        const unreadCount = notifications.filter(n => !n.read).length;
        set({ notifications, unreadCount });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },

    markAllAsRead: async () => {
      try {
        // Backend API not implemented yet
        // await notificationApi.markAllAsRead();
        const notifications = get().notifications.map(n => ({ ...n, read: true }));
        set({ notifications, unreadCount: 0 });
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    },
  })
);