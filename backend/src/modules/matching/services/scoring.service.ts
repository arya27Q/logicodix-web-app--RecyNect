import { MatchingPriority } from '../../../types/index.js';

export class ScoringService {
  /**
   * Sesuai BAB 9.7: Menghitung skor terbobot 0-100 berdasarkan prioritas:
   * - Balanced: 50% Nilai, 30% Jarak, 20% Titik
   * - Highest Value: 70% Nilai, 20% Jarak, 10% Titik
   * - Nearest: 20% Nilai, 60% Jarak, 20% Titik
   * - Fewest Stops: 20% Nilai, 20% Jarak, 60% Titik
   */
  public calculateScore(
    economyScore: number,
    distanceScore: number,
    stopsScore: number,
    priority: MatchingPriority
  ): number {
    // TODO: Implementasi perhitungan pembobotan skor
    return 100;
  }
}
