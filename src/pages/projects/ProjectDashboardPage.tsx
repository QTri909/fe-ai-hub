import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '@/features/project/api/project.api';
import { requirementApi } from '@/features/requirements/api/requirements.api';
import type { Project } from '@/features/project/types/project.types';
import { ROUTES } from '@/core/constants';
import { useWorkspaceStore } from '@/core/store/workspace.store';

export const ProjectDashboardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testCaseCounts, setTestCaseCounts] = useState({ total: 0, generated: 0 });
  const [requirementCount, setRequirementCount] = useState(0);

  const fetchProjectData = useCallback(
    async (showLoading = true) => {
      if (!projectId) return;
      try {
        if (showLoading) setIsLoading(true);
        const [projectData, reqData] = await Promise.all([
          projectApi.getProjectById(projectId),
          requirementApi.getByProjectId(projectId, 0, 100),
        ]);
        setProject(projectData);
        setRequirementCount(reqData.totalElements || 0);

        // Fetch detail for each requirement to get test case counts
        if (reqData.content && reqData.content.length > 0) {
          const details = await Promise.all(
            reqData.content.map((req) => requirementApi.getDetail(req.id).catch(() => null))
          );
          const totals = details.reduce(
            (acc, d) => {
              if (d) {
                acc.total += d.totalTestCases || 0;
                acc.generated += d.generatedTestCases || 0;
              }
              return acc;
            },
            { total: 0, generated: 0 }
          );
          setTestCaseCounts(totals);
        }
      } catch (error) {
        console.error('Failed to fetch project data', error);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    fetchProjectData(true);

    // Poll every 10 seconds for updates
    intervalId = setInterval(() => {
      fetchProjectData(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchProjectData]);

  const handleSync = async () => {
    if (!activeWorkspace || !project) return;
    try {
      setIsSyncing(true);
      await projectApi.syncProjectRequirements(activeWorkspace.id, project.projectKey);
      const data = await projectApi.getProjectById(project.id);
      setProject(data);
    } catch (error) {
      console.error('Failed to sync project requirements', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProjectSettings = () => {
    console.log('Project Settings clicked');
    // TODO: Implement project settings functionality
  };

  const handleViewAllActivity = () => {
    console.log('View All Activity clicked');
    // TODO: Implement view all activity functionality
  };

  const handleStartAIGeneration = () => {
    navigate(`/projects/${projectId}/requirements`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex h-[50vh] max-w-[1200px] flex-col items-center justify-center">
        <div className="border-primary mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-on-surface-variant animate-pulse font-medium">
          Loading project details...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-[1200px] py-20 text-center">
        <span className="material-symbols-outlined text-error mb-4 text-[64px]">error</span>
        <h2 className="text-on-surface mb-2 text-2xl font-bold">Project Not Found</h2>
        <p className="text-on-surface-variant mb-6">
          The project you're looking for doesn't exist or you don't have access.
        </p>
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="bg-primary text-on-primary cursor-pointer rounded-md px-6 py-2 font-medium transition-all hover:brightness-110"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-[1200px] space-y-8">
      {/* Breadcrumbs & Navigation */}
      <div className="text-on-surface-variant flex items-center gap-2 text-sm font-medium">
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="hover:text-primary flex cursor-pointer items-center transition-colors"
        >
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
          Projects
        </button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface max-w-[200px] truncate">{project.name}</span>
      </div>

      {/* Header */}
      <div className="bg-surface-container-low border-outline-variant/30 flex flex-col justify-between gap-6 rounded-2xl border p-8 shadow-sm md:flex-row md:items-start">
        <div className="flex items-start gap-5">
          <div className="from-primary/20 to-tertiary/20 text-primary border-primary/10 flex h-16 w-16 items-center justify-center rounded-xl border bg-gradient-to-br shadow-inner">
            <span className="material-symbols-outlined text-[32px]">folder_special</span>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-headline-lg text-on-surface text-3xl font-bold">
                {project.name}
              </h1>
              <span className="bg-primary/10 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs font-bold">
                {project.projectKey}
              </span>
            </div>
            <p className="text-on-surface-variant font-body-md mt-2 max-w-2xl leading-relaxed">
              No description provided for this project.
            </p>
            <div className="text-on-surface-variant mt-4 flex items-center gap-6 text-xs font-medium">
              <span className="bg-surface-container flex items-center gap-1.5 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                Created:{' '}
                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
              </span>
              <span className="bg-surface-container flex items-center gap-1.5 rounded-full px-3 py-1">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Last Synced:{' '}
                {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleProjectSettings}
            className="border-outline-variant hover:bg-surface-container-high text-on-surface flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Settings
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-primary text-on-primary shadow-primary/20 flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 font-bold shadow-md transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="bg-surface-container-lowest border-outline-variant/30 group rounded-xl border p-6 transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-on-surface-variant text-sm font-semibold tracking-wider uppercase">
              Requirements
            </span>
            <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
              list_alt
            </span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-on-surface font-headline-lg text-4xl font-bold">
              {requirementCount}
            </h3>
            <span className="text-on-surface-variant mb-1.5 text-xs font-medium">Total synced</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border-outline-variant/30 group rounded-xl border p-6 transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-on-surface-variant text-sm font-semibold tracking-wider uppercase">
              Test Cases
            </span>
            <span className="material-symbols-outlined text-secondary transition-transform group-hover:scale-110">
              science
            </span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-on-surface font-headline-lg text-4xl font-bold">
              {testCaseCounts.generated}
            </h3>
            <span className="text-on-surface-variant mb-1.5 text-xs font-medium">Generated</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border-outline-variant/30 group rounded-xl border p-6 transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-on-surface-variant text-sm font-semibold tracking-wider uppercase">
              Pass Rate
            </span>
            <span className="material-symbols-outlined text-green-500 transition-transform group-hover:scale-110">
              check_circle
            </span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-on-surface font-headline-lg text-4xl font-bold">N/A</h3>
            <span className="text-on-surface-variant mb-1.5 text-xs font-medium">
              No executions
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border-outline-variant/30 group rounded-xl border p-6 transition-shadow hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-on-surface-variant text-sm font-semibold tracking-wider uppercase">
              Defects
            </span>
            <span className="material-symbols-outlined text-error transition-transform group-hover:scale-110">
              bug_report
            </span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-on-surface font-headline-lg text-4xl font-bold">0</h3>
            <span className="text-on-surface-variant mb-1.5 text-xs font-medium">Reported</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Quick Actions & Recent Activity */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-surface-container-lowest border-outline-variant/30 overflow-hidden rounded-xl border shadow-sm">
            <div className="border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between border-b px-6 py-5">
              <h2 className="text-on-surface flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                Recent Activity
              </h2>
              <button
                onClick={handleViewAllActivity}
                className="text-primary cursor-pointer text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <span className="material-symbols-outlined text-outline mb-4 text-[48px] opacity-50">
                history
              </span>
              <p className="text-on-surface mb-1 font-medium">No recent activity</p>
              <p className="text-on-surface-variant text-sm">
                There hasn't been any activity in this project yet.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Project Details & Quick Links */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest border-outline-variant/30 rounded-xl border p-6 shadow-sm">
            <h2 className="text-on-surface mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="material-symbols-outlined text-secondary">explore</span>
              Quick Navigation
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/projects/${projectId}/requirements`)}
                className="hover:bg-surface-container-low hover:border-outline-variant/30 group flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary/70 group-hover:text-primary transition-colors">
                    list_alt
                  </span>
                  <span className="text-on-surface text-sm font-medium">Requirements</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-colors">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => navigate(`/projects/${projectId}/test-cases`)}
                className="hover:bg-surface-container-low hover:border-outline-variant/30 group flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary/70 group-hover:text-secondary transition-colors">
                    science
                  </span>
                  <span className="text-on-surface text-sm font-medium">Test Cases</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-colors">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => navigate(`/projects/${projectId}/test-runner`)}
                className="hover:bg-surface-container-low hover:border-outline-variant/30 group flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary/70 group-hover:text-tertiary transition-colors">
                    play_circle
                  </span>
                  <span className="text-on-surface text-sm font-medium">Test Executions</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[18px] transition-colors">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border-outline-variant/30 from-surface-container-lowest to-primary/5 rounded-xl border bg-gradient-to-br p-6 shadow-sm">
            <h2 className="text-on-surface mb-2 text-lg font-bold">Generate Tests</h2>
            <p className="text-on-surface-variant mb-6 text-sm">
              Use AI to automatically generate test cases from your requirements.
            </p>
            <button
              onClick={handleStartAIGeneration}
              className="bg-primary text-on-primary shadow-primary/20 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-3 font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              Start AI Generation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
