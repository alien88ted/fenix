import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';

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
    let privyUser;
    try {
      privyUser = await privyClient.verifyAuthToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!privyUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { privyId: privyUser.userId },
      include: {
        wallets: true,
      },
    });
    
    if (!user) {
      // Get full user details from Privy
      const fullPrivyUser = await privyClient.getUser(privyUser.userId);
      
      // Create new user
      user = await prisma.user.create({
        data: {
          privyId: privyUser.userId,
          email: fullPrivyUser.email?.address || null,
          name: fullPrivyUser.google?.name || fullPrivyUser.twitter?.name || null,
        },
        include: {
          wallets: true,
        },
      });
    }
    
    // Get user's full details from Privy
    const fullPrivyUser = await privyClient.getUser(privyUser.userId);
    
    // Sync wallets - filter for wallet type accounts
    const walletAccounts = fullPrivyUser.linkedAccounts.filter(
      (account): account is any => account.type === 'wallet'
    );
    
    const syncedWallets = [];
    
    for (const wallet of walletAccounts) {
      // Type guard to ensure we have wallet properties
      if (!wallet || typeof wallet !== 'object') continue;
      
      // Safely access wallet properties
      const walletAddress = (wallet as any).address;
      if (!walletAddress) continue;
      
      const walletChainId = (wallet as any).chainId || 1;
      const walletClientType = (wallet as any).walletClientType || 'unknown';
      const walletClient = (wallet as any).walletClient || 'External';
      
      // Check if wallet exists in database
      let dbWallet = await prisma.wallet.findUnique({
        where: { address: walletAddress.toLowerCase() },
      });
      
      if (!dbWallet) {
        // Determine wallet type
        const walletType = walletClientType === 'privy' ? 'EMBEDDED' : 'EXTERNAL';
        
        // Create new wallet in database
        dbWallet = await prisma.wallet.create({
          data: {
            userId: user.id,
            address: walletAddress.toLowerCase(),
            type: walletType,
            chainId: walletChainId,
            isDefault: user.wallets.length === 0, // First wallet is default
            label: walletType === 'EMBEDDED' 
              ? `Embedded Wallet ${user.wallets.length + 1}`
              : `${walletClient} Wallet`,
          },
        });
      } else {
        // Update wallet info if needed
        dbWallet = await prisma.wallet.update({
          where: { id: dbWallet.id },
          data: {
            chainId: walletChainId,
            updatedAt: new Date(),
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync wallets' },
      { status: 500 }
    );
  }
}
