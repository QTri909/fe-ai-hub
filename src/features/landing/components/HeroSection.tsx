import React from 'react';

export const HeroSection = () => {
  return (
    <section className="max-w-container-max mx-auto px-6 flex flex-col items-center text-center pb-16 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <h1 className="font-display text-display md:text-[56px] leading-tight max-w-4xl mb-6">
        Automate Your Tests. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sync Bugs to Jira Instantly.</span>
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-8">
        Eliminate manual bug reporting. Trigger test suites on code commits, catch regressions, and let AI-driven agents log rich Jira tickets with full stack traces and screenshots automatically.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button className="cursor-pointer flex items-center gap-2 bg-primary text-on-primary px-6 py-4 rounded font-bold hover:brightness-110 transition-all active:scale-95">
          <span className="material-symbols-outlined icon-fill">play_arrow</span>
          Watch Demo
        </button>
        <button className="cursor-pointer flex items-center gap-2 border border-surface-variant bg-surface-container-low text-on-surface px-6 py-4 rounded hover:border-primary hover:text-primary transition-all active:scale-95">
          Explore Docs
        </button>
      </div>
      
      <div className="w-full max-w-5xl bg-surface-container rounded-xl border border-surface-variant shadow-2xl overflow-hidden flex flex-col md:flex-row text-left relative">
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent z-10"></div>
        
        <div className="flex-1 p-4 bg-[#0d1117] relative border-b md:border-b-0 md:border-r border-surface-variant">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
            <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
            <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
          </div>
          <pre className="font-code text-code text-on-surface-variant overflow-x-auto"><code className="language-js">
            <span className="text-primary-fixed">describe</span>('Authentication Flow', () =&gt; {'{\n'}
            {'  '}<span className="text-tertiary">it</span>('should login user successfully', async () =&gt; {'{\n'}
            {'    '}<span className="text-[#8b949e]">// PASS</span>{'\n'}
            {'    '}await auth.login('user', 'pass');{'\n'}
            {'    '}expect(auth.state).toBe('logged_in');{'\n'}
            {'  }'});{'\n'}
            {'\n'}
            {'  '}<span className="text-error">it</span>('should handle 2FA timeout', async () =&gt; {'{\n'}
            {'    '}<span className="text-[#8b949e]">// FAIL - Timeout exceeded</span>{'\n'}
            {'    '}await auth.trigger2FA();{'\n'}
            {'    '}<span className="bg-error-container/20 text-error px-1">expect(auth.modal).toBeVisible();</span>{'\n'}
            {'    '}<span className="text-error">^ AssertionError: expected hidden to be visible</span>{'\n'}
            {'  }'});{'\n'}
            {'}'});
          </code></pre>
        </div>
        
        <div className="flex-1 p-8 bg-surface-container-low flex flex-col justify-center items-center relative overflow-hidden">
          <svg className="absolute top-1/2 left-0 w-24 h-8 -translate-x-12 -translate-y-1/2 text-primary hidden md:block" fill="none" viewBox="0 0 100 20">
            <path className="animate-flow" d="M0 10 L100 10" stroke="currentColor" strokeDasharray="6 6" strokeWidth="2"></path>
            <circle className="animate-pulse" cx="100" cy="10" fill="currentColor" r="4"></circle>
          </svg>
          <div className="w-full max-w-sm bg-surface border border-surface-variant rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2 border-b border-surface-variant pb-2">
              <span className="font-code text-[11px] text-on-surface-variant bg-surface-variant px-2 py-1 rounded">JAT-1042</span>
              <span className="flex items-center gap-1 text-[11px] text-error bg-error-container/20 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-[14px]">error</span> Bug
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold mb-1">2FA Modal Visibility Failure</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">AssertionError: expected hidden to be visible during 2FA timeout flow.</p>
            <div className="bg-surface-container-lowest p-2 rounded border border-surface-variant/50 font-code text-[11px] text-on-surface-variant mb-4">
              Stack Trace attached.<br />
              Screenshot: 2fa_timeout_err.png
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px]">AI</div>
                <span className="text-[12px] text-on-surface-variant">Auto-created by JAT</span>
              </div>
              <span className="text-[12px] text-primary">To Do</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
