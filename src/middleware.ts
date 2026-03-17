import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we are trying to access an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If it's the login page, allow access
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for our dummy auth cookie
    const authCookie = request.cookies.get('adminAuth');

    // If no cookie exists, redirect to login
    if (!authCookie || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue for all other routes
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
