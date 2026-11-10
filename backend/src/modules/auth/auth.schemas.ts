import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Format email tidak sesuai (contoh: nama@domain.com).')
  .max(191, 'Email maksimal 191 karakter.');

const registerPassword = z
  .string()
  .min(8, 'Kata sandi pendaftaran minimal 8 karakter.')
  .max(128, 'Kata sandi maksimal 128 karakter.');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter.').max(100, 'Nama maksimal 100 karakter.'),
    email,
    phone: z
      .string()
      .trim()
      .min(8, 'Nomor telepon minimal 8 digit.')
      .max(30, 'Nomor telepon maksimal 30 digit.')
      .regex(/^\+?[0-9\s()-]+$/, 'Format nomor telepon tidak sesuai.'),
    password: registerPassword,
  })
  .strict();

export const loginSchema = z
  .object({
    email,
    password: z
      .string()
      .min(1, 'Kata sandi wajib diisi.')
      .max(128, 'Kata sandi maksimal 128 karakter.'),
    portal: z.enum(['warga', 'pengelola', 'admin'] as const).optional(),
  })
  .strict();

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Kata sandi saat ini wajib diisi.').max(128),
    newPassword: registerPassword,
  })
  .strict()
  .refine((value) => value.currentPassword !== value.newPassword, {
    path: ['newPassword'],
    message: 'Kata sandi baru harus berbeda dari kata sandi saat ini.',
  });

export const verificationSchema = z
  .object({
    status: z.enum(['verified', 'rejected'] as const),
  })
  .strict();


