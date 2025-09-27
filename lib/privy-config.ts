// Privy configuration with enhanced security and XPL support

export const PRIVY_CONFIG = {
  // Embedded wallet configuration
  embeddedWallets: {
    createOnLogin: 'users-without-wallets' as const,
    requireUserPasswordOnCreate: true, // Enhanced security - require password
    showWalletUIs: true,
    // Custom configuration for XPL support
    defaultChain: 1, // Ethereum mainnet
    supportedChains: [1, 137], // Ethereum, Polygon
  },
  
  // Login methods configuration
  loginMethods: [
    'email',
    'sms',
    'google',
    'apple',
    'twitter',
    'discord',
    'github',
    'wallet',
  ],
  
  // Security configuration
  security: {
    // MFA settings
    mfa: {
      noPromptOnMfaRequired: false,
      methods: ['sms', 'totp'],
    },
    
    // Session configuration
    sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    refreshTokenMaxAge: 30 * 24 * 60 * 60, // 30 days
    
    // Key export settings
    allowWalletExport: true,
    requirePasswordForExport: true,
    exportCooldown: 60, // 60 seconds between exports
  },
  
  // Appearance configuration
  appearance: {
    theme: 'auto' as const,
    accentColor: '#EA580C',
    logo: '/fenix-logo.png',
    showWalletLoginFirst: false,
    walletList: [
      'metamask',
      'rainbow',
      'coinbase_wallet',
      'wallet_connect',
    ],
  },
  
  // External wallet configuration
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: 'all' as const,
    },
    metamask: {
      connectionOptions: 'all' as const,
    },
    rainbow: {
      connectionOptions: 'all' as const,
    },
    walletConnect: {
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    },
  },
  
  // Advanced features
  advanced: {
    // Enable smart wallet features
    smartWallets: {
      enabled: true,
      sponsoredTransactions: false, // Can enable for gasless transactions
    },
    
    // Custom token support
    customTokens: [
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        decimals: 6,
        chainId: 1,
      },
      // XPL token configuration - update with actual contract address
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'XPL',
        decimals: 18,
        chainId: 1,
      },
    ],
    
    // Fiat on-ramp configuration
    fiatOnRamp: {
      enabled: true,
      providers: ['moonpay', 'ramp'],
      defaultCurrency: 'USD',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
    },
  },
  
  // Compliance and legal
  compliance: {
    termsAndConditionsUrl: '/terms',
    privacyPolicyUrl: '/privacy',
    requireAcceptance: true,
    ageVerification: {
      enabled: true,
      minimumAge: 18,
    },
    geoBlocking: {
      enabled: false,
      blockedCountries: [], // Add country codes if needed
    },
  },
};

// Helper function to get Privy configuration
export function getPrivyConfig() {
  // Add runtime validations
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    // Privy App ID not configured
  }
  
  return {
    ...PRIVY_CONFIG,
    walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  };
}

// Security utilities for wallet operations
export const WalletSecurity = {
  // Validate wallet address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
  
  // Sanitize transaction data
  sanitizeTransaction: (tx: any) => {
    return {
      to: tx.to?.toLowerCase(),
      from: tx.from?.toLowerCase(),
      value: tx.value?.toString(),
      data: tx.data,
      chainId: parseInt(tx.chainId),
    };
  },
  
  // Check if address is contract
  isContract: async (address: string, provider: any): Promise<boolean> => {
    try {
      const code = await provider.getCode(address);
      return code !== '0x';
    } catch {
      return false;
    }
  },
};
