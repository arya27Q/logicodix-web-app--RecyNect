import { VerificationStatus } from '@prisma/client';
import { AdminRepository } from './admin.repository.js';
import type { LoginInput } from '../auth/auth.types.js';
import { verifyPasswordForLogin } from '../../security/password.js';
import { createSessionToken } from '../../security/session.js';
import { HttpError } from '../../utils/http-error.js';

export class AdminService {
  private readonly adminRepository = new AdminRepository();

  public async login(payload: LoginInput) {
    const admin = await this.adminRepository.findByEmail(payload.email);
    if (!admin) {
      const user = await this.adminRepository.findUserByEmail(payload.email);
      if (user) {
        throw new HttpError(403, 'Email ini terdaftar sebagai akun ' + (user.role === 'recycler' ? 'Mitra Pengelola' : 'Warga') + ', bukan akun Administrator.');
      }
      throw new HttpError(404, 'Akun administrator ini belum terdaftar.');
    }

    const valid = await verifyPasswordForLogin(payload.password, admin.password);
    if (!valid) throw new HttpError(401, 'Kata sandi administrator yang Anda masukkan salah. Silakan periksa kembali.');

    return {
      token: createSessionToken(admin.id, 'admin', admin.authVersion),
      admin: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' as const },
    };
  }

  public async getAdmin(id: string) {
    const admin = await this.adminRepository.findById(id);
    if (!admin) throw new HttpError(401, 'Sesi tidak valid.');
    return { ...admin, role: 'admin' as const };
  }

  public verifyRecycler(id: string, status: 'verified' | 'rejected') {
    return this.adminRepository.updateRecyclerVerification(
      id,
      status === 'verified' ? VerificationStatus.verified : VerificationStatus.rejected,
    );
  }

  public getPendingRecyclers() {
    return this.adminRepository.findPendingRecyclers();
  }
}
