import type { NextFunction, Request, Response } from 'express';
import { getSessionClaims } from '../security/session.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const claims = getSessionClaims(req);
  if (!claims) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });

  req.auth = claims;
  (req as any).user = { id: claims.sub, role: claims.role };
  return next();
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const claims = getSessionClaims(req);
  if (claims) {
    req.auth = claims;
    (req as any).user = { id: claims.sub, role: claims.role };
  }
  return next();
}
