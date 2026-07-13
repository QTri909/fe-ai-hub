import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  name: string;
  path: string;
  icon: string;
  end?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  onLogout: () => void;
  backTo?: string;
  onBack?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  navItems, 
  onLogout, 
  backTo, 
  onBack,
  className = '' 
}) => {
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col py-4 px-4 z-50 ${className}`}>
      {/* Workspace Selector */}
      <div className="px-2 mb-4">
        <div className="flex items-center justify-between p-2 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-bright transition-all cursor-pointer group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzGLJ0OfLNEylOJDudA6QG8FOYfl1hPs6tzqbrtSSH9d6u60f9Tx8xHX1OVSyGt9EhkhUBNZ2fz5b_fqc6DWuYgDVdEFwcaHkbWA44uYMdBJ0qQITHrvaIpS0tNF1MY_WXXiQ6kg78yteMskw27gDfNkehmAjGDM4ArGfE-VHEPkxgHHB_UzZSHN-ESrdrykf1Hi7ZGh7PLLX9UowE37hEKrakN000PFjj-k86_yEj-k9f1LvMkSDUNTOJjnV2EFiCqNjJLnE7EQ"/>
            </div>
            <div className="overflow-hidden">
              <h2 className="font-headline-md text-sm font-bold text-primary truncate">Workspace</h2>
              <p className="font-label-md text-[10px] text-on-surface-variant/70 truncate">Jira Connection</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-sm">unfold_more</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {backTo && onBack && (
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 border-b border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="font-label-md text-xs">{backTo}</span>
          </button>
        )}
        {navItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 transition-colors duration-200 ${
                isActive 
                  ? 'text-primary font-bold border-r-2 border-primary bg-primary/5' 
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <span className="font-label-md text-xs">{item.name}</span>
            </Link>
          );
        })}
        
        <button 
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200 mt-auto"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="font-label-md text-xs">Settings</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-error font-medium hover:bg-error-container/10 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="font-label-md text-xs">Logout</span>
        </button>
      </nav>

      <div className="mt-4 pt-4 border-t border-outline-variant/20 px-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-tertiary/10 rounded">
            <span className="material-symbols-outlined text-tertiary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          </div>
          <span className="font-code text-[10px] text-on-surface-variant">v2.4.0-stable</span>
        </div>
      </div>
    </aside>
  );
};