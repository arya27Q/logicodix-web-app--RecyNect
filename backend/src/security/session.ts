import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { ENV } from '../config/env.js';

export const SESSION_COOKIE = 'recynect_session';
const SESSION_ISSUER = 'recynect-api';
const SESSION_AUDIENCE = 'recynect-web';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AuthRole = 'user' | 'recycler' | 'admin';

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
  return {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    ...(ENV.COOKIE_DOMAIN ? { domain: ENV.COOKIE_DOMAIN } : {}),
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  };
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, cookieOptions());
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, cookieOptions());
}

function readSessionCookie(req: Request): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  const entry = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1));
  } catch {
    return null;
  }
}

export function getSessionClaims(req: Request): SessionClaims | null {
  const token = readSessionCookie(req);
  return token ? verifySessionToken(token) : null;
}
