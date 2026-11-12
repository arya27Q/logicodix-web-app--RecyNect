import { z } from 'zod';

export const createCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama kategori minimal 2 karakter.')
      .max(100, 'Nama kategori maksimal 100 karakter.'),
    unit: z
      .string()
      .trim()
      .min(1, 'Satuan baku wajib diisi.')
      .max(20, 'Satuan baku maksimal 20 karakter.'),
    description: z
      .string()
      .trim()
      .max(1000, 'Deskripsi maksimal 1000 karakter.')
      .optional()
      .nullable(),
    icon: z.string().trim().max(255).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama kategori minimal 2 karakter.')
      .max(100, 'Nama kategori maksimal 100 karakter.')
      .optional(),
    unit: z
      .string()
      .trim()
      .min(1, 'Satuan baku wajib diisi.')
      .max(20, 'Satuan baku maksimal 20 karakter.')
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, 'Deskripsi maksimal 1000 karakter.')
      .optional()
      .nullable(),
    icon: z.string().trim().max(255).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk pembaruan kategori.',
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

