import { NextRequest, NextResponse } from 'next/server';

// Edge runtime: cannot import jsonwebtoken (uses Node crypto).
// Middleware does a cheap cookie-presence check only — API routes and page
// guards (which run on the Node runtime) do the real JWT verification and
// role checks via withAuth / withRole.

const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/workout-plan',
  '/live-workout',
  '/ai-coach',
  '/calculators',
  '/coach',
  '/admin',
  '/billing',
  '/coaches',
  '/messages',
  '/api/user',
  '/api/fitness',
  '/api/workout-plans',
  '/api/workout-sessions',
  '/api/exercises',
  '/api/coach',
  '/api/admin',
  '/api/billing',
  '/api/messages',
];

const AUTH_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = !!request.cookies.get('token')?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
