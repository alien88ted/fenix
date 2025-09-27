'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'from-success/20 to-success/10 border-success/30 text-success',
  error: 'from-destructive/20 to-destructive/10 border-destructive/30 text-destructive',
  warning: 'from-warning/20 to-warning/10 border-warning/30 text-warning',
  info: 'from-info/20 to-info/10 border-info/30 text-info',
};

export function EnhancedToast({ 
  title, 
  description, 
  type = 'info', 
  action,
  onClose 
}: ToastProps) {
  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div
      className={cn(
        'group pointer-events-auto relative overflow-hidden rounded-xl border p-4 pr-8 shadow-lg',
        'bg-gradient-to-br backdrop-blur-xl',
        'animate-in slide-in-from-top-5 fade-in duration-300',
        'transition-all hover:shadow-xl hover:scale-[1.02]',
        colorClass
      )}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full animate-[shimmer_3s_infinite]" />

      <div className="relative flex gap-3">
        {/* Icon with animation */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Icon className="h-5 w-5 animate-in zoom-in-50 duration-300" />
            {type === 'success' && (
              <div className="absolute inset-0 animate-ping">
                <Icon className="h-5 w-5 opacity-30" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold leading-none tracking-tight">
            {title}
          </p>
          {description && (
            <p className="text-sm opacity-90 leading-snug">
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-xs font-medium underline-offset-2 hover:underline transition-all"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'absolute right-2 top-2 rounded-md p-1',
            'opacity-60 hover:opacity-100',
            'transition-all duration-200',
            'hover:bg-white/10 hover:scale-110',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'group-hover:opacity-100'
          )}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </button>
      )}

      {/* Progress bar for auto-dismiss */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
        <div 
          className="h-full bg-current animate-[progress_5s_linear]"
          style={{ animationDuration: '5s' }}
        />
      </div>
    </div>
  );
}

// Add required animation
const style = `
@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}