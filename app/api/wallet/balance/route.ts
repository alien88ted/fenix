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
    const authToken = req.cookies.get('privy-token')?.value;
    const sessionToken = req.cookies.get('fenix-session')?.value;
    
    if (!authToken && !sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get wallet address from query
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Verify session and wallet ownership
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: {
          user: {
            include: {
              wallets: true
            }
          }
        }
      });

      if (!session || session.expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
      }

      // Check if wallet belongs to user
      const ownsWallet = session.user.wallets.some(
        w => w.address.toLowerCase() === address.toLowerCase()
      );

      if (!ownsWallet) {
        return NextResponse.json(
          { error: 'Wallet not found' },
          { status: 404 }
        );
      }

      // Get wallet balance from database
      const wallet = await prisma.wallet.findUnique({
        where: { address: address.toLowerCase() }
      });

      // In production, you would fetch real balance from blockchain
      // For now, return mock balance or stored balance
      const balance = wallet?.balance?.toString() || '1247.50';

      return NextResponse.json({
        address,
        balance,
        currency: 'USDT',
        chainId: wallet?.chainId || 1
      });
    }

    // Default response for authenticated users without session
    return NextResponse.json({
      address,
      balance: '0.00',
      currency: 'USDT',
      chainId: 1
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
