import 'dotenv/config';
import process from 'node:process';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hashPassword } from '../src/security/password.js';

const prisma = new PrismaClient();
const schema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(100),
  ADMIN_EMAIL: z.string().trim().toLowerCase().email().max(191),
  ADMIN_PASSWORD: z.string().min(12).max(128),
});

async function main() {
  const result = schema.safeParse(process.env);
  if (!result.success) throw new Error('ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD wajib diisi dengan format valid.');

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = result.data;
  const password = await hashPassword(ADMIN_PASSWORD);
  const account = await prisma.admin.create({
    data: { name: ADMIN_NAME, email: ADMIN_EMAIL, password, role: 'admin' },
    select: { id: true, email: true },
  });
  process.stdout.write(`Administrator dibuat: ${account.email}\n`);
}

main()
  .catch(() => {
    process.stderr.write('Gagal membuat administrator. Periksa konfigurasi dan pastikan email belum terdaftar.\n');
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
