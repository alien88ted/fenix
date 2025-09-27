'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';

interface EnhancedButtonProps extends ButtonProps {
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  shimmer?: boolean;
  haptic?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, children, ripple = true, glow = false, pulse = false, shimmer = false, haptic = true, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }

      // Ripple effect
      if (ripple && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { x, y, id }]);

        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      }

      // Call original onClick
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (buttonRef.current !== node) {
            buttonRef.current = node;
          }
        }}
        className={cn(
          'relative overflow-hidden transform-gpu transition-all duration-200',
          glow && 'shadow-lg hover:shadow-xl hover:shadow-primary/20',
          pulse && 'animate-pulse',
          shimmer && 'shimmer-effect',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Shimmer overlay */}
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Add required CSS animations
const style = `
@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(15);
    opacity: 0;
  }
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.shimmer-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 2s infinite;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}