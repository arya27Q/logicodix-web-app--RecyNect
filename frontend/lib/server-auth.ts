import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AccountRole = 'user' | 'recycler' | 'admin';

interface SessionResponse {
  status: 'success' | 'error';
  data?: { id: string; role: AccountRole };
}

export async function requireRole(requiredRole: AccountRole): Promise<void> {
  const token = (await cookies()).get('recynect_session')?.value;
  if (!token) redirect(loginPath(requiredRole));

  const apiBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: { cookie: `recynect_session=${encodeURIComponent(token)}` },
      cache: 'no-store',
    });
    const session = await response.json() as SessionResponse;
    if (!response.ok || session.status !== 'success' || !session.data) redirect(loginPath(requiredRole));
    if (session.data.role !== requiredRole) redirect(loginPath(session.data.role));
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    redirect(loginPath(requiredRole));
  }
}

function loginPath(role: AccountRole): string {
  if (role === 'admin') return '/admin/login';
  if (role === 'recycler') return '/recycler/login';
  return '/login';
}
