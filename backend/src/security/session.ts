import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { ENV } from '../config/env.js';

export const SESSION_COOKIE = 'recynect_session';
export const USER_SESSION_COOKIE = 'recynect_user_session';
export const RECYCLER_SESSION_COOKIE = 'recynect_recycler_session';
export const ADMIN_SESSION_COOKIE = 'recynect_admin_session';

const SESSION_ISSUER = 'recynect-api';
const SESSION_AUDIENCE = 'recynect-web';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AuthRole = 'user' | 'recycler' | 'admin';

export function getRoleCookieName(role: AuthRole): string {
  if (role === 'recycler') return RECYCLER_SESSION_COOKIE;
  if (role === 'admin') return ADMIN_SESSION_COOKIE;
  return USER_SESSION_COOKIE;
}

export interface SessionClaims {
  sub: string;
  role: AuthRole;
  ver: number;
  iss: typeof SESSION_ISSUER;
  aud: typeof SESSION_AUDIENCE;
  iat: number;
  exp: number;
  jti: string;
}

function signature(input: string): Buffer {
  return createHmac('sha256', ENV.JWT_SECRET).update(input).digest();
}

export function createSessionToken(subject: string, role: AuthRole, authVersion: number): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload: SessionClaims = {
    sub: subject,
    role,
    ver: authVersion,
    iss: SESSION_ISSUER,
    aud: SESSION_AUDIENCE,
    iat: issuedAt,
    exp: issuedAt + SESSION_MAX_AGE_SECONDS,
    jti: randomBytes(16).toString('base64url'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${header}.${encodedPayload}`;
  return `${unsigned}.${signature(unsigned).toString('base64url')}`;
}

export function verifySessionToken(token: string): SessionClaims | null {
  if (token.length > 4096) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [headerPart, payloadPart, signaturePart] = parts;
    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8')) as { alg?: string; typ?: string };
    if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;

    const unsigned = `${headerPart}.${payloadPart}`;
    const suppliedSignature = Buffer.from(signaturePart, 'base64url');
    const expectedSignature = signature(unsigned);
    if (suppliedSignature.length !== expectedSignature.length || !timingSafeEqual(suppliedSignature, expectedSignature)) {
      return null;
    }

    const claims = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Partial<SessionClaims>;
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof claims.sub !== 'string' || claims.sub.length === 0 ||
      !['user', 'recycler', 'admin'].includes(claims.role ?? '') ||
      !Number.isInteger(claims.ver) || (claims.ver ?? -1) < 0 ||
      claims.iss !== SESSION_ISSUER || claims.aud !== SESSION_AUDIENCE ||
      typeof claims.iat !== 'number' || typeof claims.exp !== 'number' || claims.exp <= now ||
      claims.iat > now + 60 || claims.exp - claims.iat > SESSION_MAX_AGE_SECONDS ||
      typeof claims.jti !== 'string'
    ) return null;

    return claims as SessionClaims;
  } catch {
    return null;
  }
}

function cookieOptions() {
  const isProduction = ENV.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    ...(ENV.COOKIE_DOMAIN ? { domain: ENV.COOKIE_DOMAIN } : {}),
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  };
}

export function setSessionCookie(res: Response, token: string): void {
  const options = cookieOptions();
  const claims = verifySessionToken(token);
  if (claims) {
    const roleCookie = getRoleCookieName(claims.role);
    res.cookie(roleCookie, token, options);
  }
  // Set juga cookie umum recynect_session untuk backward-compatibility
  res.cookie(SESSION_COOKIE, token, options);
}

export function clearSessionCookie(res: Response, role?: AuthRole): void {
  const options = cookieOptions();
  if (role) {
    res.clearCookie(getRoleCookieName(role), options);
  } else {
    res.clearCookie(USER_SESSION_COOKIE, options);
    res.clearCookie(RECYCLER_SESSION_COOKIE, options);
    res.clearCookie(ADMIN_SESSION_COOKIE, options);
  }
  res.clearCookie(SESSION_COOKIE, options);
}

function readCookieByName(req: Request, cookieName: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  const entry = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(cookieName.length + 1));
  } catch {
    return null;
  }
}

export function getSessionClaims(req: Request, preferredRole?: AuthRole): SessionClaims | null {
  let targetRole = preferredRole;

  // 1. Deteksi preferred role dari header X-Portal jika belum dispesifikasikan
  if (!targetRole) {
    const portalHeader = String(req.headers['x-portal'] || '').toLowerCase();
    if (portalHeader === 'pengelola' || portalHeader === 'recycler') targetRole = 'recycler';
    else if (portalHeader === 'admin') targetRole = 'admin';
    else if (portalHeader === 'warga' || portalHeader === 'user') targetRole = 'user';
  }

  // 2. Deteksi preferred role dari URL path atau Referer browser
  if (!targetRole) {
    const referer = String(req.headers.referer || '').toLowerCase();
    const url = String(req.originalUrl || req.url || '').toLowerCase();
    if (url.includes('/api/admin') || referer.includes('/admin')) {
      targetRole = 'admin';
    } else if (
      url.includes('/api/recyclers/dashboard') ||
      url.includes('/api/recyclers/materials') ||
      url.includes('/api/recyclers/incoming') ||
      referer.includes('/pengelola')
    ) {
      targetRole = 'recycler';
    } else if (
      url.includes('/api/auth/history') ||
      referer.includes('/profile') ||
      referer.includes('/match')
    ) {
      targetRole = 'user';
    }
  }

  // 3. Jika targetRole teridentifikasi, prioritaskan pembacaan role cookie tersebut
  if (targetRole) {
    const roleCookie = getRoleCookieName(targetRole);
    const token = readCookieByName(req, roleCookie);
    if (token) {
      const claims = verifySessionToken(token);
      if (claims && claims.role === targetRole) {
        return claims;
      }
    }
  }

  // 4. Periksa default cookie recynect_session
  const defaultToken = readCookieByName(req, SESSION_COOKIE);
  if (defaultToken) {
    const claims = verifySessionToken(defaultToken);
    if (claims && (!targetRole || claims.role === targetRole)) {
      return claims;
    }
  }

  // 5. Coba periksa role cookies lainnya jika belum cocok
  const fallbackRoles: AuthRole[] = targetRole
    ? (['user', 'recycler', 'admin'] as AuthRole[]).filter((r) => r !== targetRole)
    : ['user', 'recycler', 'admin'];

  for (const r of fallbackRoles) {
    const token = readCookieByName(req, getRoleCookieName(r));
    if (token) {
      const claims = verifySessionToken(token);
      if (claims) return claims;
    }
  }

  // 6. Terakhir, jika default cookie ada walau role berbeda
  if (defaultToken) {
    return verifySessionToken(defaultToken);
  }

  return null;
}
