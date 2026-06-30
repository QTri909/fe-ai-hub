import React from 'react';

export const PainPoints = () => {
  return (
    <section className="bg-surface-container-low border-y border-surface-variant py-12">
      <div className="max-w-container-max mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-headline-lg text-headline-lg mb-2">Why switch to JAT?</h2>
          <p className="text-on-surface-variant">Leave the manual grunt work behind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface border border-surface-variant rounded-lg p-8 opacity-80">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
              <span className="material-symbols-outlined text-error">close</span>
              <h3 className="font-title-lg text-title-lg">The Old Way</h3>
            </div>
            <ul className="space-y-4 text-on-surface-variant font-body-md">
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] mt-0.5">remove</span> Manual copy-pasting of logs.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] mt-0.5">remove</span> Missing contextual screenshots.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] mt-0.5">remove</span> Delayed feedback loops.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[18px] mt-0.5">remove</span> Stale Jira ticket statuses.</li>
            </ul>
          </div>
          <div className="bg-surface-container border border-primary/50 rounded-lg p-8 relative overflow-hidden shadow-[0_0_30px_rgba(160,120,255,0.05)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined icon-fill">check_circle</span>
              <h3 className="font-title-lg text-title-lg font-bold">The JAT Way</h3>
            </div>
            <ul className="space-y-4 text-on-surface font-body-md relative z-10">
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Instant API sync &amp; auto-creation.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Auto-generated steps to reproduce.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Real-time Slack/Jira notifications.</li>
              <li className="flex items-start gap-2"><span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">check</span> Bi-directional status updates.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
