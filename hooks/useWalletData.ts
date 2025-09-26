import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getAllBalances } from '@/lib/blockchain';

export interface WalletData {
  address: string;
  type: 'EMBEDDED' | 'EXTERNAL' | 'IMPORTED';
  chainId: number;
  isDefault: boolean;
  label?: string;
  balance?: string;
  balances?: {
    native: string;
    USDT: string;
    XPL: string;
    PLASMA: string;
  };
}

export interface TransactionData {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency: string;
  type: string;
  status: string;
  txHash?: string;
  createdAt: string;
}

export function useWalletData() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { wallets: privyWallets } = useWallets();
  
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sync wallets with database
  const syncWallets = useCallback(async () => {
    if (!authenticated || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const accessToken = await getAccessToken();
      
      const response = await fetch('/api/wallet/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync wallets');
      }
      
      const data = await response.json();
      setWalletData(data.wallets);
      
      // Fetch real-time balances for each wallet
      const walletsWithBalances = await Promise.all(
        data.wallets.map(async (wallet: WalletData) => {
          const balances = await getAllBalances(wallet.address, wallet.chainId);
          return { ...wallet, balances };
        })
      );
      
      setWalletData(walletsWithBalances);
    } catch (err) {
      console.error('Error syncing wallets:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync wallets');
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, user, getAccessToken]);
  
  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!authenticated || !user) return;
    
    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch('/api/transaction/list', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [authenticated, user, getAccessToken]);
  
  // Create new wallet
  const createWallet = useCallback(async (chainType: 'ethereum' | 'solana' = 'ethereum') => {
    if (!authenticated) return null;
    
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }
      
      const data = await response.json();
      
      // Refresh wallet list
      await syncWallets();
      
      return data.wallet;
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAccessToken, syncWallets]);
  
  // Record transaction
  const recordTransaction = useCallback(async (transactionData: {
    fromAddress: string;
    toAddress: string;
    amount: string;
    currency?: string;
    type: string;
    txHash?: string;
    chainId?: number;
  }) => {
    if (!authenticated) return null;
    
    try {
      const accessToken = await getAccessToken();
      
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record transaction');
      }
      
      const data = await response.json();
      
      // Refresh transactions
      await fetchTransactions();
      
      return data.transaction;
    } catch (err) {
      console.error('Error recording transaction:', err);
      return null;
    }
  }, [authenticated, getAccessToken, fetchTransactions]);
  
  // Get primary wallet
  const getPrimaryWallet = useCallback(() => {
    return walletData.find(w => w.isDefault) || walletData[0] || null;
  }, [walletData]);
  
  // Get total balance across all wallets
  const getTotalBalance = useCallback((currency: 'USDT' | 'XPL' | 'PLASMA' = 'USDT') => {
    return walletData.reduce((total, wallet) => {
      const balance = wallet.balances?.[currency] || '0';
      return total + parseFloat(balance);
    }, 0).toFixed(2);
  }, [walletData]);
  
  // Auto-sync on authentication
  useEffect(() => {
    if (ready && authenticated) {
      syncWallets();
      fetchTransactions();
    }
  }, [ready, authenticated, syncWallets, fetchTransactions]);
  
  // Refresh balances periodically
  useEffect(() => {
    if (!authenticated || walletData.length === 0) return;
    
    const interval = setInterval(async () => {
      const walletsWithBalances = await Promise.all(
        walletData.map(async (wallet) => {
          const balances = await getAllBalances(wallet.address, wallet.chainId);
          return { ...wallet, balances };
        })
      );
      setWalletData(walletsWithBalances);
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [authenticated, walletData]);
  
  return {
    wallets: walletData,
    transactions,
    isLoading,
    error,
    syncWallets,
    createWallet,
    recordTransaction,
    getPrimaryWallet,
    getTotalBalance,
    fetchTransactions,
  };
}
