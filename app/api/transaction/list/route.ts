import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const idToken = authHeader?.replace('Bearer ', '');
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    let privyAuth;
    try {
      privyAuth = await privyClient.verifyAuthToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!privyAuth) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const walletAddress = searchParams.get('wallet');
    const status = searchParams.get('status');
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { privyId: privyAuth.userId },
      include: {
        wallets: true,
      },
    });
    
    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          privyId: privyAuth.userId,
        },
        include: {
          wallets: true,
        },
      });
    }
    
    // Build query conditions
    const where: any = {
      userId: user.id,
    };
    
    if (walletAddress) {
      // Find transactions involving this wallet
      where.OR = [
        { fromAddress: walletAddress.toLowerCase() },
        { toAddress: walletAddress.toLowerCase() },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    // Fetch transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
        include: {
          fromWallet: true,
          toWallet: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);
    
    // Format transactions
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount.toString(),
      currency: tx.currency,
      type: tx.type,
      status: tx.status,
      txHash: tx.txHash,
      chainId: tx.chainId,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
      metadata: tx.metadata,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
      fromWallet: tx.fromWallet ? {
        address: tx.fromWallet.address,
        label: tx.fromWallet.label,
        type: tx.fromWallet.type,
      } : null,
      toWallet: tx.toWallet ? {
        address: tx.toWallet.address,
        label: tx.toWallet.label,
        type: tx.toWallet.type,
      } : null,
    }));
    
    return NextResponse.json({
      transactions: formattedTransactions,
      total,
      limit,
      offset,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
