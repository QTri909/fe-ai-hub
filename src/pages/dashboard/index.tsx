import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import { projectApi } from '@/features/project/api/project.api';
import type { Project } from '@/features/project/types/project.types';

export const DashboardPage = () => {
  const activeWorkspace = useWorkspaceStore(state => state.activeWorkspace);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspace) return;
      try {
        setIsLoading(true);
        const data = await projectApi.getProjectsByWorkspaceId(activeWorkspace.id, 0, 3); // Get top 3
        setProjects(data.content || []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
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
          <p className="font-headline-md text-2xl mt-1 text-on-surface">4</p>
        </div>
        
        {/* Issues Analyzed */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">query_stats</span>
            <span className="text-[10px] font-code text-tertiary">↑ 12%</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Issues Analyzed</h3>
          <p className="font-headline-md text-2xl mt-1 text-on-surface">128</p>
        </div>
        
        {/* Tests Generated */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-primary p-1 bg-primary/10 rounded-md text-sm">auto_fix_high</span>
            <span className="text-[10px] font-code text-tertiary">Live</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Tests Generated</h3>
          <p className="font-headline-md text-2xl mt-1 text-on-surface">1,024</p>
        </div>
        
        {/* Success Rate */}
        <div className="bg-[#1e293b] border border-outline-variant/30 p-4 rounded-xl transition-all duration-300 cyber-border-glow" style={{ borderColor: 'rgba(73, 68, 84, 0.3)' }}>
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-tertiary p-1 bg-tertiary/10 rounded-md text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="text-[10px] font-code text-on-surface-variant">Stable</span>
          </div>
          <h3 className="font-label-md text-xs text-on-surface-variant">Success Rate</h3>
          <p className="font-headline-md text-2xl mt-1 text-tertiary">94%</p>
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
              const bars = ['bg-primary w-[45%]', 'bg-tertiary w-[82%]', 'bg-primary-container w-[12%]'];
              const coverages = ['45%', '82%', '12%'];
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
              {/* Row 1 */}
              <tr className="hover:bg-surface-container/40 transition-colors">
                <td className="px-4 py-2 font-code text-xs text-primary">ECO-102</td>
                <td className="px-4 py-2 font-body-md text-sm text-on-surface">Implement VNPay checkout integration</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    <span className="text-[10px] text-on-surface-variant">User Story</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-[10px] font-bold">
                    <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                    Generated
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button className="p-1 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                </td>
              </tr>
              
              {/* Row 2 */}
              <tr className="hover:bg-surface-container/40 transition-colors">
                <td className="px-4 py-2 font-code text-xs text-primary">ECO-105</td>
                <td className="px-4 py-2 font-body-md text-sm text-on-surface">Fix session timeout on mobile safari</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>pest_control</span>
                    <span className="text-[10px] text-on-surface-variant">Bug</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold">
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                    Analyzing...
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button className="p-1 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-surface-container/40 transition-colors">
                <td className="px-4 py-2 font-code text-xs text-primary">ECO-108</td>
                <td className="px-4 py-2 font-body-md text-sm text-on-surface">Add coupon code validation at cart</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    <span className="text-[10px] text-on-surface-variant">User Story</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-variant border border-outline-variant text-on-surface-variant text-[10px] font-bold">
                    Pending
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button className="p-1 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                </td>
              </tr>

              {/* Row 4: Skeleton 1 */}
              <tr className="opacity-50">
                <td className="px-4 py-2"><div className="h-3 w-12 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-3 w-48 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-3 w-16 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-4 w-20 skeleton rounded-full"></div></td>
                <td className="px-4 py-2 text-right"><div className="h-3 w-3 ml-auto skeleton rounded-full"></div></td>
              </tr>

              {/* Row 5: Skeleton 2 */}
              <tr className="opacity-30">
                <td className="px-4 py-2"><div className="h-3 w-12 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-3 w-32 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-3 w-16 skeleton rounded"></div></td>
                <td className="px-4 py-2"><div className="h-4 w-20 skeleton rounded-full"></div></td>
                <td className="px-4 py-2 text-right"><div className="h-3 w-3 ml-auto skeleton rounded-full"></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
