import { Request, Response } from 'express';
import { WasteService } from './waste.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class WasteController {
  private wasteService: WasteService;

  constructor() {
    this.wasteService = new WasteService();
  }

  public getCategories = async (req: Request, res: Response) => {
    // TODO: Ambil daftar kategori sampah dari database
    const categories = await this.wasteService.getCategories();
    return sendSuccess(res, categories, 'Berhasil memuat kategori sampah');
  };
}
