import { Recycler } from '../../types/index.js';

export class RecyclerService {
  public async getAll(): Promise<Recycler[]> {
    // TODO: Query ke database tabel recyclers
    return [];
  }

  public async getById(id: string): Promise<Recycler | null> {
    // TODO: Query recycler by id beserta relasi recyclers_materials
    return null;
  }
}

