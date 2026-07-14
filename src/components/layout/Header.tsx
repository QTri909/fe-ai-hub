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
  
  const { notifications, syncStatus, unreadCount, triggerSync, markAsRead, markAllAsRead, fetchNotifications } = useNotificationStore();
  
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
    <header className={`h-14 flex justify-between items-center px-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 sticky top-0 z-40 shrink-0 ${className}`}>
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          {showSearchBox ? (
            <form onSubmit={handleSearch} className="w-full flex items-center">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50 text-on-surface" 
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
              className="w-full flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              <span>Search Jira issues or tests...</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Jira Sync Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full">
          {syncStatus.status === 'syncing' && (
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          )}
          {syncStatus.status === 'error' && (
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
          )}
          {syncStatus.status === 'idle' && (
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
          )}
          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">{getSyncStatusText()}</span>
        </div>
        
        {/* Sync Button */}
        <button 
          onClick={handleSync}
          disabled={syncStatus.status === 'syncing'}
          className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trigger manual sync"
        >
          <span className="material-symbols-outlined text-sm">sync</span>
          {syncStatus.status === 'syncing' && (
            <span className="absolute w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" style={{ top: '50%', left: '50%', marginTop: '-6px', marginLeft: '-6px' }}></span>
          )}
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-error rounded-full text-[8px] flex items-center justify-center text-on-error">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-8 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-outline-variant/30 flex justify-between items-center">
                <h3 className="font-label-md text-xs font-bold text-on-surface">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-primary text-[10px] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-xs">
                  No notifications
                </div>
              ) : (
                <div>
                  {notifications.slice(0, 10).map((notification: Notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-outline-variant/20 hover:bg-surface-container-low cursor-pointer transition-colors ${!notification.read ? 'bg-tertiary/5' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-tertiary mt-1 shrink-0"></span>
                        )}
                        <div className={!notification.read ? '' : 'ml-4'}>
                          <p className="font-label-md text-xs font-bold text-on-surface">{notification.title}</p>
                          <p className="text-[10px] text-on-surface-variant mt-1">{notification.message}</p>
                          <p className="text-[9px] text-on-surface-variant/50 mt-1">{formatTimeAgo(notification.createdAt)}</p>
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
            onClick={() => setShowProfile(!showProfile)}
            className="w-7 h-7 rounded-full overflow-hidden border border-primary/20 hover:border-primary transition-colors cursor-pointer"
          >
            {user?.avatarUrl ? (
              <img className="w-full h-full object-cover" src={user.avatarUrl} alt={user.fullName || user.email} />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">
                  {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            )}
          </button>
          
          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-10 w-64 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20">
                    {user?.avatarUrl ? (
                      <img className="w-full h-full object-cover" src={user.avatarUrl} alt={user.fullName || user.email} />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-xl">
                          {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-label-md text-xs font-bold text-on-surface">{user?.fullName || 'User'}</p>
                    <p className="text-[10px] text-on-surface-variant">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    // TODO: Navigate to profile page when available
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  View Profile
                </button>
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    // TODO: Navigate to settings page when available
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Account Settings
                </button>
              </div>
              
              <div className="border-t border-outline-variant/30 py-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-xs text-error hover:bg-error-container/10 transition-colors flex items-center gap-2 cursor-pointer"
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