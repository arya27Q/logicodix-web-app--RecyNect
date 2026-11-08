import { Recycler } from '../../types/index.js';
import { RecyclerRepository } from './recycler.repository.js';

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
}
