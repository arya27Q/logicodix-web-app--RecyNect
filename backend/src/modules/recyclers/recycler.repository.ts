import { Recycler } from '../../types/index.js';

// Khusus query database tabel 'recyclers' dan relasi 'recycler_materials'
export class RecyclerRepository {
  public async findActiveRecyclers(): Promise<Recycler[]> {
    // TODO: Query Prisma `db.recycler.findMany({ where: { isActive: true }, include: { materials: true } })`
    return [];
  }

  public async findById(id: string): Promise<Recycler | null> {
    // TODO: Query Prisma `db.recycler.findUnique({ where: { id }, include: { materials: true } })`
    return null;
  }
}

