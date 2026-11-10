import type { NextFunction, Request, Response } from 'express';
import { ENV } from '../config/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function requireTrustedOrigin(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (!origin || !ENV.FRONTEND_ORIGINS.includes(origin) || req.get('sec-fetch-site') === 'cross-site') {
    return res.status(403).json({ status: 'error', message: 'Origin request tidak diizinkan.' });
  }

  return next();
}
