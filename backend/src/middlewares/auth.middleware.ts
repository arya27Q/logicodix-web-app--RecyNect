import type { NextFunction, Request, Response } from 'express';
import { getSessionClaims } from '../security/session.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const claims = getSessionClaims(req);
  if (!claims) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });

  req.auth = claims;
  return next();
}
