import { WasteCategory } from '../../types/index.js';
import { WasteRepository } from './waste.repository.js';

export class WasteService {
  private wasteRepository: WasteRepository;

  constructor() {
    this.wasteRepository = new WasteRepository();
  }

  public async getCategories(): Promise<WasteCategory[]> {
    // Panggil fungsi query khusus tabel waste
    return this.wasteRepository.findActiveCategories();
  }
}
