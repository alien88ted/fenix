'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets, useLogin, useLogout } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FenixLogo } from '@/components/fenix-logo';
import { WalletCard } from '@/components/wallet-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { useWalletData } from '@/hooks/useWalletData';
import { getAllBalances, getTransactionStatus } from '@/lib/blockchain';
import { handleSuccess, handleError, handleInfo, handleWarning } from '@/lib/utils/error-handler';
import { prisma } from '@/lib/prisma';

export default function TestPage() {
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
  
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTab, setActiveTab] = useState('auth');

  // Test Functions
  const testPrivyAuth = async () => {
    try {
      handleInfo('Testing Privy Authentication...');
      const token = await getAccessToken();
      setTestResults(prev => ({
        ...prev,
        privyAuth: {
          success: true,
          authenticated,
          userId: user?.id,
          hasToken: !!token,
          tokenLength: token?.length,
        }
      }));
      handleSuccess('Privy Auth test passed!');
    } catch (error) {
      handleError(error);
      setTestResults(prev => ({
        ...prev,
        privyAuth: { success: false, error: error instanceof Error ? error.message : String(error) }
      }));
    }
  };

  const testWalletCreation = async () => {
    try {
      handleInfo('Testing wallet creation...');
      const wallet = await createWallet('ethereum');
      setTestResults(prev => ({
        ...prev,
        walletCreation: {
          success: !!wallet,
          walletAddress: wallet?.address,
          walletType: wallet?.type,
        }
      }));
      handleSuccess('Wallet creation test passed!');
    } catch (error) {
      handleError(error);
      setTestResults(prev => ({
        ...prev,
        walletCreation: { success: false, error: error instanceof Error ? error.message : String(error) }
      }));
    }
  };

  const testBlockchainConnection = async () => {
    try {
      handleInfo('Testing blockchain connection...');
      const primaryWallet = getPrimaryWallet();
      if (!primaryWallet) {
        throw new Error('No primary wallet found');
      }
      
      const balances = await getAllBalances(primaryWallet.address, primaryWallet.chainId);
      setTestResults(prev => ({
        ...prev,
        blockchain: {
          success: true,
          address: primaryWallet.address,
          balances,
          chainId: primaryWallet.chainId,
        }
      }));
      handleSuccess('Blockchain connection test passed!');
    } catch (error) {
      handleError(error);
      setTestResults(prev => ({
        ...prev,
        blockchain: { success: false, error: error instanceof Error ? error.message : String(error) }
      }));
    }
  };

  const testDatabaseConnection = async () => {
    try {
      handleInfo('Testing database connection...');
      
      // Try to sync wallets (this will test database connection)
      await syncWallets();
      
      setTestResults(prev => ({
        ...prev,
        database: {
          success: true,
          walletsInDB: dbWallets.length,
          transactionsInDB: transactions.length,
        }
      }));
      handleSuccess('Database connection test passed!');
    } catch (error) {
      handleError(error);
      setTestResults(prev => ({
        ...prev,
        database: { success: false, error: error instanceof Error ? error.message : String(error) }
      }));
    }
  };

  const testTransactionRecording = async () => {
    try {
      handleInfo('Testing transaction recording...');
      
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
      
      setTestResults(prev => ({
        ...prev,
        transaction: {
          success: !!mockTx,
          transactionId: mockTx?.id,
          status: mockTx?.status,
        }
      }));
      handleSuccess('Transaction recording test passed!');
    } catch (error) {
      handleError(error);
      setTestResults(prev => ({
        ...prev,
        transaction: { success: false, error: error instanceof Error ? error.message : String(error) }
      }));
    }
  };

  const testToastNotifications = () => {
    handleSuccess('Success notification test!');
    setTimeout(() => handleInfo('Info notification test!'), 1000);
    setTimeout(() => handleWarning('Warning notification test!'), 2000);
    setTimeout(() => handleError(new Error('Error notification test!')), 3000);
    
    setTestResults(prev => ({
      ...prev,
      notifications: { success: true, tested: 4 }
    }));
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});
    
    if (authenticated) {
      await testPrivyAuth();
      await new Promise(r => setTimeout(r, 1000));
      
      await testDatabaseConnection();
      await new Promise(r => setTimeout(r, 1000));
      
      await testBlockchainConnection();
      await new Promise(r => setTimeout(r, 1000));
      
      await testTransactionRecording();
      await new Promise(r => setTimeout(r, 1000));
      
      testToastNotifications();
    } else {
      handleWarning('Please login first to run tests');
    }
    
    setIsRunningTests(false);
  };

  const TestResult = ({ name, result }: { name: string; result: any }) => {
    if (!result) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{name}</CardTitle>
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "PASSED" : "FAILED"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FenixLogo size={40} animate />
            <div>
              <h1 className="text-2xl font-bold">Fenix Wallet Test Suite</h1>
              <p className="text-sm text-muted-foreground">
                Test all integrated features and APIs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Back to App
            </Button>
          </div>
        </div>

        {/* Auth Status */}
        <Alert>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Authentication Status: {' '}
                <Badge variant={authenticated ? "default" : "secondary"}>
                  {authenticated ? "Logged In" : "Not Logged In"}
                </Badge>
              </span>
              {!authenticated ? (
                <Button onClick={login} size="sm">Login</Button>
              ) : (
                <Button onClick={logout} size="sm" variant="outline">Logout</Button>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={runAllTests} 
                disabled={!authenticated || isRunningTests}
              >
                {isRunningTests ? "Running Tests..." : "Run All Tests"}
              </Button>
              <Button onClick={testPrivyAuth} variant="outline" disabled={!authenticated}>
                Test Auth
              </Button>
              <Button onClick={testDatabaseConnection} variant="outline" disabled={!authenticated}>
                Test Database
              </Button>
              <Button onClick={testBlockchainConnection} variant="outline" disabled={!authenticated}>
                Test Blockchain
              </Button>
              <Button onClick={testWalletCreation} variant="outline" disabled={!authenticated}>
                Test Wallet Creation
              </Button>
              <Button onClick={testTransactionRecording} variant="outline" disabled={!authenticated}>
                Test Transaction
              </Button>
              <Button onClick={testToastNotifications} variant="outline">
                Test Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="ui">UI Components</TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="space-y-4">
            <TestResult name="Privy Authentication" result={testResults.privyAuth} />
            {authenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>User Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallets" className="space-y-4">
            <TestResult name="Wallet Creation" result={testResults.walletCreation} />
            <TestResult name="Blockchain Connection" result={testResults.blockchain} />
            
            {dbWallets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Wallets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dbWallets.map((wallet, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded">
                      <p className="text-xs font-mono">{wallet.address}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">Chain {wallet.chainId}</Badge>
                        <Badge variant="outline">{wallet.type}</Badge>
                        {wallet.isDefault && <Badge>Default</Badge>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <TestResult name="Database Connection" result={testResults.database} />
            <TestResult name="Transaction Recording" result={testResults.transaction} />
            
            {transactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx, idx) => (
                      <div key={idx} className="text-xs p-2 bg-muted rounded">
                        <p>{tx.type}: {tx.amount} {tx.currency}</p>
                        <p className="text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <TestResult name="Toast Notifications" result={testResults.notifications} />
            
            <Card>
              <CardHeader>
                <CardTitle>Component Showcase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Wallet Card</p>
                  <WalletCard 
                    balance={getTotalBalance('USDT')}
                    address={getPrimaryWallet()?.address || '0x...'}
                    isLoading={isLoadingWallets}
                  />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Loading Skeleton</p>
                  <Skeleton className="h-12 w-full" />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Fenix Logo Variations</p>
                  <div className="flex gap-4">
                    <FenixLogo size={30} />
                    <FenixLogo size={40} animate />
                    <FenixLogo size={50} className="logo-glow" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Environment</p>
                <p className="text-muted-foreground">{process.env.NODE_ENV}</p>
              </div>
              <div>
                <p className="font-medium">Privy Ready</p>
                <p className="text-muted-foreground">{ready ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="font-medium">Privy Wallets</p>
                <p className="text-muted-foreground">{privyWallets.length}</p>
              </div>
              <div>
                <p className="font-medium">DB Wallets</p>
                <p className="text-muted-foreground">{dbWallets.length}</p>
              </div>
              <div>
                <p className="font-medium">Total Balance</p>
                <p className="text-muted-foreground">${getTotalBalance('USDT')} USDT</p>
              </div>
              <div>
                <p className="font-medium">Wallet Error</p>
                <p className="text-muted-foreground">{walletError || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
