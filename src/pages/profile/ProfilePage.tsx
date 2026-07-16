import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth.store';
import { authApi, type UserProfile, type UpdateProfileRequest } from '@/features/auth/api/auth.api';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getProfile();
      setProfile(data);
      setEditFullName(data.fullName);
      setEditAvatarUrl(data.avatarUrl || '');
    } catch (err) {
      setError('Failed to load profile');
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload: UpdateProfileRequest = {};
      if (editFullName.trim()) payload.fullName = editFullName.trim();
      if (editAvatarUrl.trim()) payload.avatarUrl = editAvatarUrl.trim();

      const updated = await authApi.updateProfile(payload);
      setProfile(updated);
      setEditFullName(updated.fullName);
      setEditAvatarUrl(updated.avatarUrl || '');
      setEditing(false);
      setSuccess('Profile updated successfully!');

      // Sync the auth store user name as well
      if (user) {
        setUser({ ...user, fullName: updated.fullName, avatarUrl: updated.avatarUrl });
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditFullName(profile.fullName);
      setEditAvatarUrl(profile.avatarUrl || '');
    }
    setEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
      </div>
    );
  }

  const displayName = profile?.fullName || user?.fullName || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const initials = displayName[0] || displayEmail[0] || 'U';
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="bg-surface-container-lowest border-outline-variant/30 overflow-hidden rounded-xl border">
        {/* Profile Header */}
        <div className="from-primary/10 to-tertiary/10 bg-gradient-to-r p-8 text-center">
          <div className="border-surface mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4">
            {profile?.avatarUrl ? (
              <img
                className="h-full w-full object-cover"
                src={profile.avatarUrl}
                alt={displayName}
              />
            ) : (
              <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                <span className="text-primary text-3xl font-bold">{initials}</span>
              </div>
            )}
          </div>
          <h1 className="font-label-lg text-on-surface text-lg font-bold">{displayName}</h1>
          <p className="text-on-surface-variant mt-1 text-sm">{displayEmail}</p>
          {profile?.roles && profile.roles.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Profile Details / Edit Form */}
        <div className="p-6">
          {error && (
            <div className="bg-error-container/10 border-error/20 text-error mb-4 rounded-lg border p-3 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success-container/10 border-success/20 text-success mb-4 rounded-lg border p-3 text-xs">
              {success}
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-on-surface-variant mb-1 block text-[10px] font-medium tracking-wider uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="text-on-surface-variant mb-1 block text-[10px] font-medium tracking-wider uppercase">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-on-primary flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-outline-variant hover:bg-surface-container-high text-on-surface flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-surface-container-low rounded-lg p-4">
                    <p className="text-on-surface-variant text-[10px] font-medium tracking-wider uppercase">
                      Email
                    </p>
                    <p className="text-on-surface mt-1 text-sm">{displayEmail || '-'}</p>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4">
                    <p className="text-on-surface-variant text-[10px] font-medium tracking-wider uppercase">
                      Provider
                    </p>
                    <p className="text-on-surface mt-1 text-sm">{profile?.provider || '-'}</p>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4">
                    <p className="text-on-surface-variant text-[10px] font-medium tracking-wider uppercase">
                      Status
                    </p>
                    {profile?.status ? (
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          profile.status === 'ACTIVE'
                            ? 'bg-success-container/20 text-success'
                            : 'bg-error-container/10 text-error'
                        }`}
                      >
                        {profile.status}
                      </span>
                    ) : (
                      <p className="text-on-surface mt-1 text-sm">-</p>
                    )}
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4">
                    <p className="text-on-surface-variant text-[10px] font-medium tracking-wider uppercase">
                      Roles
                    </p>
                    <p className="text-on-surface mt-1 text-sm">
                      {profile?.roles?.length ? profile.roles.join(', ') : '-'}
                    </p>
                  </div>
                </div>

                {joinedDate && (
                  <div className="bg-surface-container-low rounded-lg p-4">
                    <p className="text-on-surface-variant text-[10px] font-medium tracking-wider uppercase">
                      Member Since
                    </p>
                    <p className="text-on-surface mt-1 text-sm">{joinedDate}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-primary text-on-primary flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:text-on-surface flex cursor-pointer items-center gap-2 text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
