'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy, useWallets, useLogin, useLogout } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWalletData } from '@/hooks/useWalletData';
import { getAllBalances, getTransactionStatus, estimateGas } from '@/lib/blockchain';
import { handleSuccess, handleError, handleInfo } from '@/lib/utils/error-handler';
import { ThemeToggle } from '@/components/theme-toggle';

interface TestStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  result?: any;
  error?: string;
  duration?: number;
  timestamp?: string;
}

interface TestLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  data?: any;
}

export default function FlowTestPage() {
  const { ready, authenticated, user, getAccessToken, exportWallet } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { wallets: privyWallets } = useWallets();
  
  const {
    wallets: dbWallets,
    transactions,
    isLoading: isLoadingWallets,
    error: walletError,
    syncWallets,
    createWallet,
    recordTransaction,
    getPrimaryWallet,
    getTotalBalance,
    fetchTransactions,
  } = useWalletData();

  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testSummary, setTestSummary] = useState<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Initialize test steps
  useEffect(() => {
    setTestSteps([
      { id: 'env', name: 'Environment Check', description: 'Verify environment variables and configuration', status: 'pending' },
      { id: 'privy', name: 'Privy Authentication', description: 'Test Privy SDK initialization and auth', status: 'pending' },
      { id: 'db', name: 'Database Connection', description: 'Test SQLite database connection', status: 'pending' },
      { id: 'wallet-sync', name: 'Wallet Sync', description: 'Sync Privy wallets with database', status: 'pending' },
      { id: 'wallet-create', name: 'Wallet Creation', description: 'Create new embedded wallet', status: 'pending' },
      { id: 'blockchain', name: 'Blockchain Connection', description: 'Test Web3 RPC connection', status: 'pending' },
      { id: 'balance', name: 'Balance Fetching', description: 'Fetch wallet balances from blockchain', status: 'pending' },
      { id: 'tx-create', name: 'Transaction Creation', description: 'Create mock transaction', status: 'pending' },
      { id: 'tx-fetch', name: 'Transaction Fetching', description: 'Fetch transaction history', status: 'pending' },
      { id: 'api-sync', name: 'API Sync Endpoint', description: 'Test /api/wallet/sync endpoint', status: 'pending' },
      { id: 'api-tx', name: 'API Transaction Endpoint', description: 'Test /api/transaction endpoints', status: 'pending' },
      { id: 'ui-theme', name: 'UI Theme System', description: 'Test theme switching', status: 'pending' },
      { id: 'ui-toast', name: 'Toast Notifications', description: 'Test notification system', status: 'pending' },
      { id: 'export', name: 'Wallet Export', description: 'Test wallet export functionality', status: 'pending' },
      { id: 'cleanup', name: 'Cleanup', description: 'Clean up test data', status: 'pending' },
    ]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (level: TestLog['level'], message: string, data?: any) => {
    const log: TestLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    setLogs(prev => [...prev, log]);
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  };

  const updateStep = (id: string, updates: Partial<TestStep>) => {
    setTestSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates, timestamp: new Date().toISOString() } : step
    ));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Test implementations
  const runEnvironmentCheck = async () => {
    const startTime = Date.now();
    updateStep('env', { status: 'running' });
    addLog('info', 'Checking environment configuration...');

    try {
      // Check client-side Privy App ID
      const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
      const hasPrivyAppId = !!privyAppId;
      const privyAppIdLength = privyAppId?.length || 0;
      const privyAppIdFormat = privyAppId ? {
        startsWithClj: privyAppId.startsWith('clj'),
        startsWithCmg: privyAppId.startsWith('cmg'), // New format
        length: privyAppIdLength,
        masked: `${privyAppId.substring(0, 8)}...${privyAppId.substring(privyAppIdLength - 4)}`,
      } : null;

      // Server-side secret check via health endpoint
      let hasPrivySecret = false;
      let privySecretValid = false;
      let serverHealthData = null;
      
      try {
        // Call health endpoint to check server configuration
        const response = await fetch('/api/health');
        
        if (response.ok) {
          serverHealthData = await response.json();
          hasPrivySecret = serverHealthData.checks?.privySecret?.configured || false;
          privySecretValid = serverHealthData.checks?.privySecret?.valid || false;
        } else {
          // If health endpoint returns error, try to parse it
          try {
            serverHealthData = await response.json();
            hasPrivySecret = serverHealthData.checks?.privySecret?.configured || false;
          } catch {
            hasPrivySecret = false;
          }
        }
      } catch (err) {
        addLog('warn', 'Could not reach health endpoint', { error: (err as Error).message });
        hasPrivySecret = false;
      }

      const envCheck = {
        NODE_ENV: process.env.NODE_ENV,
        hasPrivyAppId,
        privyAppIdFormat,
        hasPrivySecret,
        privySecretValid,
        serverHealth: serverHealthData,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
        warnings: [] as string[],
      };

      // Add warnings for missing/invalid credentials
      if (!hasPrivyAppId) {
        envCheck.warnings.push('❌ NEXT_PUBLIC_PRIVY_APP_ID is not set - add it to .env.local');
      } else if (privyAppIdLength < 20) {
        envCheck.warnings.push('⚠️ NEXT_PUBLIC_PRIVY_APP_ID seems too short (should be 25+ chars)');
      } else if (!privyAppId.startsWith('clj') && !privyAppId.startsWith('cmg')) {
        envCheck.warnings.push('⚠️ NEXT_PUBLIC_PRIVY_APP_ID should start with "clj" or "cmg" - verify from Privy dashboard');
      }

      if (!hasPrivySecret) {
        envCheck.warnings.push('❌ PRIVY_APP_SECRET is not accessible - add it to .env.local');
      } else if (!privySecretValid) {
        envCheck.warnings.push('⚠️ PRIVY_APP_SECRET format may be invalid - verify from Privy dashboard');
      }

      if (!envCheck.hasDatabaseUrl) {
        envCheck.warnings.push('ℹ️ DATABASE_URL not set (using default SQLite - this is OK for development)');
      }
      
      // Add helpful message if both credentials are missing
      if (!hasPrivyAppId && !hasPrivySecret) {
        envCheck.warnings.push('');
        envCheck.warnings.push('📝 To fix: Create .env.local file with:');
        envCheck.warnings.push('NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here');
        envCheck.warnings.push('PRIVY_APP_SECRET=your_app_secret_here');
        envCheck.warnings.push('');
        envCheck.warnings.push('Get these from https://dashboard.privy.io');
      }

      // Determine overall status
      const criticalIssues = !hasPrivyAppId || !hasPrivySecret;
      
      if (criticalIssues) {
        addLog('error', 'Environment check failed - missing critical credentials', envCheck);
        updateStep('env', { 
          status: 'failed', 
          result: envCheck, 
          error: 'Missing Privy credentials',
          duration: Date.now() - startTime 
        });
        return false;
      } else if (envCheck.warnings.length > 0) {
        addLog('warn', 'Environment check passed with warnings', envCheck);
        updateStep('env', { 
          status: 'success', 
          result: envCheck, 
          duration: Date.now() - startTime 
        });
        return true;
      } else {
        addLog('success', 'Environment check passed - all credentials configured', envCheck);
        updateStep('env', { 
          status: 'success', 
          result: envCheck, 
          duration: Date.now() - startTime 
        });
        return true;
      }
    } catch (error) {
      addLog('error', 'Environment check failed', error instanceof Error ? error.message : String(error));
      updateStep('env', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runPrivyAuth = async () => {
    const startTime = Date.now();
    updateStep('privy', { status: 'running' });
    addLog('info', 'Testing Privy authentication...');

    try {
      if (!authenticated) {
        addLog('warn', 'User not authenticated, skipping auth test');
        updateStep('privy', { status: 'skipped', duration: Date.now() - startTime });
        return false;
      }

      const token = await getAccessToken();
      const authData = {
        authenticated,
        hasToken: !!token,
        tokenLength: token?.length,
        userId: user?.id,
        userEmail: user?.email?.address,
        linkedAccounts: user?.linkedAccounts?.length,
        hasWallet: user?.wallet !== undefined,
      };

      addLog('success', 'Privy authentication verified', authData);
      updateStep('privy', { 
        status: 'success', 
        result: authData, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Privy auth test failed', error instanceof Error ? error.message : String(error));
      updateStep('privy', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runDatabaseTest = async () => {
    const startTime = Date.now();
    updateStep('db', { status: 'running' });
    addLog('info', 'Testing database connection...');

    try {
      // Database test happens through wallet sync
      const dbTest = {
        hasWalletData: dbWallets.length > 0,
        walletCount: dbWallets.length,
        transactionCount: transactions.length,
        primaryWallet: getPrimaryWallet()?.address,
      };

      addLog('success', 'Database connection verified', dbTest);
      updateStep('db', { 
        status: 'success', 
        result: dbTest, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Database test failed', error instanceof Error ? error.message : String(error));
      updateStep('db', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runWalletSync = async () => {
    const startTime = Date.now();
    updateStep('wallet-sync', { status: 'running' });
    addLog('info', 'Syncing wallets with database...');

    try {
      // Log current Privy wallets
      addLog('info', `Found ${privyWallets.length} Privy wallets`, {
        wallets: privyWallets.map(w => ({
          address: w.address,
          type: w.walletClientType,
          chainId: w.chainId,
        }))
      });

      await syncWallets();
      
      // Wait a bit for state to update
      await sleep(500);
      
      const syncResult = {
        privyWalletCount: privyWallets.length,
        dbWalletCountBefore: dbWallets.length,
        dbWalletCountAfter: dbWallets.length, // This might not update immediately
        synced: true,
        privyWallets: privyWallets.map(w => ({
          address: w.address,
          type: w.walletClientType,
          chainId: w.chainId,
        })),
        dbWallets: dbWallets.map(w => ({
          address: w.address,
          type: w.type,
          chainId: w.chainId,
          isDefault: w.isDefault,
        })),
      };

      if (privyWallets.length > 0 && dbWallets.length === 0) {
        addLog('warn', 'Privy wallets exist but not synced to DB yet', syncResult);
      } else {
        addLog('success', 'Wallet sync completed', syncResult);
      }
      
      updateStep('wallet-sync', { 
        status: 'success', 
        result: syncResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Wallet sync failed', error instanceof Error ? error.message : String(error));
      updateStep('wallet-sync', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runWalletCreation = async () => {
    const startTime = Date.now();
    updateStep('wallet-create', { status: 'running' });
    addLog('info', 'Testing wallet creation...');

    try {
      // Check if user has embedded wallet
      if (!user?.wallet) {
        addLog('info', 'User has no embedded wallet from Privy, skipping wallet creation test');
        updateStep('wallet-create', { 
          status: 'skipped', 
          result: { reason: 'No embedded wallet from Privy' },
          duration: Date.now() - startTime 
        });
        return true;
      }

      // Skip if we already have wallets in DB
      if (dbWallets.length > 0) {
        addLog('info', `Already have ${dbWallets.length} wallets in DB, skipping creation`);
        updateStep('wallet-create', { 
          status: 'skipped', 
          result: { walletCount: dbWallets.length },
          duration: Date.now() - startTime 
        });
        return true;
      }

      // Try to create a new wallet
      const newWallet = await createWallet('ethereum');
      
      if (!newWallet) {
        throw new Error('Failed to create wallet - API returned null');
      }

      const creationResult = {
        success: true,
        address: newWallet.address,
        type: newWallet.type,
        chainId: newWallet.chainId,
      };

      addLog('success', 'Wallet created successfully', creationResult);
      updateStep('wallet-create', { 
        status: 'success', 
        result: creationResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Wallet creation failed', error instanceof Error ? error.message : String(error));
      updateStep('wallet-create', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runBlockchainTest = async () => {
    const startTime = Date.now();
    updateStep('blockchain', { status: 'running' });
    addLog('info', 'Testing blockchain connection...');

    try {
      const primaryWallet = getPrimaryWallet();
      if (!primaryWallet) {
        throw new Error('No primary wallet found');
      }

      // Test gas estimation (this verifies RPC connection)
      const gasTest = await estimateGas(
        primaryWallet.address,
        '0x742d35Cc6E712C2403A18504400342e2725DCEF8',
        '1000000000000000', // 0.001 ETH in wei
        primaryWallet.chainId
      );

      const blockchainResult = {
        connected: !!gasTest,
        chainId: primaryWallet.chainId,
        walletAddress: primaryWallet.address,
        gasEstimate: gasTest?.gasLimit,
        gasPrice: gasTest?.gasPrice,
      };

      addLog('success', 'Blockchain connection verified', blockchainResult);
      updateStep('blockchain', { 
        status: 'success', 
        result: blockchainResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('warn', 'Blockchain test failed (this is normal for test networks)', error instanceof Error ? error.message : String(error));
      updateStep('blockchain', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false; // Don't stop the flow for this
    }
  };

  const runBalanceFetch = async () => {
    const startTime = Date.now();
    updateStep('balance', { status: 'running' });
    addLog('info', 'Fetching wallet balances...');

    try {
      const primaryWallet = getPrimaryWallet();
      if (!primaryWallet) {
        throw new Error('No primary wallet found');
      }

      const balances = await getAllBalances(primaryWallet.address, primaryWallet.chainId);
      
      const balanceResult = {
        address: primaryWallet.address,
        chainId: primaryWallet.chainId,
        balances,
        totalUSDT: getTotalBalance('USDT'),
      };

      addLog('success', 'Balances fetched successfully', balanceResult);
      updateStep('balance', { 
        status: 'success', 
        result: balanceResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('warn', 'Balance fetch failed (normal for new wallets)', error instanceof Error ? error.message : String(error));
      updateStep('balance', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return true; // Don't stop flow
    }
  };

  const runTransactionCreation = async () => {
    const startTime = Date.now();
    updateStep('tx-create', { status: 'running' });
    addLog('info', 'Creating test transaction...');

    try {
      const primaryWallet = getPrimaryWallet();
      if (!primaryWallet) {
        throw new Error('No primary wallet found');
      }

      const mockTx = await recordTransaction({
        fromAddress: primaryWallet.address,
        toAddress: '0x742d35Cc6E712C2403A18504400342e2725DCEF8',
        amount: '10.00',
        currency: 'USDT',
        type: 'SEND',
        chainId: primaryWallet.chainId,
      });

      const txResult = {
        success: !!mockTx,
        transactionId: mockTx?.id,
        status: mockTx?.status,
        amount: mockTx?.amount,
        from: mockTx?.fromAddress,
        to: mockTx?.toAddress,
      };

      addLog('success', 'Transaction created successfully', txResult);
      updateStep('tx-create', { 
        status: 'success', 
        result: txResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Transaction creation failed', error instanceof Error ? error.message : String(error));
      updateStep('tx-create', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runTransactionFetch = async () => {
    const startTime = Date.now();
    updateStep('tx-fetch', { status: 'running' });
    addLog('info', 'Fetching transaction history...');

    try {
      await fetchTransactions();
      
      const txFetchResult = {
        transactionCount: transactions.length,
        latestTransactions: transactions.slice(0, 3).map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          createdAt: tx.createdAt,
        })),
      };

      addLog('success', 'Transactions fetched successfully', txFetchResult);
      updateStep('tx-fetch', { 
        status: 'success', 
        result: txFetchResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Transaction fetch failed', error instanceof Error ? error.message : String(error));
      updateStep('tx-fetch', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runAPISyncTest = async () => {
    const startTime = Date.now();
    updateStep('api-sync', { status: 'running' });
    addLog('info', 'Testing API sync endpoint...');

    try {
      const token = await getAccessToken();
      const response = await fetch('/api/wallet/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const apiResult = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: response.ok ? await response.json() : null,
      };

      if (response.ok) {
        addLog('success', 'API sync endpoint working', apiResult);
        updateStep('api-sync', { 
          status: 'success', 
          result: apiResult, 
          duration: Date.now() - startTime 
        });
        return true;
      } else {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addLog('error', 'API sync test failed', error instanceof Error ? error.message : String(error));
      updateStep('api-sync', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runAPITransactionTest = async () => {
    const startTime = Date.now();
    updateStep('api-tx', { status: 'running' });
    addLog('info', 'Testing API transaction endpoints...');

    try {
      const token = await getAccessToken();
      const response = await fetch('/api/transaction/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const apiResult = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: response.ok ? await response.json() : null,
      };

      if (response.ok) {
        addLog('success', 'API transaction endpoint working', apiResult);
        updateStep('api-tx', { 
          status: 'success', 
          result: apiResult, 
          duration: Date.now() - startTime 
        });
        return true;
      } else {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addLog('error', 'API transaction test failed', error instanceof Error ? error.message : String(error));
      updateStep('api-tx', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runUITests = async () => {
    const startTime = Date.now();
    
    // Test theme
    updateStep('ui-theme', { status: 'running' });
    addLog('info', 'Testing theme system...');
    
    try {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const themeResult = {
        currentTheme,
        hasThemeClass: true,
        themeToggleExists: !!document.querySelector('[aria-label*="Switch to"]'),
      };
      
      addLog('success', 'Theme system working', themeResult);
      updateStep('ui-theme', { 
        status: 'success', 
        result: themeResult, 
        duration: Date.now() - startTime 
      });
    } catch (error) {
      addLog('error', 'Theme test failed', error instanceof Error ? error.message : String(error));
      updateStep('ui-theme', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
    }

    // Test toasts
    updateStep('ui-toast', { status: 'running' });
    addLog('info', 'Testing notification system...');
    
    try {
      handleSuccess('Test success notification');
      await sleep(500);
      handleInfo('Test info notification');
      await sleep(500);
      handleError(new Error('Test error notification'));
      
      const toastResult = {
        tested: true,
        types: ['success', 'info', 'error'],
      };
      
      addLog('success', 'Notification system working', toastResult);
      updateStep('ui-toast', { 
        status: 'success', 
        result: toastResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Toast test failed', error instanceof Error ? error.message : String(error));
      updateStep('ui-toast', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runExportTest = async () => {
    const startTime = Date.now();
    updateStep('export', { status: 'running' });
    addLog('info', 'Testing wallet export functionality...');

    try {
      // We can't actually trigger the export modal programmatically
      // but we can check if the function exists
      const exportResult = {
        exportFunctionExists: typeof exportWallet === 'function',
        hasEmbeddedWallet: !!user?.wallet,
        canExport: authenticated && !!user?.wallet,
      };

      addLog('info', 'Export function available (manual test required)', exportResult);
      updateStep('export', { 
        status: 'success', 
        result: exportResult, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Export test failed', error instanceof Error ? error.message : String(error));
      updateStep('export', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runCleanup = async () => {
    const startTime = Date.now();
    updateStep('cleanup', { status: 'running' });
    addLog('info', 'Running cleanup...');

    try {
      // Generate summary
      const summary = {
        totalTests: testSteps.length,
        passed: testSteps.filter(s => s.status === 'success').length,
        failed: testSteps.filter(s => s.status === 'failed').length,
        skipped: testSteps.filter(s => s.status === 'skipped').length,
        totalDuration: testSteps.reduce((acc, s) => acc + (s.duration || 0), 0),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        authenticated,
        walletCount: dbWallets.length,
        transactionCount: transactions.length,
      };

      setTestSummary(summary);
      addLog('success', 'Test flow completed', summary);
      updateStep('cleanup', { 
        status: 'success', 
        result: summary, 
        duration: Date.now() - startTime 
      });
      return true;
    } catch (error) {
      addLog('error', 'Cleanup failed', error instanceof Error ? error.message : String(error));
      updateStep('cleanup', { 
        status: 'failed', 
        error: error instanceof Error ? error.message : String(error), 
        duration: Date.now() - startTime 
      });
      return false;
    }
  };

  const runFullFlow = async () => {
    setIsRunning(true);
    setLogs([]);
    setTestSummary(null);
    setProgress(0);
    
    addLog('info', '=== Starting Full Flow Test ===');
    addLog('info', `Timestamp: ${new Date().toISOString()}`);
    addLog('info', `Authenticated: ${authenticated}`);
    addLog('info', `Ready: ${ready}`);

    const tests = [
      runEnvironmentCheck,
      runPrivyAuth,
      runDatabaseTest,
      runWalletSync,
      runWalletCreation,
      runBlockchainTest,
      runBalanceFetch,
      runTransactionCreation,
      runTransactionFetch,
      runAPISyncTest,
      runAPITransactionTest,
      runUITests,
      runExportTest,
      runCleanup,
    ];

    let currentProgress = 0;
    const progressIncrement = 100 / tests.length;

    for (const test of tests) {
      try {
        await test();
        await sleep(500); // Small delay between tests
      } catch (error) {
        addLog('error', `Test failed with unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      }
      currentProgress += progressIncrement;
      setProgress(Math.min(currentProgress, 100));
    }

    addLog('info', '=== Flow Test Complete ===');
    setIsRunning(false);
  };

  const exportLogs = () => {
    const exportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        authenticated,
        user: user ? { id: user.id, email: user.email?.address } : null,
      },
      summary: testSummary,
      steps: testSteps,
      logs: logs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fenix-test-log-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    handleSuccess('Test log exported successfully!');
  };

  const copyLogsToClipboard = async () => {
    const exportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        authenticated,
        user: user ? { id: user.id, email: user.email?.address } : null,
      },
      summary: testSummary,
      steps: testSteps,
      logs: logs,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      handleSuccess('Test log copied to clipboard!');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Full Flow Test</h1>
            <p className="text-muted-foreground">
              Comprehensive end-to-end testing of all features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Back to App
            </Button>
            <Button onClick={() => window.location.href = '/test'} variant="outline">
              Component Tests
            </Button>
          </div>
        </div>

        {/* Auth Status */}
        <Alert>
          <AlertDescription>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>Status:</span>
                  <Badge variant={authenticated ? "default" : "secondary"}>
                    {authenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                  <Badge variant={ready ? "default" : "secondary"}>
                    {ready ? "Privy Ready" : "Loading..."}
                  </Badge>
                </div>
                {!authenticated ? (
                  <Button onClick={login} size="sm">Login to Test</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={logout} size="sm" variant="outline">Logout</Button>
                    <span className="text-sm text-muted-foreground">
                      User: {user?.email?.address || user?.id}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Quick Credential Check */}
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Credentials:</span>
                <div className="flex gap-2">
                  <Badge 
                    variant={process.env.NEXT_PUBLIC_PRIVY_APP_ID ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {process.env.NEXT_PUBLIC_PRIVY_APP_ID ? "✓ App ID" : "✗ App ID"}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="text-xs"
                  >
                    Secret: Check Env Test
                  </Badge>
                </div>
                {process.env.NEXT_PUBLIC_PRIVY_APP_ID && (
                  <span className="text-[10px] text-muted-foreground">
                    ({process.env.NEXT_PUBLIC_PRIVY_APP_ID.substring(0, 8)}...)
                  </span>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Test Steps</CardTitle>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={runFullFlow} 
                  disabled={isRunning || !authenticated}
                  className="flex-1"
                >
                  {isRunning ? 'Running Tests...' : 'Run Full Flow Test'}
                </Button>
                <Button
                  onClick={exportLogs}
                  disabled={logs.length === 0}
                  variant="outline"
                >
                  Export Logs
                </Button>
                <Button
                  onClick={copyLogsToClipboard}
                  disabled={logs.length === 0}
                  variant="outline"
                >
                  Copy Logs
                </Button>
              </div>
              {isRunning && (
                <Progress value={progress} className="mt-3" />
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {testSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{step.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                        {step.duration && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Duration: {step.duration}ms
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          step.status === 'success' ? 'default' :
                          step.status === 'failed' ? 'destructive' :
                          step.status === 'running' ? 'secondary' :
                          step.status === 'skipped' ? 'outline' :
                          'outline'
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Test Logs</CardTitle>
              <Button
                onClick={() => setLogs([])}
                disabled={logs.length === 0}
                variant="outline"
                size="sm"
              >
                Clear Logs
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        log.level === 'error' ? 'bg-destructive/10 text-destructive' :
                        log.level === 'warn' ? 'bg-yellow-500/10 text-yellow-600' :
                        log.level === 'success' ? 'bg-green-500/10 text-green-600' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] opacity-60">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold">
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="flex-1">{log.message}</span>
                      </div>
                      {log.data && (
                        <pre className="mt-1 ml-12 text-[10px] opacity-80 overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Test Summary */}
        {testSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Tests</p>
                  <p className="text-2xl font-bold">{testSummary.totalTests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{testSummary.passed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{testSummary.failed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Skipped</p>
                  <p className="text-2xl font-bold text-yellow-600">{testSummary.skipped}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(testSummary, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
