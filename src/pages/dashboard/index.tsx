import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { projectApi } from '@/features/project/api/project.api';
import { testCaseApi } from '@/features/project/api/testCases.api';
import { historyApi } from '@/features/history/api/history.api';
import type { Project, Page } from '@/features/project/types/project.types';
import type { TestCaseAllTableItem } from '@/features/project/api/testCases.api';
import type { RecentActivity } from '@/features/history/types/history.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

const PAGE_SIZE = 10;

export const DashboardPage = () => {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const navigate = useNavigate();

  // ── All Test Cases Table (paginated) ──────────────────────
  const [testCasePage, setTestCasePage] = useState<Page<TestCaseAllTableItem> | null>(null);
  const [testCases, setTestCases] = useState<TestCaseAllTableItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(true);
  const [testCasesError, setTestCasesError] = useState('');

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const fetchProjects = async (showLoading = true) => {
      if (!activeWorkspace) return;
      try {
        if (showLoading) setIsLoading(true);
        const data = await projectApi.getProjectsByWorkspaceId(activeWorkspace.id, 0, 3);
        setProjects(data.content || []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    };

    const fetchTestCases = async (page: number) => {
      try {
        setIsLoadingTestCases(true);
        const res = await testCaseApi.getAllTestCasesTable(page, PAGE_SIZE);
        setTestCasePage(res);
        setTestCases(res.content || []);
        setTestCasesError('');
      } catch (error) {
        console.error('Failed to fetch all test cases', error);
        setTestCasesError('Failed to load test cases.');
      } finally {
        setIsLoadingTestCases(false);
      }
    };

    const fetchRecentActivities = async () => {
      if (!activeWorkspace) return;
      try {
        const data = await projectApi.getProjectsByWorkspaceId(activeWorkspace.id, 0, 20);
        const projectIds = data.content?.map((p: Project) => p.id) || [];
        if (projectIds.length > 0) {
          const activities = await historyApi.getRecentActivity(projectIds[0], 5);
          setRecentActivities(activities);
        }
      } catch (error) {
        console.error('Failed to fetch recent activities', error);
      }
    };

    fetchProjects(true);
    fetchTestCases(0);
    fetchRecentActivities();

    intervalId = setInterval(() => {
      fetchProjects(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeWorkspace]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    testCaseApi
      .getAllTestCasesTable(newPage, PAGE_SIZE)
      .then((res) => {
        setTestCasePage(res);
        setTestCases(res.content || []);
      })
      .catch((err) => {
        console.error('Failed to fetch page', err);
        setTestCasesError('Failed to load test cases.');
      });
  };

  const handleFilterView = () => {
    console.log('Filter View clicked');
  };

  const handleExportReport = () => {
    console.log('Export Report clicked');
  };

  const handleViewAllProjects = () => {
    navigate(ROUTES.PROJECTS);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  const totalPages = testCasePage?.totalPages ?? 0;
  const totalElements = testCasePage?.totalElements ?? testCases.length;

  return (
    <div className="max-w-container-max mx-auto space-y-4">
      {/* Title & Actions */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-headline-md text-on-surface text-xl">Workspace Overview</h1>
          <p className="text-on-surface-variant font-body-md mt-1 text-xs">
            Real-time automation health and sync status.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilterView}
            className="border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-high flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter View
          </button>
          <button
            onClick={handleExportReport}
            className="bg-secondary text-on-secondary-fixed font-label-md flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="border-outline-variant/30 cyber-border-glow rounded-xl border bg-[#1e293b] p-4 transition-all duration-300"
          style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-md p-1 text-sm">
              hub
            </span>
            <span className="font-code text-tertiary text-[10px]">+1 this week</span>
          </div>
          <h3 className="font-label-md text-on-surface-variant text-xs">Projects Synced</h3>
          <p className="font-headline-md text-on-surface mt-1 text-2xl">{projects.length}</p>
        </div>

        <div
          className="border-outline-variant/30 cyber-border-glow rounded-xl border bg-[#1e293b] p-4 transition-all duration-300"
          style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-md p-1 text-sm">
              query_stats
            </span>
            <span className="font-code text-tertiary text-[10px]">↑ 12%</span>
          </div>
          <h3 className="font-label-md text-on-surface-variant text-xs">Issues Analyzed</h3>
          <p className="font-headline-md text-on-surface mt-1 text-2xl">0</p>
        </div>

        <div
          className="border-outline-variant/30 cyber-border-glow rounded-xl border bg-[#1e293b] p-4 transition-all duration-300"
          style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-md p-1 text-sm">
              auto_fix_high
            </span>
            <span className="font-code text-tertiary text-[10px]">Live</span>
          </div>
          <h3 className="font-label-md text-on-surface-variant text-xs">Tests Generated</h3>
          <p className="font-headline-md text-on-surface mt-1 text-2xl">{totalElements}</p>
        </div>

        <div
          className="border-outline-variant/30 cyber-border-glow rounded-xl border bg-[#1e293b] p-4 transition-all duration-300"
          style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span
              className="material-symbols-outlined text-tertiary bg-tertiary/10 rounded-md p-1 text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-code text-on-surface-variant text-[10px]">Stable</span>
          </div>
          <h3 className="font-label-md text-on-surface-variant text-xs">Success Rate</h3>
          <p className="font-headline-md text-tertiary mt-1 text-2xl">N/A</p>
        </div>
      </div>

      {/* Active Projects Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline-md text-on-surface text-lg">Active Projects</h2>
          <button
            onClick={handleViewAllProjects}
            className="text-primary font-label-md cursor-pointer text-xs hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-on-surface-variant font-body-md col-span-full py-8 text-center text-sm">
              No active projects found.
            </div>
          ) : (
            projects.map((project, index) => {
              const icons = ['shopping_cart', 'account_balance', 'inventory_2'];
              const bgs = [
                'bg-primary/20 text-primary',
                'bg-secondary-container/20 text-secondary',
                'bg-surface-variant text-on-surface-variant',
              ];
              const bars = [
                'bg-primary w-[0%]',
                'bg-tertiary w-[0%]',
                'bg-primary-container w-[0%]',
              ];
              const coverages = ['0%', '0%', '0%'];
              const i = index % 3;

              return (
                <div
                  key={project.id}
                  className="border-outline-variant/30 group cyber-border-glow rounded-xl border bg-[#1e293b] p-4 transition-all"
                  style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgs[i].split(' ')[0]}`}
                    >
                      <span className={`material-symbols-outlined text-xl ${bgs[i].split(' ')[1]}`}>
                        {icons[i]}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-lg text-on-surface max-w-[120px] truncate text-sm font-bold sm:max-w-[150px]">
                        {project.name}
                      </h4>
                      <span className="font-code text-on-surface-variant text-[10px]">
                        KEY: {project.projectKey}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 space-y-1">
                    <div className="font-label-md mb-1 flex justify-between text-[10px]">
                      <span className="text-on-surface-variant">Test Coverage</span>
                      <span className="text-on-surface">{coverages[i]}</span>
                    </div>
                    <div className="bg-surface-container-high h-1 w-full overflow-hidden rounded-full">
                      <div className={`h-full rounded-full ${bars[i]}`}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewProject(project.id)}
                    className="border-outline-variant text-on-surface-variant group-hover:border-primary group-hover:text-primary w-full cursor-pointer rounded-lg border py-2 text-xs font-bold transition-all"
                  >
                    View Project
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline-md text-on-surface text-lg">Recent Activity</h2>
        </div>
        <div className="border-outline-variant/30 rounded-xl border bg-[#1e293b]">
          {recentActivities.length === 0 ? (
            <div className="text-on-surface-variant font-body-md px-4 py-8 text-center text-sm">
              No recent activity.
            </div>
          ) : (
            <ul className="divide-outline-variant/20 divide-y">
              {recentActivities.map((activity) => {
                const typeIcons: Record<string, string> = {
                  TEST_GENERATED: 'auto_fix_high',
                  TEST_RUN_COMPLETED: 'check_circle',
                  REQUIREMENT_SYNCED: 'sync',
                  PROJECT_CREATED: 'add_circle',
                };
                const typeColors: Record<string, string> = {
                  TEST_GENERATED: 'text-primary bg-primary/10',
                  TEST_RUN_COMPLETED: 'text-tertiary bg-tertiary/10',
                  REQUIREMENT_SYNCED: 'text-secondary bg-secondary/10',
                  PROJECT_CREATED: 'text-on-surface-variant bg-surface-container-high',
                };
                const color =
                  typeColors[activity.type] || 'text-on-surface-variant bg-surface-container-high';
                return (
                  <li key={activity.id} className="flex items-start gap-3 px-4 py-3">
                    <span className={`material-symbols-outlined ${color} rounded-md p-1 text-sm`}>
                      {typeIcons[activity.type] || 'info'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-body-md text-on-surface truncate text-sm">
                        {activity.message}
                      </p>
                      <p className="font-code text-on-surface-variant mt-0.5 text-[10px]">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-code text-on-surface-variant mt-0.5 text-[10px]">
                      {activity.projectName}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* All Test Cases Table Section (Paginated) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline-md text-on-surface text-lg">Test Cases</h2>
          <div className="flex items-center gap-3">
            <span className="font-code text-on-surface-variant text-[10px]">
              {totalElements > 0
                ? `Showing ${currentPage * PAGE_SIZE + 1}–${Math.min(
                    (currentPage + 1) * PAGE_SIZE,
                    totalElements
                  )} of ${totalElements}`
                : `${totalElements} total`}
            </span>
            <span className="font-code text-on-surface-variant text-[10px]">
              {PAGE_SIZE} per page
            </span>
          </div>
        </div>
        <div className="border-outline-variant/30 overflow-x-auto rounded-xl border bg-[#1e293b]">
          {isLoadingTestCases ? (
            <div className="flex justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
            </div>
          ) : testCasesError ? (
            <div className="text-error font-body-md px-4 py-8 text-center text-sm">
              {testCasesError}
            </div>
          ) : testCases.length === 0 ? (
            <div className="text-on-surface-variant font-body-md px-4 py-8 text-center text-sm">
              No test cases found.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high/50 border-outline-variant/30 border-b">
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-[10px] tracking-wider uppercase">
                    Code
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-[10px] tracking-wider uppercase">
                    Title
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-[10px] tracking-wider uppercase">
                    Requirement
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-center text-[10px] tracking-wider uppercase">
                    Steps
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-center text-[10px] tracking-wider uppercase">
                    Scripts
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-center text-[10px] tracking-wider uppercase">
                    Test Data
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-center text-[10px] tracking-wider uppercase">
                    Last Run
                  </th>
                  <th className="font-label-md text-on-surface-variant px-4 py-2 text-[10px] tracking-wider uppercase">
                    Last Run Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-outline-variant/20 divide-y">
                {testCases.map((tc) => (
                  <tr
                    key={tc.testCaseId}
                    className="hover:bg-surface-container-high/30 transition-colors"
                  >
                    <td className="font-code text-primary px-4 py-3 text-xs font-bold">
                      {tc.testCaseCode}
                    </td>
                    <td className="font-body-md text-on-surface max-w-[200px] truncate px-4 py-3 text-sm">
                      {tc.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-code text-on-surface-variant inline-flex flex-col text-[10px]">
                        <span>{tc.requirementKey}</span>
                        <span className="max-w-[150px] truncate">{tc.requirementTitle}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-code text-on-surface-variant text-xs">
                        {tc.stepCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-code text-on-surface-variant text-xs">
                        {tc.scriptCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-code text-on-surface-variant text-xs">
                        {tc.testDataCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tc.lastRunStatus === null ? (
                        <span className="text-on-surface-variant font-code text-[10px]">—</span>
                      ) : (
                        <span
                          className={`font-label-md inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                            tc.lastRunStatus === 'PASSED'
                              ? 'bg-tertiary/10 text-tertiary'
                              : 'bg-error/10 text-error'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {tc.lastRunStatus === 'PASSED' ? 'check_circle' : 'cancel'}
                          </span>
                          {tc.lastRunStatus}
                        </span>
                      )}
                    </td>
                    <td className="font-code text-on-surface-variant px-4 py-3 text-[10px]">
                      {formatDate(tc.lastRunTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`font-label-md flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                currentPage === 0
                  ? 'text-on-surface-variant cursor-not-allowed opacity-40'
                  : 'text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`font-code flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors ${
                  i === currentPage
                    ? 'bg-primary text-on-primary-fixed'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`font-label-md flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                currentPage >= totalPages - 1
                  ? 'text-on-surface-variant cursor-not-allowed opacity-40'
                  : 'text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Next
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
