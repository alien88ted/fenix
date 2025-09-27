'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useWalletData } from '@/hooks/useWalletData';

export default function Dashboard() {
  const router = useRouter();
  const { ready, authenticated, user, exportWallet } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  
  // Use real wallet data from database
  const {
    wallets: dbWallets,
    transactions,
    isLoading: isLoadingWallets,
    getPrimaryWallet,
    getTotalBalance,
  } = useWalletData();
  
  const [activeWallet, setActiveWallet] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedKey, setExportedKey] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (dbWallets.length > 0) {
      const primaryWallet = getPrimaryWallet();
      setActiveWallet(primaryWallet || dbWallets[0]);
    }
  }, [dbWallets, getPrimaryWallet]);

  const handleExportWallet = async () => {
    if (!activeWallet) return;
    
    setIsExporting(true);
    try {
      // For embedded wallets, use Privy's export functionality
      if (activeWallet.type === 'EMBEDDED') {
        await exportWallet();
        // Export flow handled by Privy UI
      } else {
        alert('Key export is only available for embedded wallets');
      }
    } catch (error) {
      alert('Failed to export wallet. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-primary rounded-full loading-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/fenix-logo.png" alt="Fenix" width={40} height={40} className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Fenix Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email?.address || 'Connected'}
            </span>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 space-y-6">
        {/* Wallet Overview */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeWallet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">
                    {activeWallet.walletClient === 'privy' ? 'Embedded Wallet' : 'External Wallet'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chain:</span>
                  <span className="text-sm font-medium">Ethereum</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span className="text-lg font-bold">{activeWallet?.balances?.USDT || getTotalBalance('USDT')} USDT</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Export */}
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Export Private Key Section */}
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>⚠️ Export Private Key</AlertTitle>
                    <AlertDescription>
                      Exporting your private key gives you full control of your wallet. 
                      Keep it secure and never share it with anyone.
                    </AlertDescription>
                  </Alert>

                  {activeWallet?.walletClient === 'privy' && (
                    <div className="space-y-4">
                      {!exportedKey ? (
                        <Button 
                          onClick={handleExportWallet}
                          disabled={isExporting}
                          variant="destructive"
                          className="w-full"
                        >
                          {isExporting ? 'Exporting...' : 'Export Private Key'}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-xs text-destructive font-bold mb-2">
                              PRIVATE KEY (KEEP SECURE!)
                            </p>
                            <code className="text-xs break-all">{exportedKey}</code>
                          </div>
                          <Button 
                            onClick={() => copyToClipboard(exportedKey)}
                            variant="outline"
                            className="w-full"
                          >
                            Copy to Clipboard
                          </Button>
                          <Button 
                            onClick={() => setExportedKey(null)}
                            variant="ghost"
                            className="w-full"
                          >
                            Hide Key
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeWallet?.walletClient !== 'privy' && (
                    <Alert>
                      <AlertDescription>
                        Key export is only available for embedded wallets. 
                        External wallets are managed by their respective providers.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Additional Security Features */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Security Features</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">End-to-end encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Secure key storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Multi-factor authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Non-custodial architecture</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No transactions yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{tx.createdAt}</p>
                        </div>
                        <span className="text-sm font-bold">{tx.amount} USDT</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Network Settings</h3>
                  <Alert>
                    <AlertDescription>
                      Currently connected to Ethereum Mainnet. 
                      Support for XPL/Plasma Network coming soon.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Token Support</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">USDT</span>
                      <span className="text-sm text-green-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">XPL (Plasma)</span>
                      <span className="text-sm text-yellow-500">Coming Soon</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Advanced</h3>
                  <Button variant="outline" className="w-full">
                    Manage Connected Apps
                  </Button>
                  <Button variant="outline" className="w-full">
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
