import { AuthRole, getSessionClaims } from '../security/session.js';
import type { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { db } from '../config/database.js';

export const roleMiddleware = (...allowedRoles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Jika auth belum terpasang atau role saat ini tidak cocok,
    // coba periksa role-specific session cookie yang cocok dengan allowedRoles
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      for (const role of allowedRoles) {
        const roleClaims = getSessionClaims(req, role);
        if (roleClaims && allowedRoles.includes(roleClaims.role)) {
          req.auth = roleClaims;
          (req as any).user = { id: roleClaims.sub, role: roleClaims.role };
          break;
        }
      }
    }

    if (!req.auth) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }

    const accountExists = req.auth.role === 'admin'
      ? await db.admin.findUnique({ where: { id: req.auth.sub }, select: { id: true, authVersion: true } })
      : await db.user.findFirst({
        where: {
          id: req.auth.sub,
          role: req.auth.role === 'recycler' ? UserRole.recycler : UserRole.user,
        },
        select: { id: true, authVersion: true },
      });
    if (!accountExists || accountExists.authVersion !== req.auth.ver) {
      return res.status(401).json({ status: 'error', message: 'Sesi tidak lagi aktif.' });
    }

    return next();
  };
};
