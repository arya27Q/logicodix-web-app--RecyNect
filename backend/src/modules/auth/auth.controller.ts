import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AdminService } from '../admin/admin.service.js';
import { clearSessionCookie, setSessionCookie } from '../../security/session.js';
import { sendSuccess } from '../../utils/api-response.js';

export class AuthController {
  private readonly authService = new AuthService();
  private readonly adminService = new AdminService();

  public register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    setSessionCookie(res, result.token);
    return sendSuccess(res, result.user, 'Registrasi berhasil', 201);
  };

  public login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    setSessionCookie(res, result.token);
    return sendSuccess(res, result.user, 'Login berhasil');
  };

  public currentSession = async (req: Request, res: Response) => {
    const claims = req.auth;
    if (!claims) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });

    const account = claims.role === 'admin'
      ? await this.adminService.getAdmin(claims.sub)
      : await this.authService.getUser(claims.sub);
    return sendSuccess(res, account, 'Sesi aktif');
  };

  public logout = (_req: Request, res: Response) => {
    clearSessionCookie(res);
    return sendSuccess(res, null, 'Logout berhasil');
  };

  public changePassword = async (req: Request, res: Response) => {
    if (!req.auth) return res.status(401).json({ status: 'error', message: 'Autentikasi diperlukan.' });
    await this.authService.changePassword(req.auth.sub, req.body.currentPassword, req.body.newPassword);
    clearSessionCookie(res);
    return sendSuccess(res, null, 'Kata sandi berhasil diperbarui.');
  };
}
