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

export const registerRecyclerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama penanggung jawab minimal 2 karakter.').max(100, 'Nama maksimal 100 karakter.'),
    facilityName: z.string().trim().min(3, 'Nama fasilitas pengelola minimal 3 karakter.').max(150, 'Nama fasilitas maksimal 150 karakter.'),
    managementType: z.enum(['bank_sampah', 'pengepul', 'tps3r', 'recycler_industry'] as const, {
      message: 'Pilih jenis pengelola yang valid (Bank Sampah, Pengepul, TPS3R, atau Industri).',
    }),
    email,
    phone: z
      .string()
      .trim()
      .min(8, 'Nomor telepon minimal 8 digit.')
      .max(30, 'Nomor telepon maksimal 30 digit.')
      .regex(/^\+?[0-9\s()-]+$/, 'Format nomor telepon tidak sesuai.'),
    address: z.string().trim().min(5, 'Alamat fasilitas minimal 5 karakter.').max(500, 'Alamat fasilitas maksimal 500 karakter.'),
    operatingHours: z.string().trim().max(150, 'Jam operasional maksimal 150 karakter.').optional(),
    password: registerPassword,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email,
    newPassword: registerPassword,
    portal: z.enum(['warga', 'pengelola', 'admin'] as const).optional(),
  })
  .strict();

const loginIdentifier = z
  .string()
  .trim()
  .min(3, 'Email atau nomor telepon minimal 3 karakter.')
  .max(191, 'Email atau nomor telepon maksimal 191 karakter.');

export const loginSchema = z
  .object({
    email: loginIdentifier,
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

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter.').max(100, 'Nama maksimal 100 karakter.').optional(),
    phone: z
      .string()
      .trim()
      .min(8, 'Nomor telepon minimal 8 digit.')
      .max(30, 'Nomor telepon maksimal 30 digit.')
      .regex(/^\+?[0-9\s()-]+$/, 'Format nomor telepon tidak sesuai.')
      .optional(),
    facilityName: z.string().trim().min(2).max(150).optional(),
    managementType: z.enum(['bank_sampah', 'pengepul', 'tps3r', 'recycler_industry'] as const).optional(),
    address: z.string().trim().min(5).max(500).optional(),
    operatingHours: z.string().trim().max(150).optional(),
    description: z.string().trim().max(1000).optional(),
  })
  .strict();

export const verificationSchema = z
  .object({
    status: z.enum(['verified', 'rejected'] as const),
  })
  .strict();


