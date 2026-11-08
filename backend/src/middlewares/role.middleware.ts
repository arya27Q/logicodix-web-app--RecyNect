import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Guard hak akses peran (user, recycler, admin)
    next();
  };
};

