import { WasteCategory } from '../../types/index.js';

// Khusus query database tabel 'waste_categories'
export class WasteRepository {
  public async findActiveCategories(): Promise<WasteCategory[]> {
    // TODO: Query Prisma `db.wasteCategory.findMany({ where: { isActive: true } })`
    return [];
  }

  public async findById(id: string): Promise<WasteCategory | null> {
    // TODO: Query Prisma `db.wasteCategory.findUnique({ where: { id } })`
    return null;
  }
}

