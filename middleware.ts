import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site-auth';
const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-dev-secret';

async function verifySignedToken(token: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const expectedBuf = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const expectedHex = Array.from(new Uint8Array(expectedBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison
  if (signature.length !== expectedHex.length) return false;
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return result === 0;
}

export async function middleware(request: NextRequest) {
  // Skip auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for auth cookie with signed token
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value && (await verifySignedToken(authCookie.value))) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL('/api/auth', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
