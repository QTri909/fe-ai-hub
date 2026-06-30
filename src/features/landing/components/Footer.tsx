import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest text-secondary font-label-md text-label-md w-full py-8 border-t border-surface-variant flat no shadows">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-container-max mx-auto gap-4">
        <div className="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined">bug_report</span>
          JiraAutoTest
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center text-on-surface-variant">
          <a className="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Documentation</a>
          <a className="hover:text-tertiary transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
        </div>
        <div className="text-on-surface-variant opacity-80">
          © 2024 JiraAutoTest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
