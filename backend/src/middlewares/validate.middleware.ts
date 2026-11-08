import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Validasi payload request body menggunakan Zod
    next();
  };
};

