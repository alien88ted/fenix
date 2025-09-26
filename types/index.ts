// Wallet Types
export interface Wallet {
  id: string;
  address: string;
  type: 'EMBEDDED' | 'EXTERNAL' | 'IMPORTED';
  chainId: number;
  isDefault: boolean;
  label?: string;
  balance?: string;
  balances?: TokenBalances;
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenBalances {
  native: string;
  USDT: string;
  XPL: string;
  PLASMA: string;
  [key: string]: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  txHash?: string;
  chainId: number;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export enum TransactionType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  SWAP = 'SWAP',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  FEE = 'FEE',
  REWARD = 'REWARD'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMING = 'CONFIRMING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// User Types
export interface User {
  id: string;
  privyId: string;
  email?: string;
  name?: string;
  avatar?: string;
  phoneNumber?: string;
  wallets: Wallet[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface SendFormData {
  address: string;
  amount: string;
  memo?: string;
}

export interface ServiceFormData {
  type: string;
  amount: string;
  details: string;
}

// Chain Configuration
export interface ChainConfig {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Token Configuration
export interface TokenConfig {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoUrl?: string;
}
