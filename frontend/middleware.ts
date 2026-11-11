import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwtRole(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('recynect_session')?.value;
  const userRole = sessionToken ? parseJwtRole(sessionToken) : null;

  // 1. Guard Rute Admin Dashboard: hanya akun role 'admin' yang boleh masuk
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/forgot-password') &&
    !pathname.startsWith('/admin/register')
  ) {
    if (userRole !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Rute Mitra Pengelola: hanya akun role 'recycler' yang boleh masuk
  if (
    pathname.startsWith('/pengelola') &&
    !pathname.startsWith('/pengelola/login') &&
    !pathname.startsWith('/pengelola/forgot-password') &&
    !pathname.startsWith('/pengelola/register')
  ) {
    if (userRole !== 'recycler') {
      const loginUrl = new URL('/pengelola/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/pengelola/:path*',
  ],
};

