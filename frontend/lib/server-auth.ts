import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AccountRole = 'user' | 'recycler' | 'admin';

interface SessionResponse {
  status: 'success' | 'error';
  data?: { id: string; role: AccountRole };
}

export async function requireRole(requiredRole: AccountRole): Promise<void> {
  const cookieStore = await cookies();
  const roleCookieName =
    requiredRole === 'admin'
      ? 'recynect_admin_session'
      : requiredRole === 'recycler'
      ? 'recynect_recycler_session'
      : 'recynect_user_session';

  const token = cookieStore.get(roleCookieName)?.value || cookieStore.get('recynect_session')?.value;
  if (!token) redirect(loginPath(requiredRole));

  // Decode JWT payload langsung untuk validasi instan
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      if (payload.role !== requiredRole) {
        redirect(loginPath(requiredRole));
      }
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'digest' in err) throw err;
  }

  // Pada server-side fetch di Node.js, gunakan BACKEND_URL atau absolute URL
  const backendHost = process.env.BACKEND_URL
    ? process.env.BACKEND_URL.replace(/\/$/, '')
    : process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    : 'http://localhost:5000';

  const apiBaseUrl = `${backendHost}/api`;

  try {
    const allCookieHeader = cookieStore.getAll().map((c) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');

    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        cookie: allCookieHeader || `recynect_session=${encodeURIComponent(token)}`,
        'X-Portal': requiredRole,
      },
      cache: 'no-store',
    });

    const session = (await response.json()) as SessionResponse;
    if (!response.ok || session.status !== 'success' || !session.data) redirect(loginPath(requiredRole));
    if (session.data.role !== requiredRole) redirect(loginPath(requiredRole));
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    redirect(loginPath(requiredRole));
  }
}

function loginPath(role: AccountRole): string {
  if (role === 'admin') return '/admin/login';
  if (role === 'recycler') return '/pengelola/login';
  return '/login';
}
