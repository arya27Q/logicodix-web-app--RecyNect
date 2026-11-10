import { MatchingPriority, MatchingAlternative } from '../../../types/index.js';

export interface RawAlternative {
  totalValue: number;
  totalDistanceKm: number;
  totalStops: number;
  stops: any[];
  unmatchedItems: any[];
}

export class ScoringService {
  /**
   * Sesuai BAB 9.7: Menghitung skor terbobot 0-100 berdasarkan 4 kriteria prioritas:
   * - Balanced: 50% Nilai (E), 30% Kedekatan (D), 20% Titik (S)
   * - Highest Value: 70% Nilai (E), 20% Kedekatan (D), 10% Titik (S)
   * - Nearest: 20% Nilai (E), 60% Kedekatan (D), 20% Titik (S)
   * - Fewest Stops: 20% Nilai (E), 20% Kedekatan (D), 60% Titik (S)
   */
  public calculateScore(
    economyScore: number,
    distanceScore: number,
    stopsScore: number,
    priority: MatchingPriority
  ): number {
    let score = 0;

    switch (priority) {
      case 'highest_value':
        score = 0.7 * economyScore + 0.2 * distanceScore + 0.1 * stopsScore;
        break;
      case 'nearest':
        score = 0.2 * economyScore + 0.6 * distanceScore + 0.2 * stopsScore;
        break;
      case 'fewest_stops':
        score = 0.2 * economyScore + 0.2 * distanceScore + 0.6 * stopsScore;
        break;
      case 'balanced':
      default:
        score = 0.5 * economyScore + 0.3 * distanceScore + 0.2 * stopsScore;
        break;
    }

    // Pastikan rentang skor antara 0 - 100 dan dibulatkan ke 1 desimal
    const clamped = Math.max(0, Math.min(100, score));
    return Math.round(clamped * 10) / 10;
  }

  /**
   * Menghitung skor normalisasi E, D, S untuk seluruh alternatif kandidat
   * lalu mengurutkan (ranking) dari skor tertinggi ke terendah.
   */
  public rankAndScoreAlternatives<T extends RawAlternative>(
    alternatives: T[],
    priority: MatchingPriority,
    searchRadiusKm: number = 30
  ): MatchingAlternative[] {
    if (alternatives.length === 0) {
      return [];
    }

    // 1. Cari nilai maksimum ekonomi di antara seluruh alternatif untuk normalisasi E
    const maxTotalValue = Math.max(...alternatives.map((a) => a.totalValue), 0);

    // 2. Hitung komponen E, D, S dan skor akhir untuk tiap alternatif
    const scoredList: MatchingAlternative[] = alternatives.map((alt) => {
      // Normalisasi Nilai Ekonomi (E): E = 100 * (nilai / maxNilai)
      let economyScore = 0;
      if (maxTotalValue > 0) {
        economyScore = Math.round((100 * (alt.totalValue / maxTotalValue)) * 10) / 10;
      } else {
        economyScore = 0;
      }

      // Normalisasi Kedekatan Jarak (D): D = 100 * max(0, 1 - (jarak / radius))
      const safeRadius = searchRadiusKm > 0 ? searchRadiusKm : 30;
      const distanceRatio = Math.max(0, 1 - alt.totalDistanceKm / safeRadius);
      const distanceScore = Math.round((100 * distanceRatio) * 10) / 10;

      // Normalisasi Efisiensi Titik Singgah (S): S = 100 / jumlah titik
      let stopsScore = 0;
      if (alt.totalStops > 0) {
        stopsScore = Math.round((100 / alt.totalStops) * 10) / 10;
      } else {
        stopsScore = 0;
      }

      const finalScore = this.calculateScore(economyScore, distanceScore, stopsScore, priority);

      return {
        rank: 0, // diisi setelah sorting
        totalValue: alt.totalValue,
        totalDistanceKm: alt.totalDistanceKm,
        totalStops: alt.totalStops,
        economyScore,
        distanceScore,
        stopsScore,
        finalScore,
        stops: alt.stops,
        unmatchedItems: alt.unmatchedItems,
      };
    });

    // 3. Urutkan berdasarkan skor tertinggi (descending)
    // Jika skor sama, bandingkan totalValue tertinggi, lalu distanceKm terpendek
    scoredList.sort((a, b) => {
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      if (b.totalValue !== a.totalValue) {
        return b.totalValue - a.totalValue;
      }
      return a.totalDistanceKm - b.totalDistanceKm;
    });

    // 4. Berikan label rank 1, 2, 3...
    return scoredList.map((alt, index) => ({
      ...alt,
      rank: index + 1,
    }));
  }
}
