import { VerificationStatus } from '@prisma/client';
import { db } from '../../config/database.js';

const publicAdminFields = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export class AdminRepository {
  public async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    let admin = await db.admin.findUnique({ where: { email: cleanEmail } });
    if (admin) return admin;

    if (rawEmail !== cleanEmail) {
      admin = await db.admin.findUnique({ where: { email: rawEmail } });
      if (admin) return admin;
    }

    return db.admin.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: rawEmail },
        ],
      },
    });
  }

  public async findUserByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    let user = await db.user.findUnique({ where: { email: cleanEmail }, select: { id: true, role: true } });
    if (user) return user;

    if (rawEmail !== cleanEmail) {
      user = await db.user.findUnique({ where: { email: rawEmail }, select: { id: true, role: true } });
      if (user) return user;
    }

    return db.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: rawEmail },
        ],
      },
      select: { id: true, role: true },
    });
  }

  public findById(id: string) {
    return db.admin.findUnique({ where: { id }, select: publicAdminFields });
  }

  public updateRecyclerVerification(id: string, status: VerificationStatus) {
    return db.recycler.update({
      where: { id },
      data: { verificationStatus: status, isActive: status === VerificationStatus.verified },
      select: { id: true, verificationStatus: true, isActive: true },
    });
  }

  public findPendingRecyclers() {
    return db.recycler.findMany({
      where: { verificationStatus: VerificationStatus.pending },
      select: { id: true, name: true, managementType: true, address: true, contact: true, createdAt: true },
    });
  }
}
