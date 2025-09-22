
import { auth } from '@/auth'; // Assuming you have auth configured
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect specific routes
  if (pathname.startsWith('/dashboard') && !req.auth) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow access to other routes
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'], // Apply middleware to these paths
};
