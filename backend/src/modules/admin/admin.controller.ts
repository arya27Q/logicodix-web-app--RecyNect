import type { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { clearSessionCookie, setSessionCookie } from '../../security/session.js';
import { clearRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { sendSuccess } from '../../utils/api-response.js';

function parseBoundedInt(value: unknown, fallback: number, min: number, max: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}

export class AdminController {
  private readonly adminService = new AdminService();

  public login = async (req: Request, res: Response) => {
    const result = await this.adminService.login(req.body);
    clearRateLimit(req.ip || req.socket.remoteAddress);
    setSessionCookie(res, result.token);
    return sendSuccess(res, result.admin, 'Login administrator berhasil');
  };

  public getProfile = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    const admin = await this.adminService.getAdmin(req.auth.sub);
    return sendSuccess(res, admin, 'Profil administrator berhasil dimuat');
  };

  public updateProfile = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    const updated = await this.adminService.updateProfile(req.auth.sub, req.body);
    return sendSuccess(res, updated, 'Profil administrator berhasil diperbarui');
  };

  public changePassword = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    await this.adminService.changePassword(req.auth.sub, req.body.currentPassword, req.body.newPassword);
    clearSessionCookie(res, 'admin');
    return sendSuccess(res, null, 'Kata sandi administrator berhasil diperbarui. Silakan masuk kembali.');
  };

  public getStats = async (req: Request, res: Response) => {
    const staleDays = parseBoundedInt(req.query.staleDays, 30, 1, 365);
    const deviationThreshold = parseBoundedInt(req.query.deviationThreshold, 20, 1, 100);
    const stats = await this.adminService.getOverviewStats(staleDays, deviationThreshold);
    return sendSuccess(res, stats, 'Statistik dashboard admin berhasil dimuat');
  };

  public getRecyclers = async (req: Request, res: Response) => {
    const recyclers = await this.adminService.getRecyclers({
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      type: typeof req.query.type === 'string' ? req.query.type : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    });
    return sendSuccess(res, recyclers, 'Daftar mitra pengelola berhasil dimuat');
  };

  public getPendingRecyclers = async (_req: Request, res: Response) => {
    const result = await this.adminService.getPendingRecyclers();
    return sendSuccess(res, result, 'Daftar verifikasi berhasil dimuat');
  };

  public verifyRecycler = async (req: Request, res: Response) => {
    const result = await this.adminService.verifyRecycler(req.params.id as string, req.body.status);
    return sendSuccess(res, result, 'Status verifikasi pengelola berhasil diperbarui');
  };

  public updateRecyclerStatus = async (req: Request, res: Response) => {
    const result = await this.adminService.updateRecyclerFlags(req.params.id as string, req.body);
    return sendSuccess(res, result, 'Status operasional pengelola berhasil diperbarui');
  };

  public getPriceAudit = async (req: Request, res: Response) => {
    const staleDays = parseBoundedInt(req.query.staleDays, 30, 1, 365);
    const deviationThreshold = parseBoundedInt(req.query.deviationThreshold, 20, 1, 100);
    const report = await this.adminService.getPriceAuditReport(staleDays, deviationThreshold);
    return sendSuccess(res, report, 'Laporan audit harga berhasil dimuat');
  };

  public getActivity = async (_req: Request, res: Response) => {
    const activity = await this.adminService.getRecentActivity();
    return sendSuccess(res, activity, 'Log aktivitas sistem berhasil dimuat');
  };
}
