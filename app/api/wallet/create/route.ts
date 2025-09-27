import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';

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
    
    // Get request body
    const { chainType = 'ethereum', createSmartWallet = false } = await req.json();
    
    // Find or create user in database
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
    
    // Create wallet via Privy API
    const updatedUser = await privyClient.createWallets({
      userId: privyAuth.userId,
    });
    
    // Find the newly created wallet
    const newWallet = updatedUser.linkedAccounts.find(
      (account: any) => 
        account.type === 'wallet' && 
        account.walletClientType === 'privy' &&
        'address' in account &&
        !user.wallets.some(w => w.address.toLowerCase() === account.address.toLowerCase())
    ) as any;
    
    if (!newWallet) {
      return NextResponse.json(
        { error: 'Failed to create wallet' },
        { status: 500 }
      );
    }
    
    // Save to database
    const dbWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        address: newWallet.address.toLowerCase(),
        type: 'EMBEDDED',
        chainId: newWallet.chainId || (chainType === 'solana' ? 101 : 1),
        isDefault: user.wallets.length === 0,
        label: `${chainType === 'solana' ? 'Solana' : 'Ethereum'} Wallet ${user.wallets.length + 1}`,
      },
    });
    
    return NextResponse.json({
      success: true,
      wallet: dbWallet,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create wallet' },
      { status: 500 }
    );
  }
}
