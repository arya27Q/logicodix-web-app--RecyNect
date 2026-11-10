import { Recycler, MatchingItemInput, RecyclerMaterial } from '../../../types/index.js';

export interface EligibilityResult {
  eligible: boolean;
  material?: RecyclerMaterial;
  reason?: string;
}

export class EligibilityService {
  /**
   * Sesuai BAB 9.3: Memeriksa kelayakan pengelola terhadap satu item sampah.
   * Pasangan material-pengelola hanya dinyatakan layak jika:
   * 1. Pengelola berstatus aktif dan datanya boleh ditampilkan (verified atau demo).
   * 2. Pengelola menerima kategori material tersebut dan status ketersediaan aktif.
   * 3. Satuan material cocok (misal kg dengan kg, liter dengan liter).
   * 4. Kuantitas pengguna memenuhi batas minimum setoran (minQuantity).
   * 5. Harga per satuan valid (> 0).
   */
  public evaluateItemEligibility(recycler: Recycler, item: MatchingItemInput): EligibilityResult {
    // 1. Cek status aktif & verifikasi pengelola
    if (!recycler.isActive) {
      return { eligible: false, reason: 'Pengelola berstatus tidak aktif.' };
    }

    if (!recycler.isDemo && recycler.verificationStatus !== 'verified') {
      return { eligible: false, reason: 'Pengelola belum lolos verifikasi administrator.' };
    }

    if (!recycler.materials || recycler.materials.length === 0) {
      return { eligible: false, reason: 'Pengelola belum mendaftarkan material yang diterima.' };
    }

    // 2. Cek apakah pengelola menerima kategori sampah ini
    const matchedMaterial = recycler.materials.find(
      (m) => m.categoryId === item.categoryId && m.isAvailable
    );

    if (!matchedMaterial) {
      return { eligible: false, reason: 'Pengelola tidak menerima jenis material ini.' };
    }

    // 3. Kesesuaian satuan
    if (
      item.unit &&
      matchedMaterial.unit &&
      item.unit.toLowerCase().trim() !== matchedMaterial.unit.toLowerCase().trim()
    ) {
      return {
        eligible: false,
        reason: `Satuan tidak cocok (pengelola: ${matchedMaterial.unit}, pengguna: ${item.unit}).`,
      };
    }

    // 4. Batas minimum kuantitas (minQuantity)
    if (item.quantity < matchedMaterial.minQuantity) {
      return {
        eligible: false,
        reason: `Kuantitas (${item.quantity} ${item.unit}) kurang dari batas minimum setoran (${matchedMaterial.minQuantity} ${matchedMaterial.unit}).`,
      };
    }

    // 5. Validitas harga
    if (typeof matchedMaterial.price !== 'number' || matchedMaterial.price <= 0) {
      return { eligible: false, reason: 'Harga beli material pengelola belum ditetapkan dengan valid.' };
    }

    return {
      eligible: true,
      material: matchedMaterial,
    };
  }

  /**
   * Helper boolean cepat untuk kompatibilitas pengecekan kelayakan
   */
  public checkItemEligibility(recycler: Recycler, item: MatchingItemInput): boolean {
    return this.evaluateItemEligibility(recycler, item).eligible;
  }

  /**
   * Mengembalikan material pengelola yang cocok jika layak, atau null jika tidak layak
   */
  public findEligibleMaterial(recycler: Recycler, item: MatchingItemInput): RecyclerMaterial | null {
    const result = this.evaluateItemEligibility(recycler, item);
    return result.eligible && result.material ? result.material : null;
  }

  /**
   * Menyaring seluruh pengelola yang layak menerima item material tertentu
   */
  public getEligibleRecyclersForItem(
    item: MatchingItemInput,
    recyclers: Recycler[]
  ): { recycler: Recycler; material: RecyclerMaterial }[] {
    const matches: { recycler: Recycler; material: RecyclerMaterial }[] = [];

    for (const recycler of recyclers) {
      const evaluation = this.evaluateItemEligibility(recycler, item);
      if (evaluation.eligible && evaluation.material) {
        matches.push({ recycler, material: evaluation.material });
      }
    }

    return matches;
  }
}
