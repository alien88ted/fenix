'use client';

import { useEffect, useState } from 'react';
import { FenixLogo } from './fenix-logo';

export function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse delay-150" />
        </div>
        
        <div className="flex flex-col items-center space-y-8 p-8">
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl animate-pulse" />
            <FenixLogo 
              size={80} 
              className="relative z-10 animate-float logo-glow" 
              animate 
            />
          </div>
          
          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fenix Wallet
            </h2>
            <p className="text-sm text-muted-foreground">
              Loading your secure wallet{dots}
            </p>
          </div>
          
          {/* Loading bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary shimmer-effect" />
          </div>
        </div>
      </div>
    </div>
  );
}
