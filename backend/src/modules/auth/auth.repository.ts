import { UserRole } from '@prisma/client';
import { db } from '../../config/database.js';

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
} as const;

export class AuthRepository {
  public findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  public findAdminByEmail(email: string) {
    return db.admin.findUnique({ where: { email } });
  }

  public findById(id: string) {
    return db.user.findUnique({ where: { id }, select: publicUserFields });
  }

  public findCredentialsById(id: string) {
    return db.user.findUnique({ where: { id }, select: { id: true, password: true } });
  }

  public updatePassword(id: string, password: string) {
    return db.user.update({
      where: { id },
      data: { password, authVersion: { increment: 1 } },
      select: publicUserFields,
    });
  }

  public createUser(data: { name: string; email: string; phone: string; password: string }) {
    return db.user.create({
      data: { ...data, role: UserRole.user },
      select: { ...publicUserFields, authVersion: true },
    });
  }
}
