import { Prisma, VerificationStatus } from '@prisma/client';
import { db } from '../../config/database.js';
import type { WasteCategory } from '../../types/index.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './waste.schemas.js';

const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', description: 'Kardus cokelat tebal kemasan barang, boks paket.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', description: 'Botol air mineral transparan tanpa tutup & label.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', description: 'Minyak goreng bekas pakai rumah tangga yang disaring.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', description: 'Kaleng minuman ringan berbahan aluminium.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', description: 'Kertas dokumen HVS bekas tanpa jilid tebal.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', description: 'Puing besi tua dan logam campuran.', isActive: true, minPrice: 0, maxPrice: 0, averagePrice: 0, totalRecyclers: 0 },
];

const categoryMaterialInclude = {
  materials: {
    where: {
      isAvailable: true,
      recycler: {
        isActive: true,
        OR: [
          { verificationStatus: VerificationStatus.verified },
          { isDemo: true },
        ],
      },
    },
    select: {
      price: true,
      recyclerId: true,
    },
  },
} satisfies Prisma.WasteCategoryInclude;

type CategoryWithMaterials = Prisma.WasteCategoryGetPayload<{
  include: typeof categoryMaterialInclude;
}>;

function mapCategoryRecord(record: CategoryWithMaterials): WasteCategory {
  const prices = record.materials
    .map((m) => Number(m.price))
    .filter((p) => Number.isFinite(p) && p > 0);
  const uniqueRecyclers = new Set(record.materials.map((m) => m.recyclerId));

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const averagePrice =
    prices.length > 0
      ? Math.round(prices.reduce((sum, val) => sum + val, 0) / prices.length)
      : 0;

  return {
    id: record.id,
    name: record.name,
    slug: record.slug || undefined,
    unit: record.unit,
    description: record.description || undefined,
    icon: record.icon || undefined,
    isActive: record.isActive,
    minPrice,
    maxPrice,
    averagePrice,
    totalRecyclers: uniqueRecyclers.size,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class WasteRepository {
  public async findActiveCategories(): Promise<WasteCategory[]> {
    try {
      const records = await db.wasteCategory.findMany({
        where: { isActive: true },
        include: categoryMaterialInclude,
        orderBy: { name: 'asc' },
      });

      return records.map(mapCategoryRecord);
    } catch {
      // Fallback agar direktori publik tetap tampil jika koneksi DB belum aktif
      return FALLBACK_CATEGORIES;
    }
  }

  public async findAllCategories(): Promise<WasteCategory[]> {
    const records = await db.wasteCategory.findMany({
      include: categoryMaterialInclude,
      orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
    });

    return records.map(mapCategoryRecord);
  }

  public async findById(id: string): Promise<WasteCategory | null> {
    try {
      const record = await db.wasteCategory.findUnique({
        where: { id },
        include: categoryMaterialInclude,
      });
      if (record) return mapCategoryRecord(record);
    } catch {
      return FALLBACK_CATEGORIES.find((c) => c.id === id) || null;
    }

    return null;
  }

  public async findRawById(id: string) {
    return db.wasteCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            materials: true,
            items: true,
          },
        },
      },
    });
  }

  public async findByNameCaseInsensitive(name: string, excludeId?: string) {
    const cleanTarget = name.trim().toLowerCase();
    const candidates = await db.wasteCategory.findMany({
      where: excludeId ? { id: { not: excludeId } } : undefined,
      select: { id: true, name: true },
    });
    return candidates.find((c) => c.name.trim().toLowerCase() === cleanTarget) || null;
  }

  public async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const found = await db.wasteCategory.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return Boolean(found);
  }

  public async createCategory(data: CreateCategoryInput & { slug: string }): Promise<WasteCategory> {
    const created = await db.wasteCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        unit: data.unit.toLowerCase(),
        description: data.description || null,
        icon: data.icon || null,
        isActive: data.isActive ?? true,
      },
      include: categoryMaterialInclude,
    });

    return mapCategoryRecord(created);
  }

  public async updateCategory(id: string, data: UpdateCategoryInput & { slug?: string }): Promise<WasteCategory> {
    const updated = await db.wasteCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.unit !== undefined ? { unit: data.unit.toLowerCase() } : {}),
        ...(data.description !== undefined ? { description: data.description || null } : {}),
        ...(data.icon !== undefined ? { icon: data.icon || null } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
      include: categoryMaterialInclude,
    });

    return mapCategoryRecord(updated);
  }

  public async deleteCategory(id: string): Promise<void> {
    await db.wasteCategory.delete({ where: { id } });
  }
}
