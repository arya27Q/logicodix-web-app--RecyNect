import type { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { setSessionCookie } from '../../security/session.js';
import { clearRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { sendSuccess } from '../../utils/api-response.js';

export class AdminController {
  private readonly adminService = new AdminService();

  public login = async (req: Request, res: Response) => {
    const result = await this.adminService.login(req.body);
    clearRateLimit(req.ip || req.socket.remoteAddress);
    setSessionCookie(res, result.token);
    return sendSuccess(res, result.admin, 'Login administrator berhasil');
  };

  public verifyRecycler = async (req: Request, res: Response) => {
    const result = await this.adminService.verifyRecycler(req.params.id as string, req.body.status);
    return sendSuccess(res, result, 'Status verifikasi pengelola berhasil diperbarui');
  };

  public getPendingRecyclers = async (_req: Request, res: Response) => {
    const result = await this.adminService.getPendingRecyclers();
    return sendSuccess(res, result, 'Daftar verifikasi berhasil dimuat');
  };
}
