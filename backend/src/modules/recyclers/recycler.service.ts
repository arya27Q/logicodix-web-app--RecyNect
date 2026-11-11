import { Recycler } from '../../types/index.js';
import { RecyclerRepository } from './recycler.repository.js';
import { HttpError } from '../../utils/http-error.js';

export class RecyclerService {
  private recyclerRepository: RecyclerRepository;

  constructor() {
    this.recyclerRepository = new RecyclerRepository();
  }

  public async getAll(): Promise<Recycler[]> {
    return this.recyclerRepository.findActiveRecyclers();
  }

  public async getById(id: string): Promise<Recycler | null> {
    return this.recyclerRepository.findById(id);
  }

  /**
   * Mengambil semua material yang diterima oleh mitra pengelola yang sedang login
   */
  public async getMyMaterials(userId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Profil mitra pengelola tidak ditemukan.');
    }
    return this.recyclerRepository.findMaterialsByRecyclerId(recycler.id);
  }

  /**
   * Menambahkan material baru ke daftar penerimaan mitra
   */
  public async createMaterial(
    userId: string,
    data: {
      categoryId: string;
      price: number;
      unit: string;
      minQuantity?: number;
      qualityRequirements?: string;
      isAvailable?: boolean;
    }
  ) {
    if (!data.categoryId) throw new HttpError(400, 'Kategori material wajib dipilih.');
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new HttpError(400, 'Harga beli material harus lebih dari Rp 0.');
    }
    if (!data.unit) throw new HttpError(400, 'Satuan ukuran material wajib ditentukan.');

    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Profil mitra pengelola tidak ditemukan.');
    }

    return this.recyclerRepository.createMaterial({
      recyclerId: recycler.id,
      categoryId: data.categoryId,
      price: data.price,
      unit: data.unit,
      minQuantity: data.minQuantity,
      qualityRequirements: data.qualityRequirements,
      isAvailable: data.isAvailable,
    });
  }

  /**
   * Memperbarui ketentuan material (harga, minQuantity, syarat mutu, isAvailable)
   */
  public async updateMaterial(
    userId: string,
    materialId: string,
    data: {
      price?: number;
      unit?: string;
      minQuantity?: number;
      qualityRequirements?: string;
      isAvailable?: boolean;
    }
  ) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Profil mitra pengelola tidak ditemukan.');
    }

    return this.recyclerRepository.updateMaterial(materialId, recycler.id, data);
  }

  /**
   * Menghapus material dari daftar penerimaan mitra
   */
  public async deleteMaterial(userId: string, materialId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Profil mitra pengelola tidak ditemukan.');
    }

    return this.recyclerRepository.deleteMaterial(materialId, recycler.id);
  }
}
