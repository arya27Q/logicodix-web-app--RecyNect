import { db } from '../../config/database.js';
import { Recycler } from '../../types/index.js';

const FALLBACK_RECYCLERS: Recycler[] = [
  {
    id: 'rec-banksampah-1',
    name: 'Bank Sampah Berkah Mandiri',
    managementType: 'bank_sampah',
    address: 'Jl. Merdeka No. 12, Kel. Sukajaya, Bandung',
    latitude: -6.914744,
    longitude: 107.60981,
    contact: '081298765432',
    verificationStatus: 'verified',
    isDemo: true,
    isActive: true,
    materials: [
      {
        id: 'mat-bs-1',
        recyclerId: 'rec-banksampah-1',
        categoryId: 'cat-kardus',
        price: 2000,
        unit: 'kg',
        minQuantity: 1.0,
        qualityRequirements: 'Kering, bersih dari staples tebal, diikat rapi',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'mat-bs-2',
        recyclerId: 'rec-banksampah-1',
        categoryId: 'cat-pet',
        price: 3500,
        unit: 'kg',
        minQuantity: 0.5,
        qualityRequirements: 'Dipipihkan, tanpa tutup botol, bersih',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'mat-bs-3',
        recyclerId: 'rec-banksampah-1',
        categoryId: 'cat-minyak',
        price: 6500,
        unit: 'liter',
        minQuantity: 1.0,
        qualityRequirements: 'Disaring dari sisa remah makanan, jeriken tertutup',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'rec-pengepul-1',
    name: 'Pengepul Logam & Plastik Jaya Abadi',
    managementType: 'pengepul',
    address: 'Jl. Raya Kopo No. 88, Bandung',
    latitude: -6.932451,
    longitude: 107.592143,
    contact: '085712348899',
    verificationStatus: 'verified',
    isDemo: true,
    isActive: true,
    materials: [
      {
        id: 'mat-p-1',
        recyclerId: 'rec-pengepul-1',
        categoryId: 'cat-pet',
        price: 4200,
        unit: 'kg',
        minQuantity: 3.0,
        qualityRequirements: 'Bersih, tanpa kotoran tanah/tutup botol dilepas',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'mat-p-2',
        recyclerId: 'rec-pengepul-1',
        categoryId: 'cat-kardus',
        price: 1800,
        unit: 'kg',
        minQuantity: 5.0,
        qualityRequirements: 'Kering dan terikat rapi',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'mat-p-3',
        recyclerId: 'rec-pengepul-1',
        categoryId: 'cat-alum',
        price: 12000,
        unit: 'kg',
        minQuantity: 1.0,
        qualityRequirements: 'Kaleng bersih tidak tercampur pasir',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'rec-tps3r-1',
    name: 'TPS3R Resik Barokah Kelurahan',
    managementType: 'tps3r',
    address: 'Jl. Terusan Buah Batu No. 45, Bandung',
    latitude: -6.960124,
    longitude: 107.632115,
    contact: '082155443322',
    verificationStatus: 'verified',
    isDemo: true,
    isActive: true,
    materials: [
      {
        id: 'mat-t-1',
        recyclerId: 'rec-tps3r-1',
        categoryId: 'cat-kardus',
        price: 1600,
        unit: 'kg',
        minQuantity: 2.0,
        qualityRequirements: 'Kering',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'mat-t-2',
        recyclerId: 'rec-tps3r-1',
        categoryId: 'cat-hvs',
        price: 2500,
        unit: 'kg',
        minQuantity: 2.0,
        qualityRequirements: 'Kertas bersih tanpa jilid kawat besar',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'rec-industri-1',
    name: 'PT Daur Ulang Nusantara (Pabrik Peleburan)',
    managementType: 'recycler_industry',
    address: 'Kawasan Industri Cimareme Blok C No. 5, Bandung Barat',
    latitude: -6.878901,
    longitude: 107.512345,
    contact: '022-6868990',
    verificationStatus: 'verified',
    isDemo: true,
    isActive: true,
    materials: [
      {
        id: 'mat-ind-1',
        recyclerId: 'rec-industri-1',
        categoryId: 'cat-pet',
        price: 4800,
        unit: 'kg',
        minQuantity: 50.0,
        qualityRequirements: 'Grade A, sudah dicuci dan dipres kubus bal',
        isAvailable: true,
        priceUpdatedAt: new Date().toISOString(),
      },
    ],
  },
];

export class RecyclerRepository {
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

    return FALLBACK_RECYCLERS;
  }

  public async findById(id: string): Promise<Recycler | null> {
    try {
      const r = await db.recycler.findUnique({
        where: { id },
        include: {
          materials: {
            where: { isAvailable: true },
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

    return FALLBACK_RECYCLERS.find((r) => r.id === id) || null;
  }

  public async findRecyclerByUserId(userId: string) {
    try {
      let recycler = await db.recycler.findFirst({
        where: { userId },
      });
      if (!recycler) {
        recycler = await db.recycler.findUnique({
          where: { id: userId },
        });
      }
      return recycler;
    } catch {
      return null;
    }
  }

  public async getMaterialsForRecycler(recyclerId: string) {
    try {
      const materials = await db.recyclerMaterial.findMany({
        where: { recyclerId },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      return materials.map((m) => ({
        id: m.id,
        name: m.category?.name || 'Material',
        category: m.category?.name || 'Umum',
        categoryId: m.categoryId,
        pricePerUnit: Number(m.price),
        unit: m.unit,
        minQuantity: Number(m.minQuantity),
        qualityRequirements: m.qualityRequirements || '',
        isAccepting: m.isAvailable,
        priceUpdatedAt: m.priceUpdatedAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }

  public async createMaterial(recyclerId: string, data: {
    categoryId?: string;
    name?: string;
    category?: string;
    price: number;
    unit?: string;
    minQuantity?: number;
    qualityRequirements?: string;
    isAvailable?: boolean;
  }) {
    let unit = data.unit?.trim();
    let categoryId = data.categoryId;

    if (categoryId) {
      const existingCat = await db.wasteCategory.findUnique({ where: { id: categoryId } });
      if (!existingCat) {
        categoryId = undefined;
      } else if (!unit) {
        unit = existingCat.unit;
      }
    }

    // Jika categoryId belum ada atau user memasukkan nama material/kategori custom
    if (!categoryId) {
      const candidateName = data.name?.trim() || data.category?.trim() || 'Material Daur Ulang';
      const existingByName = await db.wasteCategory.findFirst({
        where: { name: candidateName },
      });

      if (existingByName) {
        categoryId = existingByName.id;
        if (!unit) unit = existingByName.unit;
      } else {
        const rawSlug = candidateName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const newCat = await db.wasteCategory.create({
          data: {
            name: candidateName,
            slug: `${rawSlug}-${Date.now().toString().slice(-4)}`,
            unit: unit || 'kg',
            isActive: true,
          },
        });
        categoryId = newCat.id;
      }
    }

    if (!unit) {
      unit = 'kg';
    }

    // Jika mitra memasukkan nama kustom yang berbeda dari nama kategori master
    if (data.name && categoryId) {
      const currentCat = await db.wasteCategory.findUnique({ where: { id: categoryId } });
      if (currentCat && currentCat.name.length < 5 && data.name.trim().length > currentCat.name.length) {
        await db.wasteCategory.update({
          where: { id: categoryId },
          data: { name: data.name.trim() },
        }).catch(() => null);
      }
    }

    const price = data.price;
    const minQuantity = data.minQuantity ?? 0;
    const qualityRequirements = data.qualityRequirements?.trim() || null;
    const isAvailable = data.isAvailable ?? true;

    const record = await db.recyclerMaterial.upsert({
      where: {
        recyclerId_categoryId: {
          recyclerId,
          categoryId,
        },
      },
      update: {
        price,
        unit,
        minQuantity,
        qualityRequirements,
        isAvailable,
        priceUpdatedAt: new Date(),
      },
      create: {
        recyclerId,
        categoryId,
        price,
        unit,
        minQuantity,
        qualityRequirements,
        isAvailable,
      },
      include: { category: true },
    });

    await db.priceHistory.create({
      data: {
        recyclerMaterialId: record.id,
        oldPrice: price,
        newPrice: price,
      },
    }).catch(() => null);

    return {
      id: record.id,
      name: record.category?.name || data.name || 'Material',
      category: record.category?.name || 'Umum',
      categoryId: record.categoryId,
      pricePerUnit: Number(record.price),
      unit: record.unit,
      minQuantity: Number(record.minQuantity),
      qualityRequirements: record.qualityRequirements || '',
      isAccepting: record.isAvailable,
      priceUpdatedAt: record.priceUpdatedAt.toISOString(),
    };
  }

  public async updateMaterial(id: string, recyclerId: string, data: {
    name?: string;
    price?: number;
    unit?: string;
    minQuantity?: number;
    qualityRequirements?: string;
    isAvailable?: boolean;
  }) {
    const existing = await db.recyclerMaterial.findFirst({
      where: { id, recyclerId },
      include: { category: true },
    });
    if (!existing) {
      throw new Error('Material tidak ditemukan atau Anda tidak memiliki akses.');
    }

    if (data.name && data.name.trim() && existing.categoryId) {
      await db.wasteCategory.update({
        where: { id: existing.categoryId },
        data: { name: data.name.trim() },
      }).catch(() => null);
    }

    const updateData: any = {};
    if (data.price !== undefined) {
      updateData.price = data.price;
      updateData.priceUpdatedAt = new Date();
    }
    if (data.unit !== undefined) updateData.unit = data.unit.trim();
    if (data.minQuantity !== undefined) updateData.minQuantity = data.minQuantity;
    if (data.qualityRequirements !== undefined) updateData.qualityRequirements = data.qualityRequirements.trim();
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

    const record = await db.recyclerMaterial.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    if (data.price !== undefined && Number(existing.price) !== Number(data.price)) {
      await db.priceHistory.create({
        data: {
          recyclerMaterialId: record.id,
          oldPrice: Number(existing.price),
          newPrice: data.price,
        },
      }).catch(() => null);
    }

    return {
      id: record.id,
      name: record.category?.name || data.name || 'Material',
      category: record.category?.name || 'Umum',
      categoryId: record.categoryId,
      pricePerUnit: Number(record.price),
      unit: record.unit,
      minQuantity: Number(record.minQuantity),
      qualityRequirements: record.qualityRequirements || '',
      isAccepting: record.isAvailable,
      priceUpdatedAt: record.priceUpdatedAt.toISOString(),
    };
  }

  public async deleteMaterial(id: string, recyclerId: string) {
    const existing = await db.recyclerMaterial.findFirst({
      where: {
        recyclerId,
        OR: [
          { id },
          { categoryId: id },
        ],
      },
    });
    if (!existing) {
      throw new Error('Material tidak ditemukan atau Anda tidak memiliki akses.');
    }

    const targetId = existing.id;

    // Bersihkan relasi foreign key terlebih dahulu agar tidak terjadi constraint violation
    await db.matchingAssignment.deleteMany({
      where: { recyclerMaterialId: targetId },
    }).catch(() => null);

    await db.priceHistory.deleteMany({
      where: { recyclerMaterialId: targetId },
    }).catch(() => null);

    await db.recyclerMaterial.delete({
      where: { id: targetId },
    });

    return true;
  }

  public async getIncomingDeliveries(recyclerId: string) {
    try {
      const rows = await db.$queryRawUnsafe<any[]>(
        `SELECT * FROM incoming_deliveries WHERE recycler_id = ? ORDER BY created_at DESC`,
        recyclerId
      );

      return rows.map((r) => {
        let materials: any[] = [];
        try {
          materials = JSON.parse(r.materials_summary || '[]');
        } catch {
          materials = [];
        }

        return {
          id: r.delivery_code || r.id,
          internalId: r.id,
          citizenName: r.citizen_name,
          citizenPhone: r.citizen_phone,
          materials,
          totalEstimatedWeight: r.total_estimated_weight,
          estimatedPayoutRp: Number(r.estimated_payout_rp),
          actualWeight: r.actual_weight !== null ? Number(r.actual_weight) : null,
          actualPayoutRp: r.actual_payout_rp !== null ? Number(r.actual_payout_rp) : null,
          arrivalTime: r.arrival_time,
          status: r.status,
          notes: r.notes || '',
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        };
      });
    } catch (err) {
      console.error('Error fetching incoming deliveries:', err);
      return [];
    }
  }

  public async updateDeliveryStatus(id: string, recyclerId: string, data: {
    status: string;
    actualWeight?: number;
    actualPayoutRp?: number;
    notes?: string;
  }) {
    const status = data.status;
    const actualWeight = data.actualWeight !== undefined ? data.actualWeight : null;
    const actualPayoutRp = data.actualPayoutRp !== undefined ? data.actualPayoutRp : null;
    const notes = data.notes !== undefined ? data.notes : null;

    await db.$executeRawUnsafe(
      `UPDATE incoming_deliveries 
       SET status = ?, 
           actual_weight = COALESCE(?, actual_weight),
           actual_payout_rp = COALESCE(?, actual_payout_rp),
           notes = COALESCE(?, notes),
           updated_at = NOW(3)
       WHERE (id = ? OR delivery_code = ?) AND recycler_id = ?`,
      status, actualWeight, actualPayoutRp, notes, id, id, recyclerId
    );

    const updated = await db.$queryRawUnsafe<any[]>(
      `SELECT * FROM incoming_deliveries WHERE (id = ? OR delivery_code = ?) AND recycler_id = ? LIMIT 1`,
      id, id, recyclerId
    );

    if (!updated || updated.length === 0) {
      throw new Error('Data setoran tidak ditemukan.');
    }

    const r = updated[0];
    let materials: any[] = [];
    try {
      materials = JSON.parse(r.materials_summary || '[]');
    } catch {
      materials = [];
    }

    return {
      id: r.delivery_code || r.id,
      internalId: r.id,
      citizenName: r.citizen_name,
      citizenPhone: r.citizen_phone,
      materials,
      totalEstimatedWeight: r.total_estimated_weight,
      estimatedPayoutRp: Number(r.estimated_payout_rp),
      actualWeight: r.actual_weight !== null ? Number(r.actual_weight) : null,
      actualPayoutRp: r.actual_payout_rp !== null ? Number(r.actual_payout_rp) : null,
      arrivalTime: r.arrival_time,
      status: r.status,
      notes: r.notes || '',
    };
  }

  public async createIncomingDelivery(data: {
    recyclerId: string;
    citizenId?: string;
    sessionId?: string;
    citizenName: string;
    citizenPhone: string;
    materials: any[];
    totalEstimatedWeight: string;
    estimatedPayoutRp: number;
    arrivalTime: string;
    notes?: string;
  }) {
    const id = `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const deliveryCode = `RCV-${Math.floor(1000 + Math.random() * 9000)}`;
    const materialsSummary = JSON.stringify(data.materials || []);

    await db.$executeRawUnsafe(
      `INSERT INTO incoming_deliveries (
        id, delivery_code, recycler_id, citizen_id, session_id,
        citizen_name, citizen_phone, materials_summary, total_estimated_weight,
        estimated_payout_rp, arrival_time, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'antre', ?)`,
      id, deliveryCode, data.recyclerId, data.citizenId || null, data.sessionId || null,
      data.citizenName, data.citizenPhone, materialsSummary, data.totalEstimatedWeight,
      data.estimatedPayoutRp, data.arrivalTime, data.notes || null
    );

    return {
      id: deliveryCode,
      internalId: id,
      deliveryCode,
      citizenName: data.citizenName,
      citizenPhone: data.citizenPhone,
      materials: data.materials,
      totalEstimatedWeight: data.totalEstimatedWeight,
      estimatedPayoutRp: data.estimatedPayoutRp,
      arrivalTime: data.arrivalTime,
      status: 'antre',
      notes: data.notes || '',
    };
  }
}


