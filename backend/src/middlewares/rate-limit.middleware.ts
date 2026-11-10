import type { NextFunction, Request, Response } from 'express';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function authRateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = `${req.ip ?? 'unknown'}:${req.baseUrl}${req.path}`;
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    if (attempts.size >= 10000) {
      for (const [attemptKey, value] of attempts) {
        if (value.resetAt <= now) attempts.delete(attemptKey);
      }
      if (attempts.size >= 10000) {
        res.setHeader('Retry-After', Math.ceil(WINDOW_MS / 1000));
        return res.status(429).json({ status: 'error', message: 'Terlalu banyak percobaan. Coba lagi nanti.' });
      }
    }
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
    return res.status(429).json({ status: 'error', message: 'Terlalu banyak percobaan. Coba lagi nanti.' });
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
