import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AdminService } from '../admin/admin.service.js';
import { clearSessionCookie, setSessionCookie } from '../../security/session.js';
import { clearRateLimit } from '../../middlewares/rate-limit.middleware.js';
import { sendSuccess } from '../../utils/api-response.js';
import { createAuditLog } from '../audit-logs/audit-log.service.js';
import { AUDIT_ACTIONS } from '../audit-logs/audit-log.types.js';

export class AuthController {
  private readonly authService = new AuthService();
  private readonly adminService = new AdminService();

  public register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    clearRateLimit(req.ip || req.socket.remoteAddress);
    setSessionCookie(res, result.token);
    await createAuditLog({
      req,
      userId: result.user.id,
      action: 'REGISTER_SUCCESS',
      entity: 'User',
      entityId: result.user.id,
      metadata: { email: result.user.email, role: result.user.role },
    });
    return sendSuccess(res, result.user, 'Registrasi berhasil', 201);
  };

  public registerRecycler = async (req: Request, res: Response) => {
    const result = await this.authService.registerRecycler(req.body);
    clearRateLimit(req.ip || req.socket.remoteAddress);
    setSessionCookie(res, result.token);
    await createAuditLog({
      req,
      userId: result.user.id,
      action: 'REGISTER_RECYCLER_SUCCESS',
      entity: 'User',
      entityId: result.user.id,
      metadata: { email: result.user.email, role: result.user.role },
    });
    return sendSuccess(res, result.user, 'Pendaftaran mitra pengelola berhasil.', 201);
  };

  public resetPassword = async (req: Request, res: Response) => {
    const result = await this.authService.resetPassword(req.body);
    clearRateLimit(req.ip || req.socket.remoteAddress);
    await createAuditLog({
      req,
      action: 'PASSWORD_RESET',
      entity: 'User',
      metadata: { phone: req.body?.phone },
    });
    return sendSuccess(res, result, 'Kata sandi berhasil diperbarui. Silakan masuk.');
  };

  public login = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.login(req.body);
      clearRateLimit(req.ip || req.socket.remoteAddress);
      setSessionCookie(res, result.token);
      await createAuditLog({
        req,
        userId: result.user.id,
        action: AUDIT_ACTIONS.LOGIN_SUCCESS,
        entity: 'User',
        entityId: result.user.id,
        metadata: { email: result.user.email, role: result.user.role },
      });
      return sendSuccess(res, result.user, 'Login berhasil');
    } catch (err: any) {
      await createAuditLog({
        req,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        entity: 'User',
        metadata: { identifier: req.body?.email || req.body?.identifier, reason: err.message || 'Login gagal' },
      });
      throw err;
    }
  };

  public currentSession = async (req: Request, res: Response) => {
    const claims = req.auth;
    if (!claims) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });

    const account = claims.role === 'admin'
      ? await this.adminService.getAdmin(claims.sub)
      : await this.authService.getUser(claims.sub);
    return sendSuccess(res, account, 'Sesi aktif');
  };

  public logout = async (req: Request, res: Response) => {
    const portal = String(req.headers['x-portal'] || '').toLowerCase();
    let targetRole: 'user' | 'recycler' | 'admin' | undefined;
    if (portal === 'pengelola' || portal === 'recycler') targetRole = 'recycler';
    else if (portal === 'admin') targetRole = 'admin';
    else if (portal === 'warga' || portal === 'user') targetRole = 'user';

    const userId = req.auth?.sub || (req as any).user?.id || null;
    await createAuditLog({
      req,
      userId,
      action: AUDIT_ACTIONS.LOGOUT,
      entity: 'Session',
      metadata: { portal: targetRole || portal || 'unknown' },
    });

    clearSessionCookie(res, targetRole);
    return sendSuccess(res, null, 'Logout berhasil');
  };

  public changePassword = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    await this.authService.changePassword(req.auth.sub, req.body.currentPassword, req.body.newPassword);
    await createAuditLog({
      req,
      userId: req.auth.sub,
      action: AUDIT_ACTIONS.PASSWORD_CHANGED,
      entity: 'User',
      entityId: req.auth.sub,
    });
    clearSessionCookie(res);
    return sendSuccess(res, null, 'Kata sandi berhasil diperbarui.');
  };

  public updateProfile = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    const updated = await this.authService.updateProfile(req.auth.sub, req.body);
    await createAuditLog({
      req,
      userId: req.auth.sub,
      action: AUDIT_ACTIONS.PROFILE_UPDATED,
      entity: 'User',
      entityId: req.auth.sub,
      metadata: { fields: Object.keys(req.body).filter((k) => !k.toLowerCase().includes('password')) },
    });
    return sendSuccess(res, updated, 'Profil berhasil diperbarui.');
  };

  public getCitizenHistory = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    const historyData = await this.authService.getCitizenHistory(req.auth.sub);
    return sendSuccess(res, historyData, 'Berhasil memuat riwayat penyetoran warga');
  };
}
