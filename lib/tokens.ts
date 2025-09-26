// Token configurations for Fenix Wallet
// Supports USDT and XPL (Plasma) tokens

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId: number;
  logo?: string;
  coingeckoId?: string;
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum mainnet USDT
    chainId: 1,
    logo: '/tokens/usdt.png',
    coingeckoId: 'tether',
  },
  {
    symbol: 'XPL',
    name: 'Plasma Token',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder - update with actual XPL contract
    chainId: 1,
    logo: '/tokens/xpl.png',
    coingeckoId: 'plasma',
  },
];

export const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    explorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  // Add Plasma/XPL network configuration when available
];

// Helper functions for token operations
export function getTokenBySymbol(symbol: string): Token | undefined {
  return SUPPORTED_TOKENS.find(token => token.symbol === symbol);
}

export function getTokenByAddress(address: string): Token | undefined {
  return SUPPORTED_TOKENS.find(
    token => token.address.toLowerCase() === address.toLowerCase()
  );
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  if (trimmedRemainder) {
    return `${quotient}.${trimmedRemainder}`;
  }
  return quotient.toString();
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}
