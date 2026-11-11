import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error.js';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const code = 'code' in err && typeof err.code === 'string' ? err.code : undefined;
  const isHttp =
    err instanceof HttpError ||
    err.name === 'HttpError' ||
    (typeof (err as any).statusCode === 'number' && (err as any).statusCode >= 400 && (err as any).statusCode < 500);

  const statusCode = isHttp
    ? (err as any).statusCode
    : code === 'P2025'
      ? 404
      : code === 'P2002'
        ? 409
        : 500;

  if (statusCode >= 500) console.error(`[API Error] ${err.name}: ${err.message}`, err.stack);
  const message = statusCode >= 500 ? 'Terjadi kesalahan pada server.' : err.message;

  return res.status(statusCode).json({ status: 'error', message });
};
