import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`h-14 flex justify-between items-center px-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 sticky top-0 z-40 shrink-0 ${className}`}>
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50 text-on-surface" 
            placeholder="Search Jira issues or tests..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Jira Sync: Active</span>
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
          <button className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">sync</span>
          </button>
          <button className="p-1.5 hover:bg-surface-container-high/50 rounded-full text-on-surface-variant transition-colors relative cursor-pointer">
            <span className="material-symbols-outlined text-sm">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
          <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/20">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgH0krT49JvFm1jJv7Rv-y8OkmMWfFfmc4GW3NvCog8fqGNEvidCxP37BsKo99iR9nIV-JnYSLuJFtmIRwXCIr50I72yqtzkLXzjZouO7ABvE3rJZkJAmzOgUy43nYQHg-dQTLIelfprdmX5gkaVU6xtZfWz6MDbEC2oT7jgITum8ER4ujzMLPclTMSiXTfu_W613QAVd-HXijOARb5Fm-DtKoDdmU2h9cBwN616fkMFM6_0E28x1c3uDCb80M9rGR33sICehXPyA"/>
          </div>
        </div>
      </div>
    </header>
  );
};