import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit3, Trash2, Shield, Globe, User, Check, X, AlertCircle } from 'lucide-react';
import { environmentsApi, type ProjectEnvironment } from '@/features/project/api/environments.api';

export const EnvironmentsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [environments, setEnvironments] = useState<ProjectEnvironment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEnvId, setEditingEnvId] = useState<number | null>(null);
  const [envName, setEnvName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const fetchEnvironments = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await environmentsApi.getEnvironmentsByProject(projectId);
      setEnvironments(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch environments. Please make sure the service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, [projectId]);

  const handleOpenCreate = () => {
    setEditingEnvId(null);
    setEnvName('STAGING');
    setBaseUrl('');
    setAuthUsername('');
    setAuthPassword('');
    setIsDefault(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (env: ProjectEnvironment) => {
    setEditingEnvId(env.envId || null);
    setEnvName(env.envName || 'STAGING');
    setBaseUrl(env.baseUrl || '');
    setAuthUsername(env.authUsername || '');
    setAuthPassword(env.authPassword || '');
    setIsDefault(!!env.isDefault);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingEnvId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    if (!baseUrl.trim()) {
      alert('Base URL is required.');
      return;
    }

    const payload: ProjectEnvironment = {
      projectId,
      envName: envName.trim() || 'STAGING',
      baseUrl: baseUrl.trim(),
      authUsername: authUsername.trim() || undefined,
      authPassword: authPassword.trim() || undefined,
      isDefault
    };

    try {
      if (editingEnvId !== null) {
        await environmentsApi.updateEnvironment(editingEnvId, payload);
      } else {
        await environmentsApi.createEnvironment(payload);
      }
      setIsFormOpen(false);
      fetchEnvironments();
    } catch (err: any) {
      console.error(err);
      alert('Error saving environment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (envId?: number) => {
    if (!envId) return;
    if (!window.confirm('Are you sure you want to delete this environment?')) return;
    try {
      await environmentsApi.deleteEnvironment(envId);
      fetchEnvironments();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete environment.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-indigo-400" />
            Project Environments
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage target URLs and credentials for your environments.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition cursor-pointer"
          >
            <Plus size={16} />
            Add Environment
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} autoComplete="off" className="mb-8 p-6 rounded-xl border border-gray-800 bg-gray-900 space-y-4 max-w-2xl">
          {/* Dummy hidden inputs to prevent browser password manager autofill */}
          <input type="text" style={{ display: 'none' }} tabIndex={-1} readOnly />
          <input type="password" style={{ display: 'none' }} tabIndex={-1} readOnly />

          <h3 className="text-lg font-bold text-white mb-2">
            {editingEnvId !== null ? 'Edit Environment' : 'Create Environment'}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              Base URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="env_base_url_no_autofill"
              autoComplete="off"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-250 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                <User size={12} /> Auth Username (Optional)
              </label>
              <input
                type="text"
                name="env_auth_username_no_autofill"
                autoComplete="off"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-250 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                <Shield size={12} /> Auth Password (Optional)
              </label>
              <input
                type="password"
                name="env_auth_password_no_autofill"
                autoComplete="new-password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-250 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefaultCheckbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-gray-700 bg-gray-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="isDefaultCheckbox" className="text-sm text-gray-300 cursor-pointer">
              Set as Default Environment
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              Save Environment
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500 p-8">Loading environments...</div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-850 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Base URL</th>
                <th className="py-3 px-4">Credentials</th>
                <th className="py-3 px-4">Default</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
              {environments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                    No environments configured yet.
                  </td>
                </tr>
              ) : (
                environments.map((env) => (
                  <tr key={env.envId} className="hover:bg-gray-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-400 font-bold">{env.baseUrl || '-'}</td>
                    <td className="py-3.5 px-4">
                      {env.authUsername ? (
                        <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                          {env.authUsername}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {env.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          <Check size={12} /> Default
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(env)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(env.envId)}
                          className="p-1.5 text-red-400 hover:text-red-300 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
