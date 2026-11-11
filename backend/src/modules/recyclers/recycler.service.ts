import { RecyclerRepository } from './recycler.repository.js';
import { HttpError } from '../../utils/http-error.js';

export class RecyclerService {
  private recyclerRepository: RecyclerRepository;

  constructor() {
    this.recyclerRepository = new RecyclerRepository();
  }

  public async getAll() {
    return this.recyclerRepository.findAll();
  }

  public async getById(id: string) {
    return this.recyclerRepository.findById(id);
  }

  /**
   * Mengambil semua material yang diterima oleh mitra pengelola yang sedang login
   */
  public async getMyMaterials(userId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      return [];
    }
    return this.recyclerRepository.getMaterialsForRecycler(recycler.id);
  }

  /**
   * Menambahkan material baru ke daftar penerimaan mitra
   */
  public async addMaterial(userId: string, data: {
    categoryId?: string;
    name?: string;
    category?: string;
    price: number;
    unit?: string;
    minQuantity?: number;
    qualityRequirements?: string;
    isAvailable?: boolean;
  }) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Fasilitas mitra pengelola tidak ditemukan untuk akun ini.');
    }
    return this.recyclerRepository.createMaterial(recycler.id, data);
  }

  public async createMaterial(userId: string, data: any) {
    return this.addMaterial(userId, data);
  }

  /**
   * Memperbarui ketentuan material (harga, minQuantity, syarat mutu, isAvailable)
   */
  public async updateMaterial(userId: string, materialId: string, data: {
    name?: string;
    price?: number;
    unit?: string;
    minQuantity?: number;
    qualityRequirements?: string;
    isAvailable?: boolean;
  }) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Fasilitas mitra pengelola tidak ditemukan.');
    }
    return this.recyclerRepository.updateMaterial(materialId, recycler.id, data);
  }

  /**
   * Menghapus material dari daftar penerimaan mitra
   */
  public async deleteMaterial(userId: string, materialId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Fasilitas mitra pengelola tidak ditemukan.');
    }
    return this.recyclerRepository.deleteMaterial(materialId, recycler.id);
  }

  public async getDashboardStats(userId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      return {
        intakeThisMonthKg: 0,
        totalPayoutRp: 0,
        activeCitizensServed: 0,
        warehouseCapacityPercent: 0,
        totalStorageTon: 0,
        maxCapacityTon: 25.0,
        pendingDeliveriesCount: 0,
        satisfactionRating: 0,
        dailyTrend: [],
        storageBreakdown: [],
      };
    }
    return this.recyclerRepository.getDashboardStats(recycler.id);
  }

  public async getIncomingDeliveries(userId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      return [];
    }
    return this.recyclerRepository.getIncomingDeliveries(recycler.id);
  }

  public async updateDeliveryStatus(userId: string, deliveryId: string, data: {
    status: string;
    actualWeight?: number;
    actualPayoutRp?: number;
    notes?: string;
  }) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Fasilitas mitra pengelola tidak ditemukan.');
    }
    return this.recyclerRepository.updateDeliveryStatus(deliveryId, recycler.id, data);
  }

  public async scheduleIncomingDelivery(data: {
    recyclerId: string;
    citizenId?: string;
    sessionId?: string;
    citizenName: string;
    citizenPhone: string;
    materials: any[];
    totalEstimatedWeight: string;
    estimatedPayoutRp: number;
    arrivalTime: string;
    notes?: string;
  }) {
    if (!data.recyclerId) {
      throw new HttpError(400, 'ID Mitra Pengelola tujuan wajib diisi.');
    }
    if (!data.citizenName || !data.citizenPhone) {
      throw new HttpError(400, 'Nama warga dan nomor kontak telepon wajib diisi.');
    }
    return this.recyclerRepository.createIncomingDelivery(data);
  }
}
