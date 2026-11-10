import { db } from '../../../config/database.js';
import {
  MatchingRequest,
  MatchingSessionResult,
  Recycler,
  WasteCategory,
} from '../../../types/index.js';
import { EligibilityService } from './eligibility.service.js';
import { DistanceService } from './distance.service.js';
import { ScoringService } from './scoring.service.js';
import { CombinationService } from './combination.service.js';
import { MatchingRepository } from '../matching.repository.js';

// Fallback Master Categories jika database belum terisi atau koneksi offline saat pengujian
const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', isActive: true },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', isActive: true },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', isActive: true },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', isActive: true },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', isActive: true },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', isActive: true },
];

// Fallback Demo Recyclers sesuai Data Simulasi Bab 9.8 & 14 Dokumentasi RecyNect
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

export class MatchingService {
  private eligibilityService: EligibilityService;
  private distanceService: DistanceService;
  private scoringService: ScoringService;
  private combinationService: CombinationService;
  private matchingRepository: MatchingRepository;

  constructor() {
    this.eligibilityService = new EligibilityService();
    this.distanceService = new DistanceService();
    this.scoringService = new ScoringService();
    this.combinationService = new CombinationService();
    this.matchingRepository = new MatchingRepository();
  }

  /**
   * Mengorkestrasi 4 sub-algoritma pencocokan:
   * 1. Distance & Radius Filter
   * 2. Eligibility Checking (status, minQuantity, kualitas)
   * 3. Combination Generation (1-stop, 2-stop partition, optimal greedy)
   * 4. Multi-Criteria Scoring & Ranking (Balanced, Highest Value, Nearest, Fewest Stops)
   */
  public async executeMatching(request: MatchingRequest, userId?: string): Promise<MatchingSessionResult> {
    const searchRadiusKm = request.searchRadiusKm || 30;

    // 1. Ambil data kategori dan data pengelola (dari DB atau fallback demo)
    const [categories, recyclers] = await Promise.all([
      this.fetchCategories(),
      this.fetchRecyclers(),
    ]);

    const categoryNames: Record<string, string> = {};
    for (const cat of categories) {
      categoryNames[cat.id] = cat.name;
    }

    // 2. Eksekusi Pembentukan Alternatif (CombinationService)
    const rawAlternatives = this.combinationService.generateAlternatives(
      request.items,
      recyclers,
      {
        userLocation: { latitude: request.latitude, longitude: request.longitude },
        searchRadiusKm,
        categoryNames,
      }
    );

    // 3. Eksekusi Pembobotan Skor & Pemeringkatan (ScoringService)
    const rankedAlternatives = this.scoringService.rankAndScoreAlternatives(
      rawAlternatives,
      request.priority,
      searchRadiusKm
    );

    // 4. Simpan Sesi & Snapshot ke Repository
    const saved = await this.matchingRepository.saveMatchingSession(
      request,
      rankedAlternatives,
      userId
    );

    return {
      sessionId: saved.id,
      priority: request.priority,
      searchRadiusKm,
      alternatives: rankedAlternatives,
      createdAt: saved.createdAt,
    };
  }

  /**
   * Mengambil detail sesi pencocokan yang telah tersimpan
   */
  public async getSessionById(sessionId: string): Promise<MatchingSessionResult | null> {
    return this.matchingRepository.getSessionById(sessionId);
  }

  /**
   * Helper internal: Mengambil kategori dari database dengan fallback
   */
  private async fetchCategories(): Promise<WasteCategory[]> {
    try {
      const dbCategories = await db.wasteCategory.findMany({
        where: { isActive: true },
        select: { id: true, name: true, unit: true, description: true, isActive: true },
      });

      if (dbCategories && dbCategories.length > 0) {
        return dbCategories.map((c) => ({
          ...c,
          description: c.description || undefined,
        }));
      }
    } catch {
      // Gunakan fallback jika query DB gagal
    }

    return FALLBACK_CATEGORIES;
  }

  /**
   * Helper internal: Mengambil data mitra pengelola beserta harga material dari database dengan fallback
   */
  private async fetchRecyclers(): Promise<Recycler[]> {
    try {
      const dbRecyclers = await db.recycler.findMany({
        where: { isActive: true },
        include: {
          materials: {
            where: { isAvailable: true },
            include: { category: true },
          },
        },
      });

      if (dbRecyclers && dbRecyclers.length > 0) {
        return dbRecyclers.map((r) => ({
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
      // Gunakan fallback jika query DB gagal
    }

    return FALLBACK_RECYCLERS;
  }
}
