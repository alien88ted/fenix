import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

export async function GET(req: NextRequest) {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      status: 'healthy',
      checks: {
        privyAppId: {
          configured: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID,
          valid: false,
          masked: '',
        },
        privySecret: {
          configured: !!process.env.PRIVY_APP_SECRET,
          valid: false,
        },
        database: {
          configured: !!process.env.DATABASE_URL,
          type: process.env.DATABASE_URL ? 'postgresql' : 'sqlite',
        },
      },
    };

    // Check Privy App ID format (both old 'clj' and new 'cmg' formats)
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    if (appId) {
      checks.checks.privyAppId.valid = (appId.startsWith('clj') || appId.startsWith('cmg')) && appId.length >= 20;
      checks.checks.privyAppId.masked = `${appId.substring(0, 8)}...${appId.substring(appId.length - 4)}`;
    }

    // Check if Privy client can be initialized (validates secret)
    if (process.env.PRIVY_APP_SECRET && appId) {
      try {
        const privyClient = new PrivyClient(appId, process.env.PRIVY_APP_SECRET);
        // If initialization doesn't throw, the secret format is valid
        checks.checks.privySecret.valid = true;
      } catch {
        checks.checks.privySecret.valid = false;
      }
    }

    // Determine overall health
    const isHealthy = 
      checks.checks.privyAppId.configured && 
      checks.checks.privyAppId.valid && 
      checks.checks.privySecret.configured;

    if (!isHealthy) {
      checks.status = 'unhealthy';
      return NextResponse.json(checks, { status: 503 });
    }

    return NextResponse.json(checks);
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Support OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
