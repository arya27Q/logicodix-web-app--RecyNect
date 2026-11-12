// Base URL untuk client-side fetch:
// Default ke relative path '/api' agar otomatis melalui Next.js Rewrite Proxy (First-Party Cookies).
// Dapat dioverride oleh NEXT_PUBLIC_API_URL jika memang diarahkan khusus.
const rawBase = process.env.NEXT_PUBLIC_API_URL || '/api';
const BASE_URL = rawBase.replace(/\/$/, '');

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined' && !headers.has('X-Portal')) {
    const path = window.location.pathname;
    if (path.startsWith('/pengelola')) {
      headers.set('X-Portal', 'pengelola');
    } else if (path.startsWith('/admin')) {
      headers.set('X-Portal', 'admin');
    } else {
      headers.set('X-Portal', 'warga');
    }
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${BASE_URL}${cleanEndpoint}`;

  const res = await fetch(targetUrl, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (!res.ok || !payload || payload.status !== 'success') {
    const message = payload?.message || `Permintaan gagal (${res.status}).`;
    throw new ApiError(message, res.status, payload?.data);
  }

  return payload.data;
}
