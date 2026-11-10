import { UserRole } from '@prisma/client';
import { AuthRepository } from './auth.repository.js';
import type { LoginInput, RegisterInput } from './auth.types.js';
import { hashPassword, verifyPasswordForLogin } from '../../security/password.js';
import { createSessionToken, type AuthRole } from '../../security/session.js';
import { HttpError } from '../../utils/http-error.js';

export class AuthService {
  private readonly authRepository = new AuthRepository();

  public async register(payload: RegisterInput) {
    const passwordHash = await hashPassword(payload.password);
    try {
      const user = await this.authRepository.createUser({ ...payload, password: passwordHash });
      return {
        token: createSessionToken(user.id, 'user', user.authVersion),
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: UserRole.user },
      };
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        throw new HttpError(409, 'Email sudah terdaftar.');
      }
      throw error;
    }
  }

  public async login(payload: LoginInput) {
    const user = await this.authRepository.findByEmail(payload.email);
    const valid = await verifyPasswordForLogin(payload.password, user?.password);
    if (!user || !valid || user.role === UserRole.admin) {
      throw new HttpError(401, 'Email atau kata sandi tidak valid.');
    }

    const role: AuthRole = user.role === UserRole.recycler ? 'recycler' : 'user';
    return {
      token: createSessionToken(user.id, role, user.authVersion),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role },
    };
  }

  public async getUser(id: string) {
    const user = await this.authRepository.findById(id);
    if (!user || user.role === UserRole.admin) throw new HttpError(401, 'Sesi tidak valid.');
    return user;
  }

  public async changePassword(id: string, currentPassword: string, newPassword: string) {
    const credentials = await this.authRepository.findCredentialsById(id);
    if (!credentials || !(await verifyPasswordForLogin(currentPassword, credentials.password))) {
      throw new HttpError(401, 'Kata sandi saat ini tidak valid.');
    }

    const passwordHash = await hashPassword(newPassword);
    await this.authRepository.updatePassword(id, passwordHash);
  }
}
