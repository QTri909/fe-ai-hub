import React from 'react';

export const DashboardPreview = () => {
  return (
    <section className="py-12 bg-surface border-t border-surface-variant" id="dashboard">
      <div className="max-w-container-max mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-headline-lg text-headline-lg mb-2">Command Center</h2>
          <p className="text-on-surface-variant">Everything you need, visible at a glance.</p>
        </div>
        
        <div className="bg-surface-container rounded-xl border border-surface-variant shadow-2xl overflow-hidden flex h-[500px]">
          {/* Sidebar */}
          <div className="w-16 border-r border-surface-variant bg-surface flex flex-col items-center py-4 gap-6 hidden sm:flex">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary mb-8">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">analytics</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">list_alt</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer mt-auto">settings</span>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6 flex flex-col gap-6 bg-[#0b1326] overflow-y-auto">
            <h3 className="font-title-lg font-bold text-on-surface border-b border-surface-variant pb-2">Overview</h3>
            
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-low border border-surface-variant p-4 rounded flex flex-col">
                <span className="text-label-md text-on-surface-variant mb-1">Total Executions</span>
                <span className="text-headline-md font-bold text-on-surface">1,240</span>
                <span className="text-[10px] text-tertiary mt-1">+12% this week</span>
              </div>
              <div className="bg-surface-container-low border border-surface-variant p-4 rounded flex flex-col">
                <span className="text-label-md text-on-surface-variant mb-1">Success Rate</span>
                <span className="text-headline-md font-bold text-tertiary">94.2%</span>
                <span className="text-[10px] text-on-surface-variant mt-1">Target: &gt;95%</span>
              </div>
              <div className="bg-surface-container-low border border-surface-variant p-4 rounded flex flex-col">
                <span className="text-label-md text-on-surface-variant mb-1">Bugs Auto-Created</span>
                <span className="text-headline-md font-bold text-error">14</span>
                <span className="text-[10px] text-error mt-1">-3 pending review</span>
              </div>
            </div>
            
            {/* Recent Table */}
            <div className="bg-surface-container-low border border-surface-variant rounded flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-surface-variant bg-surface flex justify-between items-center">
                <span className="font-label-md font-bold">Recent Executions</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer">more_horiz</span>
              </div>
              <div className="p-0">
                <div className="flex px-4 py-2 border-b border-surface-variant/50 text-label-md text-on-surface-variant">
                  <div className="flex-1">Suite</div>
                  <div className="w-24">Duration</div>
                  <div className="w-24">Status</div>
                </div>
                <div className="flex px-4 py-2 border-b border-surface-variant/50 items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
                  <div className="flex-1 font-code text-[12px]">E2E_Checkout_Flow</div>
                  <div className="w-24 text-on-surface-variant text-[12px]">2m 14s</div>
                  <div className="w-24"><span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">Passed</span></div>
                </div>
                <div className="flex px-4 py-2 border-b border-surface-variant/50 items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
                  <div className="flex-1 font-code text-[12px]">API_Auth_Regression</div>
                  <div className="w-24 text-on-surface-variant text-[12px]">45s</div>
                  <div className="w-24"><span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">Passed</span></div>
                </div>
                <div className="flex px-4 py-2 items-center text-body-md hover:bg-surface-variant/20 cursor-pointer">
                  <div className="flex-1 font-code text-[12px]">UI_Dashboard_Metrics</div>
                  <div className="w-24 text-on-surface-variant text-[12px]">1m 02s</div>
                  <div className="w-24 flex items-center gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-error-container text-on-error-container">Failed</span>
                    <span className="material-symbols-outlined text-[14px] text-error" title="Jira Ticket Auto-created">bug_report</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
