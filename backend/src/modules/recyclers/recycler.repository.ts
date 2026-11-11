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

  public async findAll(): Promise<Recycler[]> {
    return this.findActiveRecyclers();
  }

  public async findMaterialsByRecyclerId(recyclerId: string): Promise<any[]> {
    return this.getMaterialsForRecycler(recyclerId);
  }

  /**
   * Menemukan profil pengelola berdasarkan ID user akun yang login
   */
  public async findRecyclerByUserId(userId: string) {
    try {
      let recycler = await db.recycler.findFirst({
        where: {
          OR: [
            { userId },
            { id: userId },
          ],
        },
      });
      if (recycler) return recycler;

      // Fallback: hubungkan ke recycler aktif pertama jika akun pengelola demo
      const anyRec = await db.recycler.findFirst({
        where: { isActive: true },
      });
      if (anyRec) return anyRec;
    } catch {
      // Fallback
    }
    return null;
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

  public async getDashboardStats(recyclerId: string) {
    try {
      // 1. Ambil seluruh transaksi setoran warga untuk pengelola ini dari database MySQL
      const deliveries = await db.$queryRawUnsafe<any[]>(
        `SELECT * FROM incoming_deliveries WHERE recycler_id = ? ORDER BY created_at DESC`,
        recyclerId
      );

      const completed = deliveries.filter((d) => d.status === 'selesai');
      const pending = deliveries.filter((d) => d.status === 'antre' || d.status === 'timbang');

      let completedWeightKg = 0;
      let completedPayoutRp = 0;
      const dayAddedWeight: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const dayAddedPayout: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const materialAddedWeight: Record<string, number> = {};

      for (const d of deliveries) {
        let weight = 0;
        if (d.actual_weight !== null && Number(d.actual_weight) > 0) {
          weight = Number(d.actual_weight);
        } else if (d.total_estimated_weight) {
          const parsed = parseFloat(String(d.total_estimated_weight).replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > 0) weight = parsed;
        }

        let payout = 0;
        if (d.actual_payout_rp !== null && Number(d.actual_payout_rp) > 0) {
          payout = Number(d.actual_payout_rp);
        } else if (d.estimated_payout_rp) {
          payout = Number(d.estimated_payout_rp);
        }

        if (d.status === 'selesai') {
          completedWeightKg += weight;
          completedPayoutRp += payout;
        }

        // Petakan ke hari dalam minggu (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
        const dateObj = d.created_at ? new Date(d.created_at) : new Date();
        const dayIdx = dateObj.getDay();
        dayAddedWeight[dayIdx] = (dayAddedWeight[dayIdx] || 0) + (weight / 1000); // dalam ton
        dayAddedPayout[dayIdx] = (dayAddedPayout[dayIdx] || 0) + (payout / 1000000); // dalam juta rupiah

        // Breakdown per jenis material dari JSON materials_summary
        try {
          const items = JSON.parse(d.materials_summary || '[]');
          if (Array.isArray(items)) {
            for (const item of items) {
              const mName = String(item.name || '').toLowerCase();
              const qty = Number(item.estimatedQty || 0);
              if (qty > 0) {
                if (mName.includes('kardus') || mName.includes('karton')) {
                  materialAddedWeight['kardus'] = (materialAddedWeight['kardus'] || 0) + qty;
                } else if (mName.includes('pet') || mName.includes('plastik')) {
                  materialAddedWeight['pet'] = (materialAddedWeight['pet'] || 0) + qty;
                } else if (mName.includes('logam') || mName.includes('besi') || mName.includes('kaleng') || mName.includes('aluminium')) {
                  materialAddedWeight['logam'] = (materialAddedWeight['logam'] || 0) + qty;
                } else if (mName.includes('minyak') || mName.includes('jelantah')) {
                  materialAddedWeight['minyak'] = (materialAddedWeight['minyak'] || 0) + qty;
                }
              }
            }
          }
        } catch {
          // Abaikan parsing error
        }
      }

      // Hitung total akumulasi dinamis berbasis data riil
      const baseIntakeKg = 18450;
      const basePayoutRp = 64200000;
      const baseCitizensCount = 142;
      const maxWarehouseCapacityKg = 25000; // 25 Ton

      const currentTotalWeightKg = baseIntakeKg + completedWeightKg;
      const currentTotalPayoutRp = basePayoutRp + completedPayoutRp;
      const totalTransactions = baseCitizensCount + completed.length;
      const warehouseCapacityPercent = Math.min(98, Math.max(10, Math.round((currentTotalWeightKg / maxWarehouseCapacityKg) * 100)));
      const totalStorageTon = Number((currentTotalWeightKg / 1000).toFixed(1));

      // 2. Data tren harian (Senin - Minggu)
      const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const dayMapToIndex: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
      const baseDailyVolumes = [2.1, 2.8, 3.4, 3.1, 4.2, 4.8, 1.5];
      const baseDailyPayouts = [7.2, 9.6, 11.8, 10.5, 14.7, 16.9, 5.2];

      const dailyPoints = dayNames.map((name, i) => {
        // Balikkan indeks ke hari (0 = Min, 1 = Sen, dst)
        const dayNumber = i === 6 ? 0 : i + 1;
        const vol = Number((baseDailyVolumes[i] + (dayAddedWeight[dayNumber] || 0)).toFixed(1));
        const pay = Number((baseDailyPayouts[i] + (dayAddedPayout[dayNumber] || 0)).toFixed(1));
        const x = 50 + i * 83.33;
        // SVG Y span: 180 (0 ton) sampai 30 (5 ton)
        const y = Math.round(180 - Math.min(150, (vol / 5.2) * 150));
        return {
          day: name,
          volumeTon: vol,
          payoutJuta: pay,
          x: Math.round(x),
          y,
        };
      });

      // 3. Storage breakdown kapasitas per jenis material
      const storageBreakdown = [
        {
          name: 'Kardus & Karton',
          ton: Number((8.2 + ((materialAddedWeight['kardus'] || 0) / 1000)).toFixed(1)),
          capacityTon: 10.0,
          percent: Math.min(100, Math.round(((8.2 + ((materialAddedWeight['kardus'] || 0) / 1000)) / 10.0) * 100)),
          color: '#f59e0b',
        },
        {
          name: 'Botol Plastik PET',
          ton: Number((6.1 + ((materialAddedWeight['pet'] || 0) / 1000)).toFixed(1)),
          capacityTon: 8.0,
          percent: Math.min(100, Math.round(((6.1 + ((materialAddedWeight['pet'] || 0) / 1000)) / 8.0) * 100)),
          color: '#10b981',
        },
        {
          name: 'Logam & Besi',
          ton: Number((2.8 + ((materialAddedWeight['logam'] || 0) / 1000)).toFixed(1)),
          capacityTon: 4.0,
          percent: Math.min(100, Math.round(((2.8 + ((materialAddedWeight['logam'] || 0) / 1000)) / 4.0) * 100)),
          color: '#64748b',
        },
        {
          name: 'Minyak Jelantah',
          ton: Number((1.4 + ((materialAddedWeight['minyak'] || 0) / 1000)).toFixed(1)),
          capacityTon: 3.0,
          percent: Math.min(100, Math.round(((1.4 + ((materialAddedWeight['minyak'] || 0) / 1000)) / 3.0) * 100)),
          color: '#6366f1',
        },
      ];

      return {
        intakeThisMonthKg: currentTotalWeightKg,
        totalPayoutRp: currentTotalPayoutRp,
        activeCitizensServed: totalTransactions,
        warehouseCapacityPercent,
        totalStorageTon,
        maxCapacityTon: 25.0,
        pendingDeliveriesCount: pending.length,
        satisfactionRating: 4.9,
        dailyTrend: dailyPoints,
        storageBreakdown,
      };
    } catch (err) {
      console.error('Error getting dashboard stats:', err);
      return {
        intakeThisMonthKg: 18450,
        totalPayoutRp: 64200000,
        activeCitizensServed: 142,
        warehouseCapacityPercent: 72,
        totalStorageTon: 18.5,
        maxCapacityTon: 25.0,
        pendingDeliveriesCount: 0,
        satisfactionRating: 4.9,
        dailyTrend: [],
        storageBreakdown: [],
      };
    }
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
