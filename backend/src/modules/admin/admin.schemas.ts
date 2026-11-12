import { z } from 'zod';

export const updateRecyclerStatusSchema = z
  .object({
    isActive: z.boolean().optional(),
    isDemo: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu status pengelola harus diisi.',
  });

export const updateAdminProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama lengkap minimal 2 karakter.')
      .max(100, 'Nama maksimal 100 karakter.'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Format email tidak sesuai (contoh: nama@recynect.id).')
      .max(191, 'Email maksimal 191 karakter.'),
  })
  .strict();

export type UpdateRecyclerStatusInput = z.infer<typeof updateRecyclerStatusSchema>;
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;

