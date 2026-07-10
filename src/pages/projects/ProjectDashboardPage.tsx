import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '@/features/project/api/project.api';
import type { Project } from '@/features/project/types/project.types';
import { ROUTES } from '@/core/constants';
import { useWorkspaceStore } from '@/core/store/workspace.store';

export const ProjectDashboardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const activeWorkspace = useWorkspaceStore(state => state.activeWorkspace);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        setIsLoading(true);
        const data = await projectApi.getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSync = async () => {
    if (!activeWorkspace || !project) return;
    try {
      setIsSyncing(true);
      await projectApi.syncProjectRequirements(activeWorkspace.id, project.projectKey);
      // Optional: Refetch project details if sync updates anything on the project itself
      const data = await projectApi.getProjectById(project.id);
      setProject(data);
    } catch (error) {
      console.error('Failed to sync project requirements', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto h-[50vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-medium animate-pulse">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-[1200px] mx-auto text-center py-20">
        <span className="material-symbols-outlined text-[64px] text-error mb-4">error</span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Project Not Found</h2>
        <p className="text-on-surface-variant mb-6">The project you're looking for doesn't exist or you don't have access.</p>
        <button 
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="px-6 py-2 bg-primary text-on-primary rounded-md font-medium hover:brightness-110 transition-all cursor-pointer"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
        <button 
          onClick={() => navigate(ROUTES.PROJECTS)} 
          className="hover:text-primary transition-colors cursor-pointer flex items-center"
        >
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Projects
        </button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface truncate max-w-[200px]">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-tertiary/20 rounded-xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
            <span className="material-symbols-outlined text-[32px]">folder_special</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold font-headline-lg text-on-surface">{project.name}</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {project.projectKey}
              </span>
            </div>
            <p className="text-on-surface-variant font-body-md max-w-2xl mt-2 leading-relaxed">
              {project.description || 'No description provided for this project.'}
            </p>
            <div className="flex items-center gap-6 mt-4 text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1.5 bg-surface-container py-1 px-3 rounded-full">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-surface-container py-1 px-3 rounded-full">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Last Synced: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors font-semibold text-sm text-on-surface flex items-center gap-2 cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Settings
          </button>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Requirements</span>
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">list_alt</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-on-surface font-headline-lg">0</h3>
            <span className="text-xs text-on-surface-variant font-medium mb-1.5">Total synced</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Test Cases</span>
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">science</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-on-surface font-headline-lg">0</h3>
            <span className="text-xs text-on-surface-variant font-medium mb-1.5">Generated</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Pass Rate</span>
            <span className="material-symbols-outlined text-green-500 group-hover:scale-110 transition-transform">check_circle</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-on-surface font-headline-lg">N/A</h3>
            <span className="text-xs text-on-surface-variant font-medium mb-1.5">No executions</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Defects</span>
            <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">bug_report</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-4xl font-bold text-on-surface font-headline-lg">0</h3>
            <span className="text-xs text-on-surface-variant font-medium mb-1.5">Reported</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                Recent Activity
              </h2>
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">View All</button>
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4 opacity-50">history</span>
              <p className="text-on-surface font-medium mb-1">No recent activity</p>
              <p className="text-sm text-on-surface-variant">There hasn't been any activity in this project yet.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Project Details & Quick Links */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">explore</span>
              Quick Navigation
            </h2>
            <div className="space-y-2">
              <button 
                onClick={() => navigate(`/projects/${projectId}/requirements`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low text-left transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30 group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary/70 group-hover:text-primary transition-colors">list_alt</span>
                  <span className="font-medium text-sm text-on-surface">Requirements</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">chevron_right</span>
              </button>
              
              <button 
                onClick={() => navigate(`/projects/${projectId}/test-cases`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low text-left transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30 group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary/70 group-hover:text-secondary transition-colors">science</span>
                  <span className="font-medium text-sm text-on-surface">Test Cases</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">chevron_right</span>
              </button>

              <button 
                onClick={() => navigate(`/projects/${projectId}/test-runner`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low text-left transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30 group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary/70 group-hover:text-tertiary transition-colors">play_circle</span>
                  <span className="font-medium text-sm text-on-surface">Test Executions</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm bg-gradient-to-br from-surface-container-lowest to-primary/5">
            <h2 className="text-lg font-bold text-on-surface mb-2">Generate Tests</h2>
            <p className="text-sm text-on-surface-variant mb-6">Use AI to automatically generate test cases from your requirements.</p>
            <button className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              Start AI Generation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
