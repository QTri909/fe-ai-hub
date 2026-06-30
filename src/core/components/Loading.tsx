import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ size = 'md', className, ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={twMerge(
        'animate-spin rounded-full border-solid border-slate-700 border-t-indigo-600',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

export const LoadingOverlay = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={twMerge(
        'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
    </div>
  );
};

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton = ({ variant = 'rect', className, ...props }: SkeletonProps) => {
  return (
    <div
      className={twMerge(
        'animate-pulse bg-slate-800',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'rect' && 'h-24 w-full rounded-md',
        variant === 'circle' && 'h-12 w-12 rounded-full',
        className
      )}
      {...props}
    />
  );
};
