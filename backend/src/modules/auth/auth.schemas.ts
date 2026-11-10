import { z } from 'zod';

const email = z.string().trim().toLowerCase().email().max(191);
const password = z.string().min(12).max(128);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  phone: z.string().trim().min(8).max(30).regex(/^\+?[0-9\s()-]+$/),
  password,
}).strict();

export const loginSchema = z.object({ email, password }).strict();

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: password,
}).strict().refine((value) => value.currentPassword !== value.newPassword, {
  path: ['newPassword'],
  message: 'Kata sandi baru harus berbeda dari kata sandi saat ini.',
});

export const verificationSchema = z.object({
  status: z.enum(['verified', 'rejected']),
}).strict();
