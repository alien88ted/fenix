import { createPublicClient, http, formatEther } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains';

// Chain configurations
export const SUPPORTED_CHAINS = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
};

// Token configurations for USDT and XPL
export const TOKEN_CONTRACTS = {
  USDT: {
    1: '0xdac17f958d2ee523a2206206994597c13d831ec7', // Ethereum Mainnet
    137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // Polygon
    42161: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // Arbitrum
    10: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // Optimism
    8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // Base
  },
  XPL: {
    1: '0x0000000000000000000000000000000000000000', // Placeholder - replace with actual XPL contract
    137: '0x0000000000000000000000000000000000000000', // Placeholder
  },
  PLASMA: {
    // Plasma Network token addresses
    1: '0x0000000000000000000000000000000000000000', // Placeholder
  }
};

// ERC20 ABI for balance queries
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Get public client for a specific chain
export function getPublicClient(chainId: number) {
  const chain = SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return createPublicClient({
    chain,
    transport: http(),
  });
}

// Fetch native balance (ETH, MATIC, etc.)
export async function getNativeBalance(address: string, chainId: number = 1): Promise<string> {
  try {
    const client = getPublicClient(chainId);
    const balance = await client.getBalance({
      address: address as `0x${string}`,
    });
    
    return formatEther(balance);
  } catch (error) {
    return '0';
  }
}

// Fetch token balance
export async function getTokenBalance(
  address: string,
  tokenSymbol: 'USDT' | 'XPL' | 'PLASMA',
  chainId: number = 1
): Promise<string> {
  try {
    const tokenContracts = TOKEN_CONTRACTS[tokenSymbol];
    const tokenAddress = tokenContracts?.[chainId as keyof typeof tokenContracts];
    
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      return '0';
    }

    const client = getPublicClient(chainId);
    
    // Get token decimals
    const decimals = await client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });
    
    // Get balance
    const balance = await client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });
    
    // Format balance with correct decimals
    const divisor = 10 ** Number(decimals);
    const formattedBalance = Number(balance) / divisor;
    
    return formattedBalance.toFixed(6);
  } catch (error) {
    return '0';
  }
}

// Fetch all balances for a wallet
export async function getAllBalances(address: string, chainId: number = 1) {
  try {
    const [nativeBalance, usdtBalance, xplBalance] = await Promise.all([
      getNativeBalance(address, chainId),
      getTokenBalance(address, 'USDT', chainId),
      getTokenBalance(address, 'XPL', chainId),
    ]);
    
    return {
      native: nativeBalance,
      USDT: usdtBalance,
      XPL: xplBalance,
      PLASMA: '0', // Placeholder for PLASMA token
    };
  } catch (error) {
    return {
      native: '0',
      USDT: '0',
      XPL: '0',
      PLASMA: '0',
    };
  }
}

// Monitor transaction status
export async function getTransactionStatus(txHash: string, chainId: number = 1) {
  try {
    const client = getPublicClient(chainId);
    
    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
    
    if (!receipt) {
      return { status: 'PENDING', confirmations: 0 };
    }
    
    const block = await client.getBlock();
    const confirmations = block.number - receipt.blockNumber;
    
    return {
      status: receipt.status === 'success' ? 'COMPLETED' : 'FAILED',
      confirmations: Number(confirmations),
      blockNumber: Number(receipt.blockNumber),
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
    };
  } catch (error) {
    return { status: 'PENDING', confirmations: 0 };
  }
}

// Estimate gas for a transaction
export async function estimateGas(
  from: string,
  to: string,
  value: string,
  chainId: number = 1
) {
  try {
    const client = getPublicClient(chainId);
    
    const gasEstimate = await client.estimateGas({
      account: from as `0x${string}`,
      to: to as `0x${string}`,
      value: BigInt(value),
    });
    
    const gasPrice = await client.getGasPrice();
    
    return {
      gasLimit: gasEstimate.toString(),
      gasPrice: gasPrice.toString(),
      estimatedCost: formatEther(gasEstimate * gasPrice),
    };
  } catch (error) {
    return null;
  }
}
