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
}


