'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [balance]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("modern-card bg-card border border-border/30", className)}>
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mx-auto bg-gradient-to-r from-muted to-muted/80" />
              <Skeleton className="h-10 sm:h-12 w-40 sm:w-48 mx-auto bg-gradient-to-r from-muted to-muted/80" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full bg-gradient-to-r from-muted to-muted/80" />
              <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted to-muted/80" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "modern-card relative",
      "bg-gradient-to-br from-card via-card/98 to-primary/[0.02]",
      "dark:from-card dark:via-card/95 dark:to-primary/[0.05]",
      "border border-border/40 dark:border-border/30",
      "transition-all duration-500 ease-out",
      "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
      "hover:scale-[1.02] hover:-translate-y-1",
      "transform-gpu will-change-transform",
      "before:absolute before:inset-0 before:rounded-2xl",
      "before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-accent/5",
      "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
      className
    )}>
      <CardContent className="p-5 sm:p-8 text-center relative overflow-hidden">
        {/* Premium animated background effects - simplified on mobile */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30 dark:opacity-15 sm:dark:opacity-20">
          <div className="absolute top-0 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl sm:blur-3xl animate-float-smooth" />
          <div className="absolute bottom-0 -right-8 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl sm:blur-3xl animate-float-smooth animation-delay-600" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-full blur-2xl sm:blur-3xl animate-pulse hidden sm:block" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] opacity-70 animate-slideInUp">
              Total Balance
            </p>
            <div className={cn(
              "relative inline-block",
              "transition-all duration-500 transform-gpu",
              isAnimating && "scale-105 sm:scale-110"
            )}>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none animate-slideInUp animation-delay-200">
                <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 dark:from-foreground dark:via-foreground/95 dark:to-foreground/85 bg-clip-text text-transparent">
                  ${balance}
                </span>
              </div>
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-lg sm:blur-xl animate-pulse" />
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground/60 font-medium animate-slideInUp animation-delay-400">
              ≈ {balance} USDT
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1.5 sm:py-2">
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-success to-success/80 rounded-full shadow-lg shadow-success/50" />
                <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-success rounded-full animate-ping" />
                <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-success/50 rounded-full animate-ping animation-delay-200" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-success">
                Active
              </span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-transparent via-border/50 to-transparent" />
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">
              {network}
            </span>
          </div>
          
          {address && (
            <div className="pt-2.5 sm:pt-3 border-t border-border/20">
              <button
                className={cn(
                  "group relative flex items-center gap-1.5 sm:gap-2 mx-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full",
                  "bg-gradient-to-br from-muted/20 to-muted/30",
                  "hover:from-muted/30 hover:to-muted/40",
                  "border border-border/20 hover:border-primary/30",
                  "transition-all duration-300 touch-manipulation",
                  "hover:scale-105 hover:shadow-lg hover:shadow-primary/10",
                  "active:scale-95",
                  copied && "ring-2 ring-success/50 bg-success/10"
                )}
                onClick={handleCopy}
                aria-label="Copy wallet address"
              >
                <p className="text-[11px] sm:text-xs text-muted-foreground font-mono font-medium">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                {copied ? (
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}