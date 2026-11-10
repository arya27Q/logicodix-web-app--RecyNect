import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const friendlyMessage = firstIssue?.message || 'Data yang dimasukkan belum lengkap atau formatnya belum sesuai.';

      return res.status(400).json({
        status: 'error',
        message: friendlyMessage,
        errors: result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
      });
    }

    req.body = result.data;
    return next();
  };
};

