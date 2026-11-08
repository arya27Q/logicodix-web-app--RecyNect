import { Recycler, MatchingItemInput } from '../../../types/index.js';

export class EligibilityService {
  /**
   * Sesuai BAB 9.3: Memeriksa kelayakan pengelola terhadap satu item sampah
   * (Status aktif, kategori diterima, kuantitas >= min_quantity, kesesuaian mutu)
   */
  public checkItemEligibility(recycler: Recycler, item: MatchingItemInput): boolean {
    // TODO: Implementasi filter kelayakan material
    return true;
  }
}
