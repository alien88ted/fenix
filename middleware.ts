import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/wallet',
  '/transactions',
  '/settings',
  '/api/wallet',
  '/api/transactions',
  '/api/user',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/api/auth',
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check for Privy authentication tokens
  const privyToken = req.cookies.get('privy-token');
  const privySession = req.cookies.get('privy-session');
  const privyRefreshToken = req.cookies.get('privy-refresh-token');
  
  // Bypass middleware for OAuth callback
  if (req.nextUrl.searchParams.get('privy_oauth_code')) {
    return NextResponse.next();
  }
  
  // Bypass middleware for refresh page to prevent infinite loop
  if (pathname === '/refresh') {
    return NextResponse.next();
  }
  
  // Check authentication status
  const isDefinitelyAuthenticated = Boolean(privyToken);
  const maybeAuthenticated = Boolean(privySession) && Boolean(privyRefreshToken);
  
  // Handle protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    if (!isDefinitelyAuthenticated && !maybeAuthenticated) {
      // Not authenticated at all - redirect to login
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (!isDefinitelyAuthenticated && maybeAuthenticated) {
      // Has refresh token - redirect to refresh page
      return NextResponse.redirect(new URL('/refresh', req.url));
    }
  }
  
  // Create response
  const response = isProtectedRoute && !isDefinitelyAuthenticated && !maybeAuthenticated
    ? NextResponse.redirect(new URL('/login', req.url))
    : NextResponse.next();
  
  // Add comprehensive security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Strict CSP for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://challenges.cloudflare.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        font-src 'self' data:;
        connect-src 'self' https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://api.coingecko.com;
        frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim()
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
