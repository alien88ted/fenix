import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: NextRequest) {
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
    
    // Get transaction data
    const {
      fromAddress,
      toAddress,
      amount,
      currency = 'USDT',
      type,
      txHash,
      chainId = 1,
      gasUsed,
      gasPrice,
      blockNumber,
      metadata,
    } = await req.json();
    
    // Validate required fields
    if (!fromAddress || !toAddress || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
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
    
    // Find wallets
    const fromWallet = await prisma.wallet.findUnique({
      where: { address: fromAddress.toLowerCase() },
    });
    
    const toWallet = await prisma.wallet.findUnique({
      where: { address: toAddress.toLowerCase() },
    });
    
    // Verify user owns the from wallet (for SEND transactions)
    if (type === 'SEND' && fromWallet?.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: wallet not owned by user' },
        { status: 403 }
      );
    }
    
    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        fromWalletId: fromWallet?.id || null,
        toWalletId: toWallet?.id || null,
        fromAddress: fromAddress.toLowerCase(),
        toAddress: toAddress.toLowerCase(),
        amount: new Decimal(amount),
        currency,
        type,
        status: txHash ? 'CONFIRMING' : 'PENDING',
        txHash,
        chainId,
        gasUsed,
        gasPrice,
        blockNumber,
        metadata: metadata || {},
      },
    });
    
    // Update wallet balances if needed (for completed transactions)
    if (txHash && fromWallet) {
      // In production, fetch real balance from blockchain
      // For now, just update the stored balance
      const currentBalance = fromWallet.balance || new Decimal(0);
      await prisma.wallet.update({
        where: { id: fromWallet.id },
        data: {
          balance: currentBalance.sub(new Decimal(amount)),
          updatedAt: new Date(),
        },
      });
    }
    
    if (txHash && toWallet && toWallet.userId === user.id) {
      const currentBalance = toWallet.balance || new Decimal(0);
      await prisma.wallet.update({
        where: { id: toWallet.id },
        data: {
          balance: currentBalance.add(new Decimal(amount)),
          updatedAt: new Date(),
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      transaction: {
        ...transaction,
        amount: transaction.amount.toString(),
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
