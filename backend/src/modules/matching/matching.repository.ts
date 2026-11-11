import { db } from '../../config/database.js';
import { MatchingAlternative, MatchingPriority, MatchingRequest } from '../../types/index.js';

// In-memory session cache sebagai fallback jika koneksi database sedang offline saat dev/demo
const sessionMemoryStore = new Map<string, any>();

export class MatchingRepository {
  /**
   * Menyimpan sesi pencocokan dan snapshot hasil rekomendasi ke database
   */
  public async saveMatchingSession(
    request: MatchingRequest,
    alternatives: MatchingAlternative[],
    userId?: string
  ): Promise<{ id: string; createdAt: string }> {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const sessionPayload = {
      id: sessionId,
      sessionId,
      userId: userId || null,
      latitude: request.latitude,
      longitude: request.longitude,
      priority: request.priority,
      searchRadiusKm: request.searchRadiusKm || 30,
      alternatives,
      createdAt: now.toISOString(),
    };

    // 1. Simpan di in-memory cache untuk akses cepat & keandalan demo
    sessionMemoryStore.set(sessionId, sessionPayload);

    // 2. Usahakan persistensi ke MySQL via Prisma jika database terkoneksi
    try {
      // Pastikan setiap kategori ada di database sebelum dihubungkan foreign key
      const resolvedItems: { categoryId: string; quantity: number; unit: string; condition: string | null }[] = [];
      for (const item of request.items) {
        let cat = await db.wasteCategory.findFirst({
          where: {
            OR: [
              { id: item.categoryId },
              { slug: item.categoryId },
            ],
          },
        }).catch(() => null);

        if (!cat) {
          // Buat record kategori jika belum ada di DB agar relasi foreign key aman
          const cleanName = item.categoryId.replace(/^cat-/, '').replace(/-/g, ' ');
          cat = await db.wasteCategory.create({
            data: {
              id: item.categoryId,
              name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
              slug: item.categoryId,
              unit: item.unit || 'kg',
              isActive: true,
            },
          }).catch(() => null);
        }

        if (cat) {
          resolvedItems.push({
            categoryId: cat.id,
            quantity: item.quantity,
            unit: item.unit || cat.unit,
            condition: item.condition || null,
          });
        }
      }

      await db.matchingSession.create({
        data: {
          id: sessionId,
          userId: userId || undefined,
          latitude: request.latitude,
          longitude: request.longitude,
          priority: request.priority as any,
          searchRadius: request.searchRadiusKm || 30,
          status: 'completed',
          items: {
            create: resolvedItems,
          },
          results: {
            create: alternatives.slice(0, 5).map((alt) => ({
              rank: alt.rank,
              totalValue: alt.totalValue,
              totalDistance: alt.totalDistanceKm,
              totalStops: alt.totalStops,
              economyScore: alt.economyScore,
              distanceScore: alt.distanceScore,
              stopsScore: alt.stopsScore,
              finalScore: alt.finalScore,
              unmatchedSummary:
                alt.unmatchedItems.length > 0
                  ? alt.unmatchedItems.map((u) => `${u.categoryName} (${u.reason})`).join('; ')
                  : null,
            })),
          },
        },
      });
    } catch {
      // Abaikan jika DB belum terkoneksi di lokal, data tetap aman di in-memory store
    }

    return { id: sessionId, createdAt: now.toISOString() };
  }

  /**
   * Mengambil sesi hasil pencocokan berdasarkan Session ID
   */
  public async getSessionById(sessionId: string): Promise<any | null> {
    // Cek cache memori terlebih dahulu
    if (sessionMemoryStore.has(sessionId)) {
      return sessionMemoryStore.get(sessionId);
    }

    // Jika tidak ada di memori, query dari database Prisma
    try {
      const record = await db.matchingSession.findUnique({
        where: { id: sessionId },
        include: {
          items: { include: { category: true } },
          results: {
            include: {
              assignments: {
                include: {
                  recyclerMaterial: {
                    include: {
                      recycler: true,
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!record) return null;

      // Format kembali ke bentuk MatchingSessionResult
      const alternatives: MatchingAlternative[] = record.results.map((r) => {
        const stopMap = new Map<string, any>();

        for (const assign of r.assignments) {
          const rm = assign.recyclerMaterial;
          const rec = rm?.recycler;
          if (!rec) continue;

          if (!stopMap.has(rec.id)) {
            stopMap.set(rec.id, {
              recyclerId: rec.id,
              recyclerName: rec.name,
              managementType: rec.managementType,
              address: rec.address,
              contact: rec.contact,
              isDemo: rec.isDemo,
              latitude: Number(rec.latitude),
              longitude: Number(rec.longitude),
              distanceKm: 0,
              materials: [],
              stopTotalValue: 0,
            });
          }

          const stop = stopMap.get(rec.id)!;
          stop.materials.push({
            matchingItemId: assign.matchingItemId,
            categoryId: rm.categoryId,
            categoryName: rm.category?.name || rm.categoryId,
            quantity: Number(assign.quantitySnapshot),
            unit: rm.unit || 'kg',
            pricePerUnit: Number(assign.priceSnapshot),
            estimatedValue: Number(assign.estimatedValue),
            minQuantity: Number(rm.minQuantity),
          });
          stop.stopTotalValue += Number(assign.estimatedValue);
        }

        return {
          rank: r.rank,
          totalValue: Number(r.totalValue),
          totalDistanceKm: Number(r.totalDistance),
          totalStops: r.totalStops,
          economyScore: Number(r.economyScore),
          distanceScore: Number(r.distanceScore),
          stopsScore: Number(r.stopsScore),
          finalScore: Number(r.finalScore),
          stops: Array.from(stopMap.values()),
          unmatchedItems: [],
        };
      });

      return {
        sessionId: record.id,
        priority: record.priority as MatchingPriority,
        searchRadiusKm: Number(record.searchRadius),
        alternatives,
        createdAt: record.createdAt.toISOString(),
      };
    } catch {
      return null;
    }
  }
}
