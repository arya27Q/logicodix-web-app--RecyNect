import { ManagementType, Prisma, VerificationStatus } from '@prisma/client';
import { db } from '../../config/database.js';

const publicAdminFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

const recyclerWithMetaInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  _count: {
    select: {
      materials: true,
    },
  },
} satisfies Prisma.RecyclerInclude;

type RecyclerWithMeta = Prisma.RecyclerGetPayload<{
  include: typeof recyclerWithMetaInclude;
}>;

export interface AdminPriceAuditItem {
  id: string;
  recyclerId: string;
  recyclerName: string;
  recyclerType: ManagementType;
  recyclerIsActive: boolean;
  isDemo: boolean;
  contact: string;
  ownerEmail: string | null;
  categoryId: string;
  categoryName: string;
  unit: string;
  currentPrice: number;
  marketAverage: number;
  deviationPercent: number;
  daysSinceUpdate: number;
  isStale: boolean;
  isAnomaly: boolean;
  auditStatus: 'stale_and_anomaly' | 'anomaly' | 'stale' | 'normal';
  lastUpdated: string;
  priceUpdatedAt: string;
}

const CHART_COLORS = ['#10b981', '#f59e0b', '#6366f1', '#0ea5e9', '#64748b'];
const MONTH_SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function mapRecyclerRecord(r: RecyclerWithMeta) {
  return {
    id: r.id,
    name: r.name,
    managementType: r.managementType,
    description: r.description || undefined,
    address: r.address,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    contact: r.contact,
    operatingHours: r.operatingHours || undefined,
    verificationStatus: r.verificationStatus,
    isActive: r.isActive,
    isDemo: r.isDemo,
    ownerName: r.user?.name || (r.isDemo ? 'Tim Kurasi Demo' : 'Belum Tertaut Akun'),
    ownerEmail: r.user?.email || null,
    materialsCount: r._count.materials,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function parseWeightKg(rawWeight: string | null | undefined): number {
  if (!rawWeight) return 0;
  const match = rawWeight.replace(',', '.').match(/[\d.]+/);
  if (!match) return 0;
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function evaluateMaterialsAudit(
  materials: Array<{
    id: string;
    price: Prisma.Decimal;
    unit: string;
    priceUpdatedAt: Date;
    recycler: {
      id: string;
      name: string;
      managementType: ManagementType;
      isActive: boolean;
      isDemo: boolean;
      contact: string;
      user: { email: string } | null;
    };
    category: {
      id: string;
      name: string;
      unit: string;
    };
  }>,
  staleDays: number,
  deviationThreshold: number,
) {
  const pricesByCategory = new Map<string, number[]>();
  for (const item of materials) {
    const price = Number(item.price);
    if (!Number.isFinite(price) || price <= 0) continue;
    const list = pricesByCategory.get(item.category.id) || [];
    list.push(price);
    pricesByCategory.set(item.category.id, list);
  }

  const now = Date.now();
  const auditItems: AdminPriceAuditItem[] = materials.map((item) => {
    const currentPrice = Number(item.price);
    const categoryPrices = pricesByCategory.get(item.category.id) || [currentPrice];
    const marketAverage =
      categoryPrices.length > 0
        ? Math.round(categoryPrices.reduce((sum, val) => sum + val, 0) / categoryPrices.length)
        : currentPrice;

    const deviationPercent =
      categoryPrices.length >= 2 && marketAverage > 0
        ? Number((((currentPrice - marketAverage) / marketAverage) * 100).toFixed(1))
        : 0;

    const daysSinceUpdate = Math.max(
      0,
      Math.floor((now - item.priceUpdatedAt.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const isStale = daysSinceUpdate > staleDays;
    const isAnomaly = Math.abs(deviationPercent) > deviationThreshold;

    const auditStatus: AdminPriceAuditItem['auditStatus'] =
      isStale && isAnomaly
        ? 'stale_and_anomaly'
        : isAnomaly
          ? 'anomaly'
          : isStale
            ? 'stale'
            : 'normal';

    return {
      id: item.id,
      recyclerId: item.recycler.id,
      recyclerName: item.recycler.name,
      recyclerType: item.recycler.managementType,
      recyclerIsActive: item.recycler.isActive,
      isDemo: item.recycler.isDemo,
      contact: item.recycler.contact,
      ownerEmail: item.recycler.user?.email || null,
      categoryId: item.category.id,
      categoryName: item.category.name,
      unit: item.unit || item.category.unit,
      currentPrice,
      marketAverage,
      deviationPercent,
      daysSinceUpdate,
      isStale,
      isAnomaly,
      auditStatus,
      lastUpdated: item.priceUpdatedAt.toISOString().split('T')[0],
      priceUpdatedAt: item.priceUpdatedAt.toISOString(),
    };
  });

  const totalMaterials = auditItems.length;
  const anomalyCount = auditItems.filter((i) => i.isAnomaly).length;
  const staleCount = auditItems.filter((i) => i.isStale).length;
  const compliantCount = auditItems.filter((i) => !i.isAnomaly && !i.isStale).length;
  const complianceRate =
    totalMaterials > 0 ? Number(((compliantCount / totalMaterials) * 100).toFixed(1)) : 100;
  const averageAbsoluteDeviationPercent =
    totalMaterials > 0
      ? Number(
          (
            auditItems.reduce((sum, i) => sum + Math.abs(i.deviationPercent), 0) /
            totalMaterials
          ).toFixed(1),
        )
      : 0;

  return {
    items: auditItems,
    summary: {
      totalMaterials,
      compliantCount,
      complianceRate,
      anomalyCount,
      staleCount,
      flaggedCount: auditItems.filter((i) => i.isAnomaly || i.isStale).length,
      averageAbsoluteDeviationPercent,
      staleDaysThreshold: staleDays,
      deviationThresholdPercent: deviationThreshold,
    },
  };
}

export class AdminRepository {
  public async findByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    let admin = await db.admin.findUnique({ where: { email: cleanEmail } });
    if (admin) return admin;

    if (rawEmail !== cleanEmail) {
      admin = await db.admin.findUnique({ where: { email: rawEmail } });
      if (admin) return admin;
    }

    return db.admin.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { email: rawEmail }],
      },
    });
  }

  public async findUserByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const rawEmail = email.trim();

    let user = await db.user.findUnique({ where: { email: cleanEmail }, select: { id: true, role: true } });
    if (user) return user;

    if (rawEmail !== cleanEmail) {
      user = await db.user.findUnique({ where: { email: rawEmail }, select: { id: true, role: true } });
      if (user) return user;
    }

    return db.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { email: rawEmail }],
      },
      select: { id: true, role: true },
    });
  }

  public findById(id: string) {
    return db.admin.findUnique({ where: { id }, select: publicAdminFields });
  }

  public findCredentialsById(id: string) {
    return db.admin.findUnique({
      where: { id },
      select: { id: true, email: true, password: true, authVersion: true },
    });
  }

  public async findOtherAdminByEmail(email: string, excludeId: string) {
    return db.admin.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        id: { not: excludeId },
      },
      select: { id: true },
    });
  }

  public updateAdminProfile(id: string, data: { name: string; email: string }) {
    return db.admin.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email.trim().toLowerCase(),
      },
      select: publicAdminFields,
    });
  }

  public updateAdminPassword(id: string, passwordHash: string) {
    return db.admin.update({
      where: { id },
      data: {
        password: passwordHash,
        authVersion: { increment: 1 },
      },
      select: { id: true },
    });
  }

  public findRecyclerById(id: string) {
    return db.recycler.findUnique({
      where: { id },
      include: recyclerWithMetaInclude,
    });
  }

  public async findRecyclers(filters?: {
    status?: VerificationStatus;
    managementType?: ManagementType;
    search?: string;
  }) {
    const where: Prisma.RecyclerWhereInput = {};
    if (filters?.status) where.verificationStatus = filters.status;
    if (filters?.managementType) where.managementType = filters.managementType;
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q } },
        { address: { contains: q } },
        { contact: { contains: q } },
        { user: { is: { name: { contains: q } } } },
      ];
    }

    const records = await db.recycler.findMany({
      where,
      include: recyclerWithMetaInclude,
      orderBy: [{ createdAt: 'desc' }],
    });

    return records.map(mapRecyclerRecord);
  }

  public async findPendingRecyclers() {
    const records = await db.recycler.findMany({
      where: { verificationStatus: VerificationStatus.pending },
      include: recyclerWithMetaInclude,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(mapRecyclerRecord);
  }

  public async updateRecyclerVerification(id: string, status: VerificationStatus) {
    const updated = await db.recycler.update({
      where: { id },
      data: { verificationStatus: status, isActive: status === VerificationStatus.verified },
      include: recyclerWithMetaInclude,
    });
    return mapRecyclerRecord(updated);
  }

  public async updateRecyclerFlags(id: string, data: { isActive?: boolean; isDemo?: boolean }) {
    const updated = await db.recycler.update({
      where: { id },
      data: {
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isDemo !== undefined ? { isDemo: data.isDemo } : {}),
      },
      include: recyclerWithMetaInclude,
    });
    return mapRecyclerRecord(updated);
  }

  public async getPriceAuditReport(staleDays: number, deviationThreshold: number) {
    const [materials, histories] = await Promise.all([
      db.recyclerMaterial.findMany({
        include: {
          recycler: {
            select: {
              id: true,
              name: true,
              managementType: true,
              isActive: true,
              isDemo: true,
              contact: true,
              user: { select: { email: true } },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
        orderBy: [{ priceUpdatedAt: 'asc' }],
      }),
      db.priceHistory.findMany({
        take: 20,
        orderBy: { changedAt: 'desc' },
        include: {
          recyclerMaterial: {
            select: {
              unit: true,
              category: { select: { name: true } },
              recycler: { select: { name: true, managementType: true } },
            },
          },
        },
      }),
    ]);

    const evaluated = evaluateMaterialsAudit(materials, staleDays, deviationThreshold);

    return {
      ...evaluated,
      priceHistories: histories.map((h) => ({
        id: h.id,
        categoryName: h.recyclerMaterial.category.name,
        recyclerName: h.recyclerMaterial.recycler.name,
        recyclerType: h.recyclerMaterial.recycler.managementType,
        unit: h.recyclerMaterial.unit,
        oldPrice: Number(h.oldPrice),
        newPrice: Number(h.newPrice),
        changedAt: h.changedAt.toISOString(),
      })),
    };
  }

  public async getPlatformOverviewStats(staleDays: number = 30, deviationThreshold: number = 20) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [recyclers, categories, materials, completedDeliveries, matchingItems] = await Promise.all([
      db.recycler.findMany({
        select: {
          id: true,
          verificationStatus: true,
          isActive: true,
          isDemo: true,
          createdAt: true,
        },
      }),
      db.wasteCategory.findMany({
        select: {
          id: true,
          name: true,
          unit: true,
          isActive: true,
        },
      }),
      db.recyclerMaterial.findMany({
        where: {
          recycler: { isActive: true },
        },
        include: {
          recycler: {
            select: {
              id: true,
              name: true,
              managementType: true,
              isActive: true,
              isDemo: true,
              contact: true,
              user: { select: { email: true } },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
      }),
      db.incomingDelivery.findMany({
        where: { status: 'selesai' },
        select: {
          actualWeight: true,
          totalEstimatedWeight: true,
          actualPayoutRp: true,
          estimatedPayoutRp: true,
          updatedAt: true,
        },
      }),
      db.matchingItem.findMany({
        select: {
          categoryId: true,
          quantity: true,
          unit: true,
          category: { select: { name: true } },
        },
      }),
    ]);

    const activeQualifiedRecyclers = recyclers.filter(
      (r) => r.isActive && (r.verificationStatus === VerificationStatus.verified || r.isDemo),
    );
    const pendingVerifications = recyclers.filter(
      (r) => r.verificationStatus === VerificationStatus.pending,
    ).length;
    const newRecyclersThisMonth = recyclers.filter((r) => r.createdAt >= startOfMonth).length;
    const activeWasteCategories = categories.filter((c) => c.isActive).length;

    const totalTransactionsVolumeKg = Number(
      completedDeliveries
        .reduce((sum, d) => {
          const w = d.actualWeight !== null ? Number(d.actualWeight) : parseWeightKg(d.totalEstimatedWeight);
          return sum + (Number.isFinite(w) ? w : 0);
        }, 0)
        .toFixed(1),
    );

    const auditSummary = evaluateMaterialsAudit(materials, staleDays, deviationThreshold).summary;

    // Bangun deret 6 bulan terakhir dari data IncomingDelivery berstatus selesai
    const buckets: Array<{
      year: number;
      monthIndex: number;
      month: string;
      label: string;
      volumeKg: number;
      valueRp: number;
      deliveriesCount: number;
    }> = [];

    for (let offset = 5; offset >= 0; offset -= 1) {
      const target = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const y = target.getFullYear();
      const m = target.getMonth();
      buckets.push({
        year: y,
        monthIndex: m,
        month: MONTH_SHORT_NAMES[m],
        label: `${MONTH_SHORT_NAMES[m]} ${y}`,
        volumeKg: 0,
        valueRp: 0,
        deliveriesCount: 0,
      });
    }

    for (const d of completedDeliveries) {
      const date = d.updatedAt;
      const bucket = buckets.find(
        (b) => b.year === date.getFullYear() && b.monthIndex === date.getMonth(),
      );
      if (!bucket) continue;
      const weight = d.actualWeight !== null ? Number(d.actualWeight) : parseWeightKg(d.totalEstimatedWeight);
      const payout = d.actualPayoutRp !== null ? Number(d.actualPayoutRp) : Number(d.estimatedPayoutRp);
      bucket.volumeKg += Number.isFinite(weight) ? weight : 0;
      bucket.valueRp += Number.isFinite(payout) ? payout : 0;
      bucket.deliveriesCount += 1;
    }

    const monthlyTrend = buckets.map((b, idx) => {
      const prev = idx > 0 ? buckets[idx - 1] : null;
      let growthPercent: number | null = null;
      if (prev && prev.volumeKg > 0) {
        growthPercent = Number((((b.volumeKg - prev.volumeKg) / prev.volumeKg) * 100).toFixed(1));
      }
      return {
        month: b.month,
        label: b.label,
        volumeKg: Number(b.volumeKg.toFixed(1)),
        volumeTon: Number((b.volumeKg / 1000).toFixed(2)),
        valueRp: Math.round(b.valueRp),
        valueJuta: Number((b.valueRp / 1000000).toFixed(2)),
        deliveriesCount: b.deliveriesCount,
        growthPercent,
      };
    });

    // Komposisi material: utamakan kuantitas permintaan MatchingItem; jika kosong, pakai jumlah penawaran mitra aktif
    const compositionSource = new Map<string, { name: string; value: number; unit: string }>();
    if (matchingItems.length > 0) {
      for (const item of matchingItems) {
        const current = compositionSource.get(item.categoryId) || {
          name: item.category.name,
          value: 0,
          unit: item.unit,
        };
        current.value += Number(item.quantity);
        compositionSource.set(item.categoryId, current);
      }
    } else if (materials.length > 0) {
      for (const mat of materials) {
        const current = compositionSource.get(mat.category.id) || {
          name: mat.category.name,
          value: 0,
          unit: 'mitra',
        };
        current.value += 1;
        compositionSource.set(mat.category.id, current);
      }
    }

    const sortedComposition = Array.from(compositionSource.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const totalCompValue = sortedComposition.reduce((sum, c) => sum + c.value, 0);

    const materialComposition = sortedComposition.map((c, idx) => ({
      name: c.name,
      value: Number(c.value.toFixed(1)),
      unit: c.unit,
      percent: totalCompValue > 0 ? Math.round((c.value / totalCompValue) * 100) : 0,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    }));

    return {
      totalRecyclers: activeQualifiedRecyclers.length,
      totalRegisteredRecyclers: recyclers.length,
      newRecyclersThisMonth,
      pendingVerifications,
      totalTransactionsVolumeKg,
      completedDeliveriesCount: completedDeliveries.length,
      priceComplianceRate: auditSummary.complianceRate,
      anomalyReportsCount: auditSummary.anomalyCount,
      stalePriceCount: auditSummary.staleCount,
      totalEvaluatedMaterials: auditSummary.totalMaterials,
      activeWasteCategories,
      totalWasteCategories: categories.length,
      compositionBasis: matchingItems.length > 0 ? 'matching_items' : 'recycler_materials',
      monthlyTrend,
      materialComposition,
    };
  }

  public async getRecentAdminActivity() {
    const [recyclers, categories, priceHistories] = await Promise.all([
      db.recycler.findMany({
        take: 6,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          managementType: true,
          verificationStatus: true,
          isActive: true,
          isDemo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.wasteCategory.findMany({
        take: 6,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          unit: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.priceHistory.findMany({
        take: 6,
        orderBy: { changedAt: 'desc' },
        include: {
          recyclerMaterial: {
            select: {
              unit: true,
              category: { select: { name: true } },
              recycler: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    const events: Array<{
      id: string;
      type: 'verification' | 'category' | 'price';
      action: string;
      target: string;
      timestamp: string;
    }> = [];

    for (const r of recyclers) {
      const statusLabel =
        r.verificationStatus === VerificationStatus.verified
          ? 'Mitra terverifikasi'
          : r.verificationStatus === VerificationStatus.rejected
            ? 'Pengajuan mitra ditolak'
            : 'Pendaftaran mitra menunggu tinjauan';
      events.push({
        id: `rec-${r.id}`,
        type: 'verification',
        action: statusLabel,
        target: `${r.name}${r.isDemo ? ' (Demo)' : ''}`,
        timestamp: r.updatedAt.toISOString(),
      });
    }

    for (const c of categories) {
      const isNew = Math.abs(c.updatedAt.getTime() - c.createdAt.getTime()) < 2000;
      events.push({
        id: `cat-${c.id}`,
        type: 'category',
        action: isNew ? 'Penambahan kategori master' : 'Pembaruan kategori master',
        target: `${c.name} (${c.unit}) - ${c.isActive ? 'Aktif' : 'Nonaktif'}`,
        timestamp: c.updatedAt.toISOString(),
      });
    }

    for (const p of priceHistories) {
      events.push({
        id: `price-${p.id}`,
        type: 'price',
        action: 'Perubahan harga material mitra',
        target: `${p.recyclerMaterial.recycler.name} - ${p.recyclerMaterial.category.name} (Rp ${Number(p.oldPrice).toLocaleString('id-ID')} -> Rp ${Number(p.newPrice).toLocaleString('id-ID')}/${p.recyclerMaterial.unit})`,
        timestamp: p.changedAt.toISOString(),
      });
    }

    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 12);
  }
}
