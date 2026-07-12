import React from 'react';

interface MainWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MainWrapper: React.FC<MainWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`ml-64 flex-1 flex flex-col h-screen overflow-hidden bg-surface ${className}`}>
      {children}
    </div>
  );
};