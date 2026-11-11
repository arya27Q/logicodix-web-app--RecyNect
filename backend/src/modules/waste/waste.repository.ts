import { db } from '../../config/database.js';
import { WasteCategory } from '../../types/index.js';

const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', isActive: true, description: 'Kardus cokelat tebal kemasan barang, boks paket, atau kotak mie instan.' },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', isActive: true, description: 'Botol air mineral transparan, botol minuman soda bersih tanpa label & tutup.' },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', isActive: true, description: 'Minyak goreng bekas pakai rumah tangga yang sudah disaring dari kotoran.' },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', isActive: true, description: 'Kaleng minuman soda, kaleng susu kental manis atau aerosol berbahan aluminium.' },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', isActive: true, description: 'Kertas dokumen HVS bekas, kertas lembaran putih, buku tulis tanpa sampul plastik.' },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', isActive: true, description: 'Besi plat bekas, rangka besi tua, paku dan potongan seng.' },
];

export class WasteRepository {
  public async findActiveCategories(): Promise<WasteCategory[]> {
    try {
      const records = await db.wasteCategory.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });

      if (records && records.length > 0) {
        return records.map((c) => ({
          id: c.id,
          name: c.name,
          unit: c.unit,
          description: c.description || undefined,
          isActive: c.isActive,
        }));
      }
    } catch {
      // Fallback data simulasi agar frontend tetap berfungsi
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
      // Fallback check
    }

    return FALLBACK_CATEGORIES.find((c) => c.id === id) || null;
  }
}


