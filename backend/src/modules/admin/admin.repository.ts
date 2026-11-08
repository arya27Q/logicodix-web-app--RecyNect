// Khusus query database tabel 'admins' dan aksi administratif
export class AdminRepository {
  public async findByEmail(email: string) {
    // TODO: Query Prisma `db.admin.findUnique({ where: { email } })`
    return null;
  }

  public async updateRecyclerVerification(id: string, status: 'verified' | 'rejected') {
    // TODO: Query Prisma `db.recycler.update({ where: { id }, data: { verificationStatus: status } })`
    return { id, verificationStatus: status };
  }

  public async findPendingRecyclers() {
    // TODO: Query Prisma `db.recycler.findMany({ where: { verificationStatus: 'pending' } })`
    return [];
  }
}
