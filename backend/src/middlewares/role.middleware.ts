import type { AuthRole } from '../security/session.js';
import type { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { db } from '../config/database.js';

export const roleMiddleware = (...allowedRoles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
