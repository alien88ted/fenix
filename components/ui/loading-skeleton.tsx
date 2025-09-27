'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
  animate?: boolean;
}

export function LoadingSkeleton({ 
  className, 
  variant = 'default', 
  lines = 1,
  animate = true,
  ...props 
}: LoadingSkeletonProps) {
  const baseClasses = cn(
    'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50',
    'rounded-md',
    animate && 'animate-pulse bg-[length:200%_100%] animate-shimmer',
    className
  );

  switch (variant) {
    case 'card':
      return (
        <div className={cn('p-6 rounded-xl border border-border/50 space-y-4', className)} {...props}>
          <div className={cn(baseClasses, 'h-4 w-1/3')} />
          <div className={cn(baseClasses, 'h-20')} />
          <div className="space-y-2">
            <div className={cn(baseClasses, 'h-3 w-full')} />
            <div className={cn(baseClasses, 'h-3 w-4/5')} />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2" {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                'h-4',
                i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      );

    case 'avatar':
      return (
        <div className={cn(baseClasses, 'w-10 h-10 rounded-full', className)} {...props} />
      );

    case 'button':
      return (
        <div className={cn(baseClasses, 'h-10 w-24 rounded-md', className)} {...props} />
      );

    default:
      return <div className={baseClasses} {...props} />;
  }
}

export function LoadingGrid({ 
  count = 6, 
  className 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} variant="card" style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

export function LoadingList({ 
  count = 5, 
  className 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 p-4 rounded-lg border border-border/50"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/3" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}