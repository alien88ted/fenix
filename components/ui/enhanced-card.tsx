'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: boolean;
  gradient?: boolean;
  elevated?: boolean;
  shimmer?: boolean;
  children?: React.ReactNode;
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, interactive = false, glow = false, gradient = false, elevated = false, shimmer = false, children, onClick, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPressed(false);
    };
    const handleMouseDown = () => interactive && setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'modern-card relative overflow-hidden transition-all duration-300 transform-gpu',
          interactive && [
            'cursor-pointer',
            'hover:scale-[1.02] hover:-translate-y-1',
            'active:scale-[0.98] active:translate-y-0',
          ],
          glow && 'shadow-lg hover:shadow-xl hover:shadow-primary/10',
          elevated && 'shadow-elevated hover:shadow-2xl',
          gradient && 'bg-gradient-to-br from-card via-card/98 to-primary/[0.02]',
          isHovered && interactive && 'border-primary/30',
          isPressed && 'scale-[0.98]',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        {...props}
      >
        {/* Animated gradient background */}
        {gradient && (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500',
              isHovered && 'opacity-100'
            )}
          />
        )}

        {/* Glow effect */}
        {glow && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl animate-pulse" />
        )}

        {/* Shimmer effect */}
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Interactive feedback overlay */}
        {interactive && (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 transition-all duration-200 pointer-events-none',
              isHovered && 'from-white/[0.02] to-white/[0.04] dark:from-white/[0.01] dark:to-white/[0.02]'
            )}
          />
        )}
      </Card>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Export sub-components with enhanced versions
export const EnhancedCardHeader = CardHeader;
export const EnhancedCardFooter = CardFooter;
export const EnhancedCardTitle = CardTitle;
export const EnhancedCardDescription = CardDescription;
export const EnhancedCardContent = CardContent;