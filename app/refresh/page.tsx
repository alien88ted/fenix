'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function RefreshPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  
  useEffect(() => {
    if (ready) {
      if (authenticated) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    }
  }, [ready, authenticated, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-primary rounded-full loading-shimmer"></div>
        </div>
        <p className="text-sm text-muted-foreground">Refreshing session...</p>
      </div>
    </div>
  );
}
