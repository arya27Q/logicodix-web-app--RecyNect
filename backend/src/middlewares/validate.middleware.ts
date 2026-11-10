import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Data yang dikirim tidak valid.',
        errors: result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
      });
    }

    req.body = result.data;
    return next();
  };
};
