import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/api-response.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response) => {
    // TODO: Implementasi registrasi akun user/recycler
    const result = await this.authService.register(req.body);
    return sendSuccess(res, result, 'Registrasi berhasil');
  };

  public login = async (req: Request, res: Response) => {
    // TODO: Implementasi login akun
    const result = await this.authService.login(req.body);
    return sendSuccess(res, result, 'Login berhasil');
  };
}

