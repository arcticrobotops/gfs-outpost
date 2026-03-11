import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site-auth';

export function middleware(request: NextRequest) {
  // Skip auth routes
  if (request.nextUrl.pathname.startsWith('/__auth')) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL('/__auth', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
