import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/core/store/auth.store';
import { useNotificationStore } from '@/core/store/notification.store';
import type { Notification } from '@/features/notification/api/notification.api';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearTokensAndUser = useAuthStore((state) => state.clearTokensAndUser);

  const {
    notifications,
    syncStatus,
    unreadCount,
    triggerSync,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    fetchNotifications();
  }, [user]);

  const fetchUser = async () => {
    try {
      const { authApi } = await import('@/features/auth/api/auth.api');
      const userData = await authApi.getMe();
      useAuthStore.getState().setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search for:', searchQuery);
      // TODO: Implement actual search functionality with backend API
    }
  };

  const handleSync = async () => {
    await triggerSync();
  };

  const handleLogout = () => {
    clearTokensAndUser();
    navigate(ROUTES.LOGIN);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getSyncStatusText = () => {
    if (syncStatus.status === 'syncing') return 'Syncing...';
    if (syncStatus.status === 'error') return 'Sync Error';
    if (syncStatus.lastSyncTime) return `Last sync: ${formatTimeAgo(syncStatus.lastSyncTime)}`;
    return 'Sync: Idle';
  };

  return (
    <header
      className={`bg-surface/70 border-outline-variant/30 sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-xl ${className}`}
    >
      <div className="flex w-1/2 items-center gap-4">
        <div className="relative w-full max-w-md">
          {showSearchBox ? (
            <form onSubmit={handleSearch} className="flex w-full items-center">
              <span className="material-symbols-outlined text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                search
              </span>
              <input
                className="bg-surface-container-lowest border-outline-variant/30 focus:ring-primary/20 focus:border-primary/50 placeholder:text-on-surface-variant/50 text-on-surface w-full rounded-lg border py-1.5 pr-3 pl-9 text-xs transition-all outline-none focus:ring-2"
                placeholder="Search Jira issues or tests..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchBox(false), 200)}
                autoFocus
              />
            </form>
          ) : (
            <button
              onClick={() => setShowSearchBox(true)}
              className="bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              <span>Search Jira issues or tests...</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Jira Sync Status */}
        <div className="bg-tertiary/10 border-tertiary/20 flex items-center gap-2 rounded-full border px-3 py-1">
          {syncStatus.status === 'syncing' && (
            <span className="bg-tertiary h-1.5 w-1.5 animate-pulse rounded-full"></span>
          )}
          {syncStatus.status === 'error' && (
            <span className="bg-error h-1.5 w-1.5 rounded-full"></span>
          )}
          {syncStatus.status === 'idle' && (
            <span className="bg-success h-1.5 w-1.5 rounded-full"></span>
          )}
          <span className="text-tertiary text-[10px] font-bold tracking-wider uppercase">
            {getSyncStatusText()}
          </span>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleSync}
          disabled={syncStatus.status === 'syncing'}
          className="hover:bg-surface-container-high/50 text-on-surface-variant cursor-pointer rounded-full p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title="Trigger manual sync"
        >
          <span className="material-symbols-outlined text-sm">sync</span>
          {syncStatus.status === 'syncing' && (
            <span
              className="border-primary absolute h-3 w-3 animate-spin rounded-full border border-t-transparent"
              style={{ top: '50%', left: '50%', marginTop: '-6px', marginLeft: '-6px' }}
            ></span>
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:bg-surface-container-high/50 text-on-surface-variant relative cursor-pointer rounded-full p-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">notifications</span>
            {unreadCount > 0 && (
              <span className="bg-error text-on-error absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full text-[8px]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="bg-surface-container-lowest border-outline-variant/30 absolute top-8 right-0 z-50 max-h-96 w-80 overflow-y-auto rounded-lg border shadow-lg">
              <div className="border-outline-variant/30 flex items-center justify-between border-b p-3">
                <h3 className="font-label-md text-on-surface text-xs font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-primary cursor-pointer text-[10px] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-on-surface-variant p-4 text-center text-xs">
                  No notifications
                </div>
              ) : (
                <div>
                  {notifications.slice(0, 10).map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`border-outline-variant/20 hover:bg-surface-container-low cursor-pointer border-b p-3 transition-colors ${!notification.read ? 'bg-tertiary/5' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <span className="bg-tertiary mt-1 h-2 w-2 shrink-0 rounded-full"></span>
                        )}
                        <div className={!notification.read ? '' : 'ml-4'}>
                          <p className="font-label-md text-on-surface text-xs font-bold">
                            {notification.title}
                          </p>
                          <p className="text-on-surface-variant mt-1 text-[10px]">
                            {notification.message}
                          </p>
                          <p className="text-on-surface-variant/50 mt-1 text-[9px]">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile / Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              navigate(ROUTES.PROFILE);
            }}
            className="border-primary/20 hover:border-primary h-7 w-7 cursor-pointer overflow-hidden rounded-full border transition-colors"
            title="View Profile"
          >
            {user?.avatarUrl ? (
              <img
                className="h-full w-full object-cover"
                src={user.avatarUrl}
                alt={user.fullName || user.email}
              />
            ) : (
              <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                <span className="text-primary text-xs font-bold">
                  {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="bg-surface-container-lowest border-outline-variant/30 absolute top-10 right-0 z-50 w-64 rounded-lg border shadow-lg">
              <div className="border-outline-variant/30 border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="border-primary/20 h-12 w-12 overflow-hidden rounded-full border">
                    {user?.avatarUrl ? (
                      <img
                        className="h-full w-full object-cover"
                        src={user.avatarUrl}
                        alt={user.fullName || user.email}
                      />
                    ) : (
                      <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                        <span className="text-primary text-xl font-bold">
                          {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface text-xs font-bold">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-on-surface-variant text-[10px]">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className="text-on-surface-variant hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    // TODO: Navigate to settings page when available
                  }}
                  className="text-on-surface-variant hover:bg-surface-container-low flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Account Settings
                </button>
              </div>

              <div className="border-outline-variant/30 border-t py-2">
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error-container/10 flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
