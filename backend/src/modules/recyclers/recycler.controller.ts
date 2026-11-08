import { Request, Response } from 'express';
import { RecyclerService } from './recycler.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class RecyclerController {
  private recyclerService: RecyclerService;

  constructor() {
    this.recyclerService = new RecyclerService();
  }

  public getAll = async (req: Request, res: Response) => {
    // TODO: Ambil daftar pengelola yang aktif & terverifikasi
    const recyclers = await this.recyclerService.getAll();
    return sendSuccess(res, recyclers, 'Berhasil memuat daftar pengelola');
  };

  public getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    // TODO: Ambil detail profil dan daftar harga material pengelola
    const recycler = await this.recyclerService.getById(id);
    return sendSuccess(res, recycler, 'Berhasil memuat detail pengelola');
  };
}
