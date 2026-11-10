import {
  MatchingItemInput,
  Recycler,
  MatchingAlternative,
  StopAllocation,
  AssignedMaterial,
  UnmatchedItem,
  RecyclerMaterial,
} from '../../../types/index.js';
import { EligibilityService } from './eligibility.service.js';
import { DistanceService, LocationPoint } from './distance.service.js';

export interface CombinationOptions {
  userLocation: LocationPoint;
  searchRadiusKm?: number;
  categoryNames?: Record<string, string>;
}

export class CombinationService {
  private eligibilityService: EligibilityService;
  private distanceService: DistanceService;

  constructor() {
    this.eligibilityService = new EligibilityService();
    this.distanceService = new DistanceService();
  }

  /**
   * Sesuai BAB 9.5: Menyusun penempatan setiap material ke 1 atau beberapa pengelola
   * Menghasilkan alternatif 1-stop, 2-stop partition, optimal-value, dan nearest-stop.
   */
  public generateAlternatives(
    items: MatchingItemInput[],
    recyclers: Recycler[],
    options: CombinationOptions
  ): Omit<MatchingAlternative, 'rank' | 'economyScore' | 'distanceScore' | 'stopsScore' | 'finalScore'>[] {
    if (!items || items.length === 0 || !recyclers || recyclers.length === 0) {
      return [];
    }

    const { userLocation, searchRadiusKm = 30, categoryNames = {} } = options;

    // 1. Filter pengelola dalam radius dan aktif
    const nearbyRecyclers = recyclers.filter((r) => {
      const withinRadius = this.distanceService.isWithinRadius(
        userLocation,
        { latitude: r.latitude, longitude: r.longitude },
        searchRadiusKm
      );
      return withinRadius && r.isActive;
    });

    if (nearbyRecyclers.length === 0) {
      return [];
    }

    // 2. Evaluasi kelayakan setiap item terhadap setiap pengelola
    // Map<categoryId, Array<{ recycler, material }>>
    const itemEligibilityMap = new Map<string, { recycler: Recycler; material: RecyclerMaterial }[]>();
    for (const item of items) {
      const matches = this.eligibilityService.getEligibleRecyclersForItem(item, nearbyRecyclers);
      itemEligibilityMap.set(item.categoryId, matches);
    }

    const rawAlternatives: Omit<
      MatchingAlternative,
      'rank' | 'economyScore' | 'distanceScore' | 'stopsScore' | 'finalScore'
    >[] = [];
    const seenSignatures = new Set<string>();

    const addAlternativeIfUnique = (
      allocationMap: Map<string, { recycler: Recycler; material: RecyclerMaterial }>
    ) => {
      if (allocationMap.size === 0) return;

      // Buat signature unik: urutan kategori -> recyclerId
      const sigKeys = Array.from(allocationMap.entries())
        .map(([catId, match]) => `${catId}:${match.recycler.id}`)
        .sort()
        .join('|');

      if (seenSignatures.has(sigKeys)) return;
      seenSignatures.add(sigKeys);

      const alt = this.buildAlternativeFromAllocation(
        items,
        allocationMap,
        userLocation,
        categoryNames
      );

      if (alt.stops.length > 0) {
        rawAlternatives.push(alt);
      }
    };

    // SKENARIO A: Alternatif 1-Titik Singgah (Single Recycler)
    // Cari pengelola yang bisa menerima seluruh material atau sebagian besar material
    for (const recycler of nearbyRecyclers) {
      const allocationMap = new Map<string, { recycler: Recycler; material: RecyclerMaterial }>();
      for (const item of items) {
        const material = this.eligibilityService.findEligibleMaterial(recycler, item);
        if (material) {
          allocationMap.set(item.categoryId, { recycler, material });
        }
      }
      if (allocationMap.size > 0) {
        addAlternativeIfUnique(allocationMap);
      }
    }

    // SKENARIO B: Alternatif Nilai Maksimum (Highest Value Greedy)
    // Setiap material dialokasikan ke pengelola yang memberikan harga beli tertinggi
    const highestValueMap = new Map<string, { recycler: Recycler; material: RecyclerMaterial }>();
    for (const item of items) {
      const matches = itemEligibilityMap.get(item.categoryId) || [];
      if (matches.length > 0) {
        // Sort descending by price
        const best = [...matches].sort((a, b) => b.material.price - a.material.price)[0];
        highestValueMap.set(item.categoryId, best);
      }
    }
    if (highestValueMap.size > 0) {
      addAlternativeIfUnique(highestValueMap);
    }

    // SKENARIO C: Alternatif Jarak Terdekat (Nearest Recycler per Material)
    // Setiap material dialokasikan ke pengelola terdekat dari pengguna
    const nearestMap = new Map<string, { recycler: Recycler; material: RecyclerMaterial }>();
    for (const item of items) {
      const matches = itemEligibilityMap.get(item.categoryId) || [];
      if (matches.length > 0) {
        const nearest = [...matches].sort((a, b) => {
          const distA = this.distanceService.calculateDistance(userLocation, {
            latitude: a.recycler.latitude,
            longitude: a.recycler.longitude,
          });
          const distB = this.distanceService.calculateDistance(userLocation, {
            latitude: b.recycler.latitude,
            longitude: b.recycler.longitude,
          });
          return distA - distB;
        })[0];
        nearestMap.set(item.categoryId, nearest);
      }
    }
    if (nearestMap.size > 0) {
      addAlternativeIfUnique(nearestMap);
    }

    // SKENARIO D: Kombinasi 2 Pengelola (Bi-Partition Multi-Stop)
    // Pasangkan 2 pengelola berbeda untuk melengkapi cakupan sampah pengguna
    if (nearbyRecyclers.length >= 2 && items.length >= 2) {
      const topCandidateRecyclers = nearbyRecyclers.slice(0, 8); // Batasi pasangan untuk efisiensi
      for (let i = 0; i < topCandidateRecyclers.length; i++) {
        for (let j = i + 1; j < topCandidateRecyclers.length; j++) {
          const r1 = topCandidateRecyclers[i];
          const r2 = topCandidateRecyclers[j];
          const pairMap = new Map<string, { recycler: Recycler; material: RecyclerMaterial }>();

          for (const item of items) {
            const m1 = this.eligibilityService.findEligibleMaterial(r1, item);
            const m2 = this.eligibilityService.findEligibleMaterial(r2, item);

            if (m1 && m2) {
              // Jika keduanya bisa menerima, pilih yang harganya lebih tinggi
              if (m1.price >= m2.price) {
                pairMap.set(item.categoryId, { recycler: r1, material: m1 });
              } else {
                pairMap.set(item.categoryId, { recycler: r2, material: m2 });
              }
            } else if (m1) {
              pairMap.set(item.categoryId, { recycler: r1, material: m1 });
            } else if (m2) {
              pairMap.set(item.categoryId, { recycler: r2, material: m2 });
            }
          }

          // Hanya tambahkan jika pasangan ini melibatkan kedua pengelola (2 stops)
          const distinctRecyclers = new Set(Array.from(pairMap.values()).map((v) => v.recycler.id));
          if (distinctRecyclers.size === 2) {
            addAlternativeIfUnique(pairMap);
          }
        }
      }
    }

    return rawAlternatives;
  }

  /**
   * Mengonstruksi alternatif lengkap (stops, assigned materials, unmatched items, & rute jarak)
   */
  private buildAlternativeFromAllocation(
    items: MatchingItemInput[],
    allocationMap: Map<string, { recycler: Recycler; material: RecyclerMaterial }>,
    userLocation: LocationPoint,
    categoryNames: Record<string, string>
  ): Omit<MatchingAlternative, 'rank' | 'economyScore' | 'distanceScore' | 'stopsScore' | 'finalScore'> {
    // 1. Kelompokkan item per pengelola
    const recyclerGroup = new Map<
      string,
      {
        recycler: Recycler;
        assignedMaterials: AssignedMaterial[];
        stopValue: number;
      }
    >();

    let totalValue = 0;

    for (const item of items) {
      const match = allocationMap.get(item.categoryId);
      if (match) {
        const { recycler, material } = match;
        const estimatedValue = Math.round(item.quantity * material.price);
        totalValue += estimatedValue;

        const assigned: AssignedMaterial = {
          categoryId: item.categoryId,
          categoryName: categoryNames[item.categoryId] || material.category?.name || item.categoryId,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: material.price,
          estimatedValue,
          minQuantity: material.minQuantity,
          qualityRequirements: material.qualityRequirements,
        };

        if (!recyclerGroup.has(recycler.id)) {
          recyclerGroup.set(recycler.id, {
            recycler,
            assignedMaterials: [assigned],
            stopValue: estimatedValue,
          });
        } else {
          const group = recyclerGroup.get(recycler.id)!;
          group.assignedMaterials.push(assigned);
          group.stopValue += estimatedValue;
        }
      }
    }

    // 2. Susun Stops awal
    const initialStops: (StopAllocation & LocationPoint)[] = Array.from(recyclerGroup.values()).map(
      (entry) => {
        const r = entry.recycler;
        const distFromUser = this.distanceService.calculateDistance(userLocation, {
          latitude: r.latitude,
          longitude: r.longitude,
        });

        return {
          recyclerId: r.id,
          recyclerName: r.name,
          managementType: r.managementType,
          address: r.address,
          contact: r.contact,
          isDemo: r.isDemo,
          latitude: r.latitude,
          longitude: r.longitude,
          distanceKm: distFromUser,
          materials: entry.assignedMaterials,
          stopTotalValue: entry.stopValue,
        };
      }
    );

    // 3. Optimasi urutan kunjungan rute menggunakan Nearest-Neighbor
    const { orderedStops, totalDistanceKm } = this.distanceService.optimizeStopsOrder(
      userLocation,
      initialStops
    );

    // Format ulang stops tanpa kelebihan properti internal jika ada
    const formattedStops: StopAllocation[] = orderedStops.map((s) => ({
      recyclerId: s.recyclerId,
      recyclerName: s.recyclerName,
      managementType: s.managementType,
      address: s.address,
      contact: s.contact,
      isDemo: s.isDemo,
      latitude: s.latitude,
      longitude: s.longitude,
      distanceKm: s.distanceKm,
      materials: s.materials,
      stopTotalValue: s.stopTotalValue,
    }));

    // 4. Deteksi item yang belum memiliki kecocokan di alternatif ini
    const unmatchedItems: UnmatchedItem[] = [];
    for (const item of items) {
      if (!allocationMap.has(item.categoryId)) {
        unmatchedItems.push({
          categoryId: item.categoryId,
          categoryName: categoryNames[item.categoryId] || item.categoryId,
          quantity: item.quantity,
          unit: item.unit,
          reason: 'Tidak ada pengelola dalam radius yang menerima jenis material atau memenuhi batas minimum kuantitas ini.',
        });
      }
    }

    return {
      totalValue,
      totalDistanceKm,
      totalStops: formattedStops.length,
      stops: formattedStops,
      unmatchedItems,
    };
  }
}
