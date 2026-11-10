import { UserRole } from '@prisma/client';
import { AuthRepository } from './auth.repository.js';
import type { LoginInput, RegisterInput } from './auth.types.js';
import { hashPassword, verifyPasswordForLogin } from '../../security/password.js';
import { createSessionToken, type AuthRole } from '../../security/session.js';
import { HttpError } from '../../utils/http-error.js';

export class AuthService {
  private readonly authRepository = new AuthRepository();

  public async register(payload: RegisterInput) {
    const existingUser = await this.authRepository.findByEmail(payload.email);
    if (existingUser) {
      if (existingUser.role === UserRole.recycler) {
        throw new HttpError(409, 'Email ini sudah terdaftar sebagai akun Mitra Pengelola. Gunakan email lain untuk akun Warga.');
      }
      throw new HttpError(409, 'Akun dengan email ini sudah terdaftar. Silakan langsung masuk ke halaman login.');
    }

    const existingAdmin = await this.authRepository.findAdminByEmail(payload.email);
    if (existingAdmin) {
      throw new HttpError(409, 'Email ini terdaftar sebagai akun Administrator internal. Gunakan email pribadi untuk akun Warga.');
    }

    const passwordHash = await hashPassword(payload.password);
    try {
      const user = await this.authRepository.createUser({ ...payload, password: passwordHash });
      return {
        token: createSessionToken(user.id, 'user', user.authVersion),
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: UserRole.user },
      };
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        throw new HttpError(409, 'Akun dengan email ini sudah terdaftar.');
      }
      throw error;
    }
  }

  public async login(payload: LoginInput) {
    const user = await this.authRepository.findByEmail(payload.email);
    if (!user) {
      const admin = await this.authRepository.findAdminByEmail(payload.email);
      if (admin) {
        throw new HttpError(403, 'Akun ini terdaftar sebagai Administrator internal, bukan portal Warga maupun Mitra Pengelola.');
      }
      if (payload.portal === 'pengelola') {
        throw new HttpError(404, 'Akun dengan email ini belum terdaftar sebagai Mitra Pengelola.');
      }
      throw new HttpError(404, 'Akun dengan email ini belum terdaftar di sistem. Silakan registrasi terlebih dahulu.');
    }

    if (payload.portal === 'pengelola' && user.role !== UserRole.recycler) {
      throw new HttpError(403, 'Email ini terdaftar sebagai akun Warga, bukan sebagai Mitra Pengelola.');
    }
    if (payload.portal === 'warga' && user.role === UserRole.recycler) {
      throw new HttpError(403, 'Email ini terdaftar sebagai akun Mitra Pengelola. Silakan masuk melalui portal pengelola.');
    }

    const valid = await verifyPasswordForLogin(payload.password, user.password);
    if (!valid) {
      throw new HttpError(401, 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
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
