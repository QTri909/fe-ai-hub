import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`h-12 flex items-center justify-between px-4 bg-surface-container-lowest border-t border-outline-variant/30 shrink-0 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
        <span className="font-code text-[10px] text-on-surface-variant">v2.4.0-stable</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-label-md text-[10px] text-on-surface-variant/70">© 2024 MSS AI Hub. All rights reserved.</span>
      </div>
    </footer>
  );
};