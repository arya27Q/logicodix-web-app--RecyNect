import type { NextFunction, Request, Response } from 'express';
import { ENV } from '../config/env.js';

const isDev = ENV.NODE_ENV !== 'production';
const WINDOW_MS = isDev ? 30 * 1000 : 15 * 60 * 1000;
const MAX_ATTEMPTS = isDev ? 100 : 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function clearRateLimit(ip?: string) {
  if (!ip) {
    attempts.clear();
    return;
  }
  for (const key of attempts.keys()) {
    if (key.startsWith(ip)) attempts.delete(key);
  }
}

export function authRateLimit(req: Request, res: Response, next: NextFunction) {
  // Jangan batasi rate limit di localhost saat development agar tidak mengganggu pengujian
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (
    isDev &&
    (clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp === '::ffff:127.0.0.1' ||
      clientIp.includes('127.0.0.1') ||
      clientIp === 'unknown' ||
      req.hostname === 'localhost' ||
      req.hostname === '127.0.0.1')
  ) {
    return next();
  }

  const now = Date.now();
  const key = `${clientIp}:${req.baseUrl}${req.path}`;
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    if (attempts.size >= 10000) {
      for (const [attemptKey, value] of attempts) {
        if (value.resetAt <= now) attempts.delete(attemptKey);
      }
      if (attempts.size >= 10000) {
        res.setHeader('Retry-After', Math.ceil(WINDOW_MS / 1000));
        return res.status(429).json({ status: 'error', message: 'Terlalu banyak percobaan. Coba lagi dalam beberapa saat.' });
      }
    }
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_ATTEMPTS) {
    const remainingSecs = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader('Retry-After', remainingSecs);
    return res.status(429).json({
      status: 'error',
      message: `Terlalu banyak percobaan masuk. Silakan tunggu ${remainingSecs} detik sebelum mencoba kembali.`,
    });
  }

  current.count += 1;
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }
}, WINDOW_MS).unref();

