'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

interface EnhancedButtonProps extends ButtonProps {
  ripple?: boolean;
  haptic?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  glow?: boolean;
}

export const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(({
  className,
  children,
  ripple = true,
  haptic = true,
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  pulse = false,
  glow = false,
  onClick,
  disabled,
  ...props
}, ref) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const button = ref || buttonRef;
    if (!button || !('current' in button) || !button.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsPressed(false);
      }
    };

    button.current.addEventListener('keydown', handleKeyDown);
    button.current.addEventListener('keyup', handleKeyUp);

    return () => {
      if (button.current) {
        button.current.removeEventListener('keydown', handleKeyDown);
        button.current.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [ref]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;

    // Haptic feedback for mobile devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Ripple effect
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = { x, y, size };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r !== newRipple));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <Button
      ref={ref || buttonRef}
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isPressed && 'scale-95',
        pulse && !loading && 'animate-pulse',
        glow && 'shadow-lg shadow-primary/25',
        className
      )}
      onClick={handleClick}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-label={loading ? loadingText : undefined}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Button content */}
      <span className={cn(
        'relative z-10 flex items-center justify-center gap-2',
        loading && 'opacity-0'
      )}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-2 text-sm">{loadingText}</span>
        </span>
      )}

      {/* Focus ring animation */}
      <span 
        className={cn(
          "absolute inset-0 rounded-[inherit] ring-2 ring-primary/50 ring-offset-2 ring-offset-background opacity-0 transition-opacity duration-200",
          "group-focus-visible:opacity-100"
        )}
        aria-hidden="true"
      />
    </Button>
  );
});

EnhancedButton.displayName = 'EnhancedButton';