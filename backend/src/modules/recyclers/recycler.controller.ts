import { Request, Response } from 'express';
import { RecyclerService } from './recycler.service.js';
import { sendSuccess, sendError } from '../../utils/api-response.js';

export class RecyclerController {
  private recyclerService: RecyclerService;

  constructor() {
    this.recyclerService = new RecyclerService();
  }

  public getAll = async (req: Request, res: Response) => {
    const recyclers = await this.recyclerService.getAll();
    return sendSuccess(res, recyclers, 'Berhasil memuat daftar pengelola');
  };

  public getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const recycler = await this.recyclerService.getById(id);
    return sendSuccess(res, recycler, 'Berhasil memuat detail pengelola');
  };

  public getMyMaterials = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      return sendError(res, 'Autentikasi diperlukan', 401);
    }
    const materials = await this.recyclerService.getMyMaterials(userId);
    return sendSuccess(res, materials, 'Berhasil memuat daftar material pengelola');
  };

  public createMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    if (!userId) {
      return sendError(res, 'Autentikasi diperlukan', 401);
    }
    const material = await this.recyclerService.createMaterial(userId, req.body);
    return sendSuccess(res, material, 'Ketentuan material berhasil ditambahkan', 201);
  };

  public updateMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    const id = req.params.id as string;
    if (!userId) {
      return sendError(res, 'Autentikasi diperlukan', 401);
    }
    const updated = await this.recyclerService.updateMaterial(userId, id, req.body);
    return sendSuccess(res, updated, 'Ketentuan material berhasil diperbarui');
  };

  public deleteMaterial = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id || req.auth?.sub;
    const id = req.params.id as string;
    if (!userId) {
      return sendError(res, 'Autentikasi diperlukan', 401);
    }
    await this.recyclerService.deleteMaterial(userId, id);
    return sendSuccess(res, null, 'Material berhasil dihapus dari daftar penerimaan');
  };
}
