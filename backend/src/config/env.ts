import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET harus berupa secret acak minimal 32 karakter'),
  FRONTEND_ORIGINS: z.string().default('http://localhost:3000'),
  COOKIE_DOMAIN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const invalidKeys = parsedEnv.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Konfigurasi environment tidak valid: ${invalidKeys}`);
}

const origins = parsedEnv.data.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
const cookieDomain = parsedEnv.data.COOKIE_DOMAIN?.trim();

if (origins.some((origin) => {
  try {
    return new URL(origin).origin !== origin;
  } catch {
    return true;
  }
})) {
  throw new Error('FRONTEND_ORIGINS harus berisi origin valid tanpa path.');
}

if (cookieDomain && (!/^\.?[a-z0-9.-]+$/i.test(cookieDomain) || cookieDomain.includes('..') || cookieDomain.endsWith('.'))) {
  throw new Error('COOKIE_DOMAIN harus berupa domain valid tanpa skema atau path.');
}
if (parsedEnv.data.NODE_ENV === 'production' && origins.some((origin) => !origin.startsWith('https://'))) {
  throw new Error('FRONTEND_ORIGINS production wajib menggunakan HTTPS.');
}

export const ENV = {
  ...parsedEnv.data,
  COOKIE_DOMAIN: cookieDomain || undefined,
  FRONTEND_ORIGINS: origins,
};
