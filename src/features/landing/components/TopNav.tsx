import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

export const TopNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface/70 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm font-body-md text-body-md">
      <div className="flex justify-between items-center px-6 py-4 max-w-container-max mx-auto">
        <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">workflow</span>
          JAT
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#features">Features</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#architecture">Architecture</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#dashboard">Dashboard</a>
          <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 active:scale-95 transition-transform" href="#pricing">Pricing</a>
        </div>
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="cursor-pointer bg-primary-container text-on-primary-container px-4 py-2 rounded hover:opacity-90 transition-opacity active:scale-95 transition-transform font-bold"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};
