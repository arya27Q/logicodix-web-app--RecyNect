// Khusus query database tabel 'users'
export class AuthRepository {
  public async findByEmail(email: string) {
    // TODO: Query Prisma `db.user.findUnique({ where: { email } })`
    return null;
  }

  public async findById(id: string) {
    // TODO: Query Prisma `db.user.findUnique({ where: { id } })`
    return null;
  }

  public async createUser(data: any) {
    // TODO: Query Prisma `db.user.create({ data })`
    return { id: 'new-user-id', ...data };
  }
}

