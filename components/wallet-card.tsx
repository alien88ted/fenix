'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface WalletCardProps {
  balance: string;
  address: string;
  network?: string;
  isLoading?: boolean;
  className?: string;
}

export function WalletCard({ 
  balance, 
  address, 
  network = 'Secure Network',
  isLoading = false,
  className 
}: WalletCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [balance]);

  if (isLoading) {
    return (
      <Card className={cn("modern-card bg-card border border-border/30", className)}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-12 w-48 mx-auto" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "modern-card bg-gradient-to-br from-card via-card to-primary/5 border border-border/30 transition-all duration-300",
      "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]",
      "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-background",
      className
    )}>
      <CardContent className="p-8 text-center relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-80">
              Total Balance
            </p>
            <div className={cn(
              "text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight leading-none transition-all duration-500",
              isAnimating && "scale-110 text-primary"
            )}>
              <span className="inline-block transition-all duration-300 hover:scale-105">
                ${balance}
              </span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              ≈ {balance} USDT
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-success rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping" />
                <div className="absolute inset-0 w-2 h-2 bg-success/50 rounded-full animate-ping animation-delay-200" />
              </div>
              <span className="text-xs font-medium text-success">
                Active
              </span>
            </div>
            <div className="w-px h-4 bg-border/30" />
            <span className="text-xs font-medium text-muted-foreground">
              {network}
            </span>
          </div>
          
          {address && (
            <div className="pt-3 border-t border-border/20">
              <button
                className="group flex items-center gap-2 mx-auto px-3 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                onClick={() => navigator.clipboard.writeText(address)}
                aria-label="Copy wallet address"
              >
                <p className="text-xs text-muted-foreground font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <svg className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
