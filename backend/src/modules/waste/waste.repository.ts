import { db } from '../../config/database.js';
import { WasteCategory } from '../../types/index.js';

const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', description: 'Kardus cokelat tebal kemasan barang, boks paket.', isActive: true },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', description: 'Botol air mineral transparan tanpa tutup & label.', isActive: true },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', description: 'Minyak goreng bekas pakai rumah tangga yang disaring.', isActive: true },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', description: 'Kaleng minuman ringan berbahan aluminium.', isActive: true },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', description: 'Kertas dokumen HVS bekas tanpa jilid tebal.', isActive: true },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', description: 'Puing besi tua dan logam campuran.', isActive: true },
];

export class WasteRepository {
  public async findActiveCategories(): Promise<WasteCategory[]> {
    try {
      const records = await db.wasteCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });

      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          name: r.name,
          unit: r.unit,
          description: r.description || undefined,
          isActive: r.isActive,
        }));
      }
    } catch {
      // Fallback data jika koneksi DB belum siap
    }

    return FALLBACK_CATEGORIES;
  }

  public async findById(id: string): Promise<WasteCategory | null> {
    try {
      const record = await db.wasteCategory.findUnique({ where: { id } });
      if (record) {
        return {
          id: record.id,
          name: record.name,
          unit: record.unit,
          description: record.description || undefined,
          isActive: record.isActive,
        };
      }
    } catch {
      // Fallback
    }

    return FALLBACK_CATEGORIES.find((c) => c.id === id) || null;
  }
}
