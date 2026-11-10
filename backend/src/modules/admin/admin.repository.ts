import { VerificationStatus } from '@prisma/client';
import { db } from '../../config/database.js';

const publicAdminFields = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export class AdminRepository {
  public findByEmail(email: string) {
    return db.admin.findUnique({ where: { email } });
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
