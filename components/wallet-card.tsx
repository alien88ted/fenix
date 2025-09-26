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
      "modern-card bg-card border border-border/30 transition-all duration-300",
      "hover:border-border/50 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Balance
            </p>
            <div className={cn(
              "text-5xl font-bold text-foreground tracking-tight leading-none transition-all duration-300",
              isAnimating && "scale-105"
            )}>
              ${balance}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-success rounded-full" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-success rounded-full animate-ping" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              USDT • {network}
            </span>
          </div>
          
          {address && (
            <div className="pt-2 border-t border-border/20">
              <p className="text-xs text-muted-foreground/60 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
