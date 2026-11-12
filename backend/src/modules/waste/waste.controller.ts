import type { Request, Response } from 'express';
import { WasteService } from './waste.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class WasteController {
  private readonly wasteService = new WasteService();

  public getCategories = async (_req: Request, res: Response) => {
    const categories = await this.wasteService.getCategories();
    return sendSuccess(res, categories, 'Berhasil memuat kategori sampah');
  };

  public getAllCategoriesForAdmin = async (_req: Request, res: Response) => {
    const categories = await this.wasteService.getAllCategoriesForAdmin();
    return sendSuccess(res, categories, 'Berhasil memuat seluruh master kategori sampah');
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const category = await this.wasteService.getCategoryById(req.params.id as string);
    return sendSuccess(res, category, 'Berhasil memuat detail kategori sampah');
  };

  public createCategory = async (req: Request, res: Response) => {
    const created = await this.wasteService.createCategory(req.body);
    return sendSuccess(res, created, 'Kategori master sampah berhasil ditambahkan', 201);
  };

  public updateCategory = async (req: Request, res: Response) => {
    const updated = await this.wasteService.updateCategory(req.params.id as string, req.body);
    return sendSuccess(res, updated, 'Kategori master sampah berhasil diperbarui');
  };

  public deleteCategory = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.wasteService.deleteCategory(id);
    return sendSuccess(res, { id }, 'Kategori master sampah berhasil dihapus');
  };
}
