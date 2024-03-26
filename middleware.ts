/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // skip middleware for API routes, images, static files, and specific assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  const userId = session?.userId;

  // redirect authenticated users away from sign-in page
  if (pathname === '/sign-in' && userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};
