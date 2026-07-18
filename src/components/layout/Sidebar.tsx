import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

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
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleWorkspaceSelector = () => {
    navigate(ROUTES.WORKSPACE_LIST);
  };

  return (
    <aside
      className={`bg-surface-container-lowest border-outline-variant/30 fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r px-4 py-4 ${className}`}
    >
      {/* Workspace Selector */}
      <div className="mb-4 px-2">
        <button
          onClick={handleWorkspaceSelector}
          className="bg-surface-container-high border-outline-variant/20 hover:bg-surface-bright group flex w-full cursor-pointer items-center justify-between rounded-xl border p-2 transition-all"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzGLJ0OfLNEylOJDudA6QG8FOYfl1hPs6tzqbrtSSH9d6u60f9Tx8xHX1OVSyGt9EhkhUBNZ2fz5b_fqc6DWuYgDVdEFwcaHkbWA44uYMdBJ0qQITHrvaIpS0tNF1MY_WXXiQ6kg78yteMskw27gDfNkehmAjGDM4ArGfE-VHEPkxgHHB_UzZSHN-ESrdrykf1Hi7ZGh7PLLX9UowE37hEKrakN000PFjj-k86_yEj-k9f1LvMkSDUNTOJjnV2EFiCqNjJLnE7EQ"
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-headline-md text-primary truncate text-sm font-bold">
                Workspace
              </h2>
              <p className="font-label-md text-on-surface-variant/70 truncate text-[10px]">
                Jira Connection
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-colors">
            unfold_more
          </span>
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {backTo && onBack && (
          <button
            onClick={onBack}
            className="text-on-surface-variant hover:bg-surface-container-high border-outline-variant/30 mb-2 flex w-full items-center gap-3 border-b px-4 py-3 font-medium transition-colors duration-200"
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
                  ? 'text-primary border-primary bg-primary/5 border-r-2 font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <span className="font-label-md text-xs">{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={onLogout}
          className="text-error hover:bg-error-container/10 flex w-full items-center gap-3 px-4 py-2 font-medium transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="font-label-md text-xs">Logout</span>
        </button>
      </nav>

      <div className="border-outline-variant/20 mt-4 mb-2 border-t px-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="bg-tertiary/10 rounded p-1">
            <span
              className="material-symbols-outlined text-tertiary text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
          </div>
          <span className="font-code text-on-surface-variant text-[10px]">v2.4.0-stable</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
