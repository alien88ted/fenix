'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PropsWithChildren } from 'react';
import { getPrivyConfig } from '@/lib/privy-config';

export default function Providers({ children }: PropsWithChildren) {
  const config = getPrivyConfig();
  
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Enhanced embedded wallets with security
        embeddedWallets: {
          ...config.embeddedWallets,
          requireUserPasswordOnCreate: true, // Enhanced security
        },
        
        // Comprehensive login methods
        loginMethods: config.loginMethods,
        
        // Professional appearance
        appearance: config.appearance,
        
        // Wallet configuration with XPL support
        walletConnectCloudProjectId: config.walletConnectCloudProjectId,
        
        // Enhanced security settings
        mfa: config.security.mfa,
        
        // External wallet support
        externalWallets: config.externalWallets,
        
        // Legal compliance
        legal: {
          termsAndConditionsUrl: config.compliance.termsAndConditionsUrl,
          privacyPolicyUrl: config.compliance.privacyPolicyUrl,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
