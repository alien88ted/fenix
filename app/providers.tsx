'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { getPrivyConfig } from '@/lib/privy-config';

export default function Providers({ children }: PropsWithChildren) {
  const config = getPrivyConfig();
  
  // Check if Privy App ID is configured
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // If no App ID, show setup instructions
  if (!privyAppId || privyAppId === 'your-privy-app-id') {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Setup Required</h1>
              <p className="text-muted-foreground">Please configure your Privy App ID to continue</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Quick Setup:</h2>
              <ol className="space-y-3 text-sm">
                <li>1. Go to <a href="https://dashboard.privy.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dashboard.privy.io</a></li>
                <li>2. Create a new app or select existing one</li>
                <li>3. Copy your App ID (starts with 'cl...')</li>
                <li>4. Create a <code className="bg-muted px-2 py-1 rounded">.env.local</code> file in root directory</li>
                <li>5. Add: <code className="bg-muted px-2 py-1 rounded">NEXT_PUBLIC_PRIVY_APP_ID=your-app-id-here</code></li>
                <li>6. Restart the development server</li>
              </ol>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  See <code className="bg-muted px-2 py-1 rounded">SETUP.md</code> for detailed instructions
                </p>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProvider
        appId={privyAppId}
        config={{
        // CRITICAL: Create embedded wallets for ALL users automatically
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users' as const, // This ensures EVERY user gets an embedded wallet
          },
          showWalletUIs: true,
        },
        
        // Comprehensive login methods
        loginMethods: config.loginMethods as any,
        
        // Professional appearance
        appearance: {
          theme: config.appearance.theme as 'light' | 'dark',
          accentColor: config.appearance.accentColor as `#${string}`,
          logo: config.appearance.logo,
          showWalletLoginFirst: config.appearance.showWalletLoginFirst,
        },
        
        // Wallet configuration with XPL support
        walletConnectCloudProjectId: config.walletConnectCloudProjectId,
        
        // Enhanced security settings
        mfa: config.security.mfa,
        
        // External wallet support
        externalWallets: {
          coinbaseWallet: {},
          walletConnect: {
            enabled: !!config.externalWallets.walletConnect.projectId,
          },
        },
        
        // Legal compliance
        legal: {
          termsAndConditionsUrl: config.compliance.termsAndConditionsUrl,
          privacyPolicyUrl: config.compliance.privacyPolicyUrl,
        },
      }}
    >
      {children}
    </PrivyProvider>
    </ThemeProvider>
  );
}
