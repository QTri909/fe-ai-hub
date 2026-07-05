import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { projectApi } from '@/features/project/api/project.api';
import type { Project } from '@/features/project/types/project.types';

export const ProjectsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const activeWorkspace = useWorkspaceStore(state => state.activeWorkspace);

  const fetchProjects = async () => {
    if (!activeWorkspace) return;
    try {
      setIsLoading(true);
      const data = await projectApi.getProjectsByWorkspaceId(activeWorkspace.id);
      setProjects(data.content || []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncProjects = async () => {
    if (!activeWorkspace) return;
    try {
      setIsSyncing(true);
      await projectApi.syncProjects(activeWorkspace.id);
      await fetchProjects(); // Refresh the list after sync
    } catch (error) {
      console.error('Failed to sync projects', error);
      alert('Failed to sync projects from Jira. Please check your connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace]);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-xl font-bold font-headline-md text-on-surface">Projects</h1>
          <p className="text-xs text-on-surface-variant font-body-md">Manage testing projects and Jira synchronization.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">search</span>
            <input className="bg-surface-container-high border-none rounded-md pl-10 pr-4 py-2 text-sm text-on-surface w-64 focus:ring-2 focus:ring-primary/50 transition-all outline-none" placeholder="Search projects..." type="text"/>
          </div>
          {/* Filter */}
          <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-surface-container-highest/30 border border-outline-variant/50 hover:bg-surface-container-highest/50 transition-colors text-sm font-medium cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter View</span>
          </button>
          {/* New Project */}
          <button className="flex items-center gap-1 px-6 py-2 rounded-md bg-tertiary-container text-on-tertiary-container font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* View Toggle & Sort (Sub-header) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Active Workspace ({projects.length})</span>
        </div>
        <div className="bg-surface-container-high p-1 rounded-lg flex items-center gap-1 border border-outline-variant/30">
          <button 
            className={`p-1.5 rounded-md shadow-sm transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-surface-bright text-primary' : 'text-on-surface-variant hover:bg-surface-bright/50'}`}
            onClick={() => setViewMode('grid')}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </button>
          <button 
            className={`p-1.5 rounded-md shadow-sm transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-surface-bright text-primary' : 'text-on-surface-variant hover:bg-surface-bright/50'}`}
            onClick={() => setViewMode('list')}
          >
            <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center" id="emptyState">
            <div className="w-24 h-24 bg-surface-container-highest/20 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-outline text-[48px] opacity-40">folder_open</span>
            </div>
            <h2 className="font-title-lg font-bold text-on-surface mb-2">No projects found</h2>
            <p className="font-body-md text-on-surface-variant mb-8 max-w-xs">Start by connecting your Jira workspace or manually create a testing project.</p>
            <button 
              onClick={handleSyncProjects}
              disabled={isSyncing}
              className="px-8 py-3 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all flex items-center gap-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={`material-symbols-outlined ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
              {isSyncing ? 'Syncing...' : 'Import Project from Jira'}
            </button>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="bg-surface-container-low rounded-lg border border-outline-variant/50 p-6 transition-all duration-300 card-glow group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-body-lg font-bold text-on-surface truncate max-w-[150px] sm:max-w-[200px]">{project.name}</h3>
                    <code className="font-code text-[11px] bg-surface-container-highest/50 px-1.5 py-0.5 rounded text-outline uppercase">KEY: {project.projectKey}</code>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:bg-surface-bright/50 p-1 rounded-full transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <p className="text-[11px] text-on-surface-variant font-label-md uppercase mb-1">Total Issues</p>
                  <p className="font-bold text-body-lg text-on-surface">0</p>
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant font-label-md uppercase mb-1">Suites</p>
                  <p className="font-bold text-body-lg text-on-surface">0</p>
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant font-label-md uppercase mb-1">Pass Rate</p>
                  <p className="font-bold text-body-lg text-on-surface-variant">N/A</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  <span className="text-[12px] text-on-surface-variant">Never synced</span>
                </div>
                <button className="text-xs font-bold text-primary hover:underline transition-all cursor-pointer">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Status Info */}
      <div className="mt-12 flex items-center justify-between text-[11px] text-outline font-label-md uppercase tracking-widest border-t border-surface-variant/30 pt-6">
        <div className="flex items-center gap-6">
          <span>Showing {projects.length} of {projects.length} projects</span>
          <span className="text-on-surface-variant">•</span>
          <span>Region: US-East-1 (Production)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 
            System Health: Nominal
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
