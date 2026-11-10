const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = await res.json().catch(() => null) as ApiResponse<T> | null;
  if (!res.ok || !payload || payload.status !== 'success') {
    throw new Error(payload?.message || `Permintaan gagal (${res.status}).`);
  }

  return payload.data;
}
