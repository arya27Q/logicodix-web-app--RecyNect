import { db } from '../../config/database.js';
import { Recycler, RecyclerMaterial } from '../../types/index.js';

// Fallback in-memory store jika database MySQL offline saat dev lokal
const inMemoryMaterials = new Map<string, any[]>();
const inMemoryPriceHistories: any[] = [];

// Seed fallback data awal jika diperlukan
const DEFAULT_FALLBACK_MATERIALS = [
  {
    id: 'mat-fb-1',
    recyclerId: 'rec-default',
    categoryId: 'cat-kardus',
    price: 2200,
    unit: 'kg',
    minQuantity: 10,
    qualityRequirements: 'Kering, bersih dari staples tebal, diikat rapi',
    isAvailable: true,
    priceUpdatedAt: new Date().toISOString(),
    category: { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg' },
  },
  {
    id: 'mat-fb-2',
    recyclerId: 'rec-default',
    categoryId: 'cat-pet',
    price: 4200,
    unit: 'kg',
    minQuantity: 5,
    qualityRequirements: 'Bersih, tanpa kotoran tanah, tutup botol dilepas',
    isAvailable: true,
    priceUpdatedAt: new Date().toISOString(),
    category: { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg' },
  },
  {
    id: 'mat-fb-3',
    recyclerId: 'rec-default',
    categoryId: 'cat-minyak',
    price: 6500,
    unit: 'liter',
    minQuantity: 2,
    qualityRequirements: 'Disaring dari sisa remah makanan, jeriken tertutup rapat',
    isAvailable: true,
    priceUpdatedAt: new Date().toISOString(),
    category: { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter' },
  },
];

export class RecyclerRepository {
  /**
   * Mengambil daftar mitra pengelola aktif untuk direktori publik
   */
  public async findActiveRecyclers(): Promise<Recycler[]> {
    try {
      const records = await db.recycler.findMany({
        where: { isActive: true },
        include: {
          materials: {
            where: { isAvailable: true },
            include: { category: true },
          },
        },
      });

      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          name: r.name,
          managementType: r.managementType as any,
          address: r.address,
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          contact: r.contact,
          verificationStatus: r.verificationStatus as any,
          isDemo: r.isDemo,
          isActive: r.isActive,
          materials: r.materials.map((m) => ({
            id: m.id,
            recyclerId: m.recyclerId,
            categoryId: m.categoryId,
            category: m.category ? {
              id: m.category.id,
              name: m.category.name,
              unit: m.category.unit,
              description: m.category.description || undefined,
              isActive: m.category.isActive,
            } : undefined,
            price: Number(m.price),
            unit: m.unit,
            minQuantity: Number(m.minQuantity),
            qualityRequirements: m.qualityRequirements || undefined,
            isAvailable: m.isAvailable,
            priceUpdatedAt: m.priceUpdatedAt.toISOString(),
          })),
        }));
      }
    } catch {
      // Fallback
    }

    return [];
  }

  /**
   * Mengambil detail satu mitra pengelola beserta harga beli materialnya
   */
  public async findById(id: string): Promise<Recycler | null> {
    try {
      const r = await db.recycler.findUnique({
        where: { id },
        include: {
          materials: {
            include: { category: true },
          },
        },
      });

      if (r) {
        return {
          id: r.id,
          name: r.name,
          managementType: r.managementType as any,
          address: r.address,
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          contact: r.contact,
          verificationStatus: r.verificationStatus as any,
          isDemo: r.isDemo,
          isActive: r.isActive,
          materials: r.materials.map((m) => ({
            id: m.id,
            recyclerId: m.recyclerId,
            categoryId: m.categoryId,
            category: m.category ? {
              id: m.category.id,
              name: m.category.name,
              unit: m.category.unit,
              description: m.category.description || undefined,
              isActive: m.category.isActive,
            } : undefined,
            price: Number(m.price),
            unit: m.unit,
            minQuantity: Number(m.minQuantity),
            qualityRequirements: m.qualityRequirements || undefined,
            isAvailable: m.isAvailable,
            priceUpdatedAt: m.priceUpdatedAt.toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }

    return null;
  }

  /**
   * Menemukan profil pengelola berdasarkan ID user akun yang login
   */
  public async findRecyclerByUserId(userId: string): Promise<{ id: string; name: string } | null> {
    try {
      const rec = await db.recycler.findFirst({
        where: {
          OR: [
            { userId },
            { id: userId },
          ],
        },
        select: { id: true, name: true },
      });

      if (rec) return rec;

      // Jika user belum punya record recycler, cek apakah ada recycler default untuk dihubungkan
      const anyRec = await db.recycler.findFirst({
        where: { isActive: true },
        select: { id: true, name: true },
      });
      if (anyRec) return anyRec;
    } catch {
      // Fallback
    }

    return { id: `rec-${userId.slice(0, 8)}`, name: 'Fasilitas Pengelola Mitra' };
  }

  /**
   * Mengambil semua material yang diterima oleh mitra pengelola
   */
  public async findMaterialsByRecyclerId(recyclerId: string): Promise<any[]> {
    try {
      const records = await db.recyclerMaterial.findMany({
        where: { recyclerId },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      if (records && records.length > 0) {
        return records.map((m) => ({
          id: m.id,
          recyclerId: m.recyclerId,
          categoryId: m.categoryId,
          price: Number(m.price),
          unit: m.unit,
          minQuantity: Number(m.minQuantity),
          qualityRequirements: m.qualityRequirements || '',
          isAvailable: m.isAvailable,
          priceUpdatedAt: m.priceUpdatedAt.toISOString(),
          category: m.category ? {
            id: m.category.id,
            name: m.category.name,
            unit: m.category.unit,
          } : undefined,
        }));
      }
    } catch {
      // Fallback
    }

    // In-memory fallback
    if (!inMemoryMaterials.has(recyclerId)) {
      inMemoryMaterials.set(
        recyclerId,
        DEFAULT_FALLBACK_MATERIALS.map((m) => ({ ...m, recyclerId }))
      );
    }
    return inMemoryMaterials.get(recyclerId) || [];
  }

  /**
   * Menambahkan material baru ke daftar penerimaan mitra
   * Sekaligus mencatat histori harga awal di tabel price_histories
   */
  public async createMaterial(data: {
    recyclerId: string;
    categoryId: string;
    price: number;
    unit: string;
    minQuantity?: number;
    qualityRequirements?: string;
    isAvailable?: boolean;
  }): Promise<any> {
    const minQty = data.minQuantity !== undefined ? data.minQuantity : 0;
    const isAvail = data.isAvailable !== undefined ? data.isAvailable : true;
    const qualReq = data.qualityRequirements?.trim() || null;

    try {
      // Cek apakah kategori sudah ada untuk recycler ini
      const existing = await db.recyclerMaterial.findUnique({
        where: {
          recyclerId_categoryId: {
            recyclerId: data.recyclerId,
            categoryId: data.categoryId,
          },
        },
      });

      if (existing) {
        // Jika sudah ada, update harga dan ketersediaannya
        return this.updateMaterial(existing.id, data.recyclerId, {
          price: data.price,
          unit: data.unit,
          minQuantity: minQty,
          qualityRequirements: qualReq || undefined,
          isAvailable: isAvail,
        });
      }

      const newMaterial = await db.recyclerMaterial.create({
        data: {
          recyclerId: data.recyclerId,
          categoryId: data.categoryId,
          price: data.price,
          unit: data.unit,
          minQuantity: minQty,
          qualityRequirements: qualReq,
          isAvailable: isAvail,
          priceUpdatedAt: new Date(),
        },
        include: { category: true },
      });

      // Catat harga awal di price_histories
      await db.priceHistory.create({
        data: {
          recyclerMaterialId: newMaterial.id,
          oldPrice: data.price,
          newPrice: data.price,
        },
      });

      return {
        id: newMaterial.id,
        recyclerId: newMaterial.recyclerId,
        categoryId: newMaterial.categoryId,
        price: Number(newMaterial.price),
        unit: newMaterial.unit,
        minQuantity: Number(newMaterial.minQuantity),
        qualityRequirements: newMaterial.qualityRequirements || '',
        isAvailable: newMaterial.isAvailable,
        priceUpdatedAt: newMaterial.priceUpdatedAt.toISOString(),
        category: newMaterial.category ? {
          id: newMaterial.category.id,
          name: newMaterial.category.name,
          unit: newMaterial.category.unit,
        } : undefined,
      };
    } catch {
      // In-memory fallback
      const store = inMemoryMaterials.get(data.recyclerId) || [];
      const newId = `mat-${Date.now()}`;
      const item = {
        id: newId,
        recyclerId: data.recyclerId,
        categoryId: data.categoryId,
        price: data.price,
        unit: data.unit,
        minQuantity: minQty,
        qualityRequirements: qualReq || '',
        isAvailable: isAvail,
        priceUpdatedAt: new Date().toISOString(),
        category: { id: data.categoryId, name: data.categoryId, unit: data.unit },
      };
      store.unshift(item);
      inMemoryMaterials.set(data.recyclerId, store);
      inMemoryPriceHistories.push({
        id: `ph-${Date.now()}`,
        recyclerMaterialId: newId,
        oldPrice: data.price,
        newPrice: data.price,
        changedAt: new Date(),
      });
      return item;
    }
  }

  /**
   * Memperbarui ketentuan material (harga, minQuantity, syarat mutu, isAvailable)
   * Menyimpan snapshot ke price_histories jika harga berubah
   */
  public async updateMaterial(
    id: string,
    recyclerId: string,
    data: {
      price?: number;
      unit?: string;
      minQuantity?: number;
      qualityRequirements?: string;
      isAvailable?: boolean;
    }
  ): Promise<any> {
    try {
      const existing = await db.recyclerMaterial.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error('Material tidak ditemukan');
      }

      const updatePayload: any = {};
      let priceChanged = false;

      if (data.price !== undefined && Number(data.price) > 0) {
        updatePayload.price = data.price;
        if (Number(existing.price) !== Number(data.price)) {
          priceChanged = true;
          updatePayload.priceUpdatedAt = new Date();
        }
      }

      if (data.unit) updatePayload.unit = data.unit;
      if (data.minQuantity !== undefined) updatePayload.minQuantity = data.minQuantity;
      if (data.qualityRequirements !== undefined) updatePayload.qualityRequirements = data.qualityRequirements;
      if (data.isAvailable !== undefined) updatePayload.isAvailable = data.isAvailable;

      const updated = await db.recyclerMaterial.update({
        where: { id },
        data: updatePayload,
        include: { category: true },
      });

      if (priceChanged && data.price !== undefined) {
        await db.priceHistory.create({
          data: {
            recyclerMaterialId: id,
            oldPrice: existing.price,
            newPrice: data.price,
          },
        });
      }

      return {
        id: updated.id,
        recyclerId: updated.recyclerId,
        categoryId: updated.categoryId,
        price: Number(updated.price),
        unit: updated.unit,
        minQuantity: Number(updated.minQuantity),
        qualityRequirements: updated.qualityRequirements || '',
        isAvailable: updated.isAvailable,
        priceUpdatedAt: updated.priceUpdatedAt.toISOString(),
        category: updated.category ? {
          id: updated.category.id,
          name: updated.category.name,
          unit: updated.category.unit,
        } : undefined,
      };
    } catch (err: any) {
      if (err.message === 'Material tidak ditemukan') throw err;

      // In-memory fallback
      const store = inMemoryMaterials.get(recyclerId) || DEFAULT_FALLBACK_MATERIALS;
      const index = store.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Material tidak ditemukan');

      const existing = store[index];
      const updated = {
        ...existing,
        ...data,
        priceUpdatedAt: new Date().toISOString(),
      };
      store[index] = updated;
      inMemoryMaterials.set(recyclerId, store);
      return updated;
    }
  }

  /**
   * Menghapus material dari daftar penerimaan mitra
   */
  public async deleteMaterial(id: string, recyclerId: string): Promise<boolean> {
    try {
      await db.recyclerMaterial.delete({
        where: { id },
      });
      return true;
    } catch {
      // In-memory fallback
      const store = inMemoryMaterials.get(recyclerId) || [];
      const filtered = store.filter((m) => m.id !== id);
      inMemoryMaterials.set(recyclerId, filtered);
      return true;
    }
  }
}
