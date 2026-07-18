import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`bg-surface-container-lowest border-outline-variant/30 flex h-12 shrink-0 items-center justify-center border-t px-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="font-label-md text-on-surface-variant/70 text-[10px]">
          © 2024 MSS AI Hub. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
