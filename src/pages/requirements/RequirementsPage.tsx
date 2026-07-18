import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { requirementApi } from '@/features/requirements';
import { projectApi } from '@/features/project/api/project.api';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import type { Requirement } from '@/features/requirements';
import type { Project } from '@/features/project/types/project.types';

export const RequirementsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const fetchRequirements = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const data = await requirementApi.getByProjectId(projectId, 0, 100);
      setRequirements(data.content || []);
    } catch (error) {
      console.error('Failed to fetch requirements', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // Fetch project info for the projectKey used in sync
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const data = await projectApi.getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project', error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSync = async () => {
    if (!activeWorkspace || !project) return;
    try {
      setIsSyncing(true);
      await projectApi.syncProjectRequirements(activeWorkspace.id, project.projectKey);
      await fetchRequirements();
    } catch (error) {
      console.error('Failed to sync requirements', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="animate-fade-in flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-on-surface text-2xl font-bold">Requirements</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing || !project}
            className="border-outline-variant hover:bg-surface-container-high text-on-surface flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}
            >
              sync
            </span>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low border-outline-variant/30 flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
        {/* Toolbar */}
        <div className="border-outline-variant/30 bg-surface-container-lowest flex items-center gap-4 border-b p-4">
          <div className="relative max-w-md flex-1">
            <Search
              className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Search requirements..."
              className="bg-surface-container-high border-outline-variant/30 text-on-surface focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          <button className="bg-surface-container-high border-outline-variant/30 text-on-surface hover:bg-surface-container-highest flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Main Area */}
        <div className="bg-surface-container-lowest flex flex-1 overflow-hidden">
          {/* Table */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            ) : requirements.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-outline mb-4 text-[48px] opacity-50">
                  description
                </span>
                <p className="text-on-surface mb-2 text-lg font-bold">No Requirements Found</p>
                <p className="text-on-surface-variant max-w-sm text-sm">
                  There are no requirements synced for this project. Try syncing from Jira or create
                  a new one.
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead className="bg-surface-container-low border-outline-variant/30 sticky top-0 z-10 border-b shadow-sm">
                  <tr>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Key
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Title
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Type
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Status
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => navigate(`/projects/${projectId}/test-cases`)}
                      className="border-outline-variant/10 hover:bg-surface-container-high/50 cursor-pointer border-b transition-colors"
                    >
                      <td className="text-primary p-4 text-sm font-medium">{req.requirementKey}</td>
                      <td className="text-on-surface max-w-xs truncate p-4 text-sm font-medium">
                        {req.title}
                      </td>
                      <td className="text-on-surface-variant p-4 text-sm">{req.type || 'N/A'}</td>
                      <td className="p-4">
                        <span className="bg-secondary/10 text-secondary border-secondary/20 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase">
                          {req.status || 'N/A'}
                        </span>
                      </td>
                      <td className="text-on-surface-variant p-4 text-sm">
                        {req.priority || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
