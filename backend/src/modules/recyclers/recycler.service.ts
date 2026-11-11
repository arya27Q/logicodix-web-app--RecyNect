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

  public async getMyMaterials(userId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      return [];
    }
    return this.recyclerRepository.getMaterialsForRecycler(recycler.id);
  }

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

  public async deleteMaterial(userId: string, materialId: string) {
    const recycler = await this.recyclerRepository.findRecyclerByUserId(userId);
    if (!recycler) {
      throw new HttpError(404, 'Fasilitas mitra pengelola tidak ditemukan.');
    }
    return this.recyclerRepository.deleteMaterial(materialId, recycler.id);
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

