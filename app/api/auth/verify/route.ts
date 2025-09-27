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
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No identity token provided' },
        { status: 401 }
      );
    }
    
    // Verify the token with Privy
    const privyUser = await privyClient.getUser({ idToken });
    
    if (!privyUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { privyId: privyUser.id },
      include: {
        wallets: true,
      },
    });
    
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          privyId: privyUser.id,
          email: privyUser.email?.address || null,
          name: privyUser.google?.name || privyUser.twitter?.name || null,
          phoneNumber: privyUser.phone?.number || null,
        },
        include: {
          wallets: true,
        },
      });
      
      // If user has embedded wallet, save it
      if (privyUser.wallet) {
        await prisma.wallet.create({
          data: {
            userId: user.id,
            address: privyUser.wallet.address,
            type: 'EMBEDDED',
            chainId:
              typeof privyUser.wallet.chainId === 'string'
                ? parseInt(privyUser.wallet.chainId, 10)
                : privyUser.wallet.chainId ?? 1,
            isDefault: true,
          },
        });
      }
    } else {
      // Update user info if changed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: privyUser.email?.address || user.email,
          name: privyUser.google?.name || privyUser.twitter?.name || user.name,
          phoneNumber: privyUser.phone?.number || user.phoneNumber,
        },
      });
    }
    
    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
        userAgent: req.headers.get('user-agent') || null,
        expiresAt,
      },
    });
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        privyId: user.privyId,
        email: user.email,
        name: user.name,
        wallets: user.wallets,
      },
    });
    
    response.cookies.set('fenix-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Auth verification error:', error);
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      { error: prismaError.error || 'Authentication failed' },
      { status: 500 }
    );
  }
}
