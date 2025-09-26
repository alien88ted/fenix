import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma, handlePrismaError } from '@/lib/prisma';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    // Get the identity token from the request
    const authHeader = req.headers.get('authorization');
    const idToken = authHeader?.replace('Bearer ', '');
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }
    
    // Verify the token with Privy
    const privyUser = await privyClient.verifyAuthToken(idToken);
    
    if (!privyUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { privyId: privyUser.userId },
      include: {
        wallets: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's full details from Privy
    const fullPrivyUser = await privyClient.getUser(privyUser.userId);
    
    // Sync embedded wallets
    const embeddedWallets = fullPrivyUser.linkedAccounts.filter(
      account => account.type === 'wallet' && account.walletClientType === 'privy'
    );
    
    const syncedWallets = [];
    
    for (const wallet of embeddedWallets) {
      // Check if wallet exists in database
      let dbWallet = await prisma.wallet.findUnique({
        where: { address: wallet.address.toLowerCase() },
      });
      
      if (!dbWallet) {
        // Create new wallet in database
        dbWallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            address: wallet.address.toLowerCase(),
            type: 'EMBEDDED',
            chainId: wallet.chainId || 1,
            isDefault: user.wallets.length === 0, // First wallet is default
            label: `Embedded Wallet ${user.wallets.length + 1}`,
          },
        });
      } else {
        // Update wallet info if needed
        dbWallet = await prisma.wallet.update({
          where: { id: dbWallet.id },
          data: {
            chainId: wallet.chainId || dbWallet.chainId,
            updatedAt: new Date(),
          },
        });
      }
      
      syncedWallets.push(dbWallet);
    }
    
    // Sync external wallets
    const externalWallets = fullPrivyUser.linkedAccounts.filter(
      account => account.type === 'wallet' && account.walletClientType !== 'privy'
    );
    
    for (const wallet of externalWallets) {
      let dbWallet = await prisma.wallet.findUnique({
        where: { address: wallet.address.toLowerCase() },
      });
      
      if (!dbWallet) {
        dbWallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            address: wallet.address.toLowerCase(),
            type: 'EXTERNAL',
            chainId: wallet.chainId || 1,
            isDefault: false,
            label: wallet.walletClient || 'External Wallet',
          },
        });
      }
      
      syncedWallets.push(dbWallet);
    }
    
    return NextResponse.json({
      success: true,
      wallets: syncedWallets,
      user: {
        id: user.id,
        privyId: user.privyId,
        email: user.email,
        name: user.name,
      },
    });
    
  } catch (error) {
    console.error('Wallet sync error:', error);
    return handlePrismaError(error) || NextResponse.json(
      { error: 'Failed to sync wallets' },
      { status: 500 }
    );
  }
}
