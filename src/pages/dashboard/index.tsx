import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { projectApi } from '@/features/project/api/project.api';
import type { Project } from '@/features/project/types/project.types';

export const DashboardPage = () => {
  const activeWorkspace = useWorkspaceStore(state => state.activeWorkspace);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchProjects = async (showLoading = true) => {
      if (!activeWorkspace) return;
      try {
        if (showLoading) setIsLoading(true);
        const data = await projectApi.getProjectsByWorkspaceId(activeWorkspace.id, 0, 3); // Get top 3
        setProjects(data.content || []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    };

    fetchProjects(true);

    // Poll every 5 seconds to get real-time sync updates
    intervalId = setInterval(() => {
      fetchProjects(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeWorkspace]);

  return (
    <div className="max-w-container-max mx-auto space-y-4">
      {/* Title & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-xl text-on-surface">Workspace Overview</h1>
          <p className="text-on-surface-variant font-body-md text-xs mt-1">Real-time automation health and sync status.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant text-on-surface-variant font-label-md text-xs rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter View
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-on-secondary-fixed font-bold font-label-md text-xs rounded-lg hover:opacity-90 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Synced */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">hub</span>
            <span className="text-[10px] font-code text-tertiary">+1 this week</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Projects Synced</h3>
          <p className="font-headline-md text-2xl mt-1 text-on-surface">{projects.length}</p>
        </div>
        
        {/* Issues Analyzed */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">query_stats</span>
            <span className="text-[10px] font-code text-tertiary">↑ 12%</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Issues Analyzed</h3>
          <p className="font-headline-md text-2xl mt-1 text-on-surface">0</p>
        </div>
        
        {/* Tests Generated */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">auto_fix_high</span>
            <span className="text-[10px] font-code text-tertiary">Live</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Tests Generated</h3>
          <p className="font-headline-md text-2xl mt-1 text-on-surface">0</p>
        </div>
        
        {/* Success Rate */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-tertiary p-1 bg-tertiary/10 rounded-md text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="text-[10px] font-code text-on-surface-variant">Stable</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Success Rate</h3>
          <p className="font-headline-md text-2xl mt-1 text-tertiary">N/A</p>
        </div>
      </div>

      {/* Active Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-lg text-on-surface">Active Projects</h2>
          <a className="text-primary font-label-md text-xs hover:underline cursor-pointer">View all</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant font-body-md text-sm">
              No active projects found.
            </div>
          ) : (
            projects.map((project, index) => {
              const icons = ['shopping_cart', 'account_balance', 'inventory_2'];
              const bgs = ['bg-primary/20 text-primary', 'bg-secondary-container/20 text-secondary', 'bg-surface-variant text-on-surface-variant'];
              const bars = ['bg-primary w-[0%]', 'bg-tertiary w-[0%]', 'bg-primary-container w-[0%]'];
              const coverages = ['0%', '0%', '0%'];
              const i = index % 3;

              return (
                <div key={project.id} className="bg-[#1e293b] border border-outline-variant/30 rounded-xl p-4 group transition-all cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgs[i].split(' ')[0]}`}>
                      <span className={`material-symbols-outlined text-xl ${bgs[i].split(' ')[1]}`}>{icons[i]}</span>
                    </div>
                    <div>
                      <h4 className="font-title-lg text-sm font-bold text-on-surface truncate max-w-[120px] sm:max-w-[150px]">{project.name}</h4>
                      <span className="font-code text-[10px] text-on-surface-variant">KEY: {project.projectKey}</span>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between font-label-md text-[10px] mb-1">
                      <span className="text-on-surface-variant">Test Coverage</span>
                      <span className="text-on-surface">{coverages[i]}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bars[i]}`}></div>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-outline-variant text-on-surface-variant font-bold text-xs rounded-lg group-hover:border-primary group-hover:text-primary transition-all cursor-pointer">
                    View Project
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Recent Jira Issues Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-lg text-on-surface">Recent Jira Issues</h2>
          <div className="flex items-center gap-2">
            <span className="font-label-md text-on-surface-variant text-[10px]">Auto-Sync: 2m ago</span>
            <button className="p-1 hover:bg-surface-container-high rounded-lg text-primary cursor-pointer">
              <span className="material-symbols-outlined text-sm">refresh</span>
            </button>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-outline-variant/30 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant/30">
                <th className="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Issue Key</th>
                <th className="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Summary</th>
                <th className="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">AI Status</th>
                <th className="px-4 py-2 font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant font-body-md text-sm">
                  No recent issues found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
