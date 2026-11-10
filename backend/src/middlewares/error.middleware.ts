import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error.js';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const code = 'code' in err && typeof err.code === 'string' ? err.code : undefined;
  const statusCode = err instanceof HttpError
    ? err.statusCode
    : code === 'P2025'
      ? 404
      : code === 'P2002'
        ? 409
        : 500;

  if (statusCode >= 500) console.error(`[API] ${err.name}`);
  const message = statusCode >= 500 ? 'Terjadi kesalahan pada server.' : err.message;

  return res.status(statusCode).json({ status: 'error', message });
};
