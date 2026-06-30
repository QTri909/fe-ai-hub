import React from 'react';

export const CoreFeatures = () => {
  return (
    <section className="py-16 max-w-container-max mx-auto px-6" id="features">
      <h2 className="font-headline-lg text-headline-lg text-center mb-12">High-Performance Automation Core</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-surface-container border border-surface-variant rounded-lg p-8 transition-all duration-300 hover-glow group cursor-default">
          <div className="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-secondary">bolt</span>
          </div>
          <h3 className="font-title-lg text-title-lg font-bold mb-2">Smart Triggering</h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            Run suites via CI/CD pipelines (GitHub Actions, Jenkins, GitLab). Intelligent heuristics ensure only relevant tests run based on code diffs.
          </p>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container border border-surface-variant rounded-lg p-8 transition-all duration-300 hover-glow group cursor-default">
          <div className="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-secondary">bug_report</span>
          </div>
          <h3 className="font-title-lg text-title-lg font-bold mb-2">Auto Bug Logging</h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            Create rich Jira tickets with deep stack traces, DOM snapshots, and video recordings automatically on test failure.
          </p>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container border border-surface-variant rounded-lg p-8 transition-all duration-300 hover-glow group cursor-default">
          <div className="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-secondary">sync_alt</span>
          </div>
          <h3 className="font-title-lg text-title-lg font-bold mb-2">Bi-directional Sync</h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            Status updates flow both ways. If a test passes on main branch, the associated Jira ticket is automatically transitioned to 'Done'.
          </p>
        </div>
        {/* Card 4 */}
        <div className="bg-surface-container border border-surface-variant rounded-lg p-8 transition-all duration-300 hover-glow group cursor-default">
          <div className="w-12 h-12 bg-surface border border-surface-variant rounded flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-secondary">monitoring</span>
          </div>
          <h3 className="font-title-lg text-title-lg font-bold mb-2">Insightful Analytics</h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            Gain visibility with comprehensive dashboards showing Test Pass/Fail ratios, flakiness scores, and team resolution velocity.
          </p>
        </div>
      </div>
    </section>
  );
};
