import { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public verifyRecycler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const result = await this.adminService.verifyRecycler(id, status);
    return sendSuccess(res, result, 'Status verifikasi pengelola berhasil diperbarui');
  };
}
