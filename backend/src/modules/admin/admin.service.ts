import { ManagementType, VerificationStatus } from '@prisma/client';
import { AdminRepository } from './admin.repository.js';
import type { LoginInput } from '../auth/auth.types.js';
import type { UpdateAdminProfileInput, UpdateRecyclerStatusInput } from './admin.schemas.js';
import { hashPassword, verifyPasswordForLogin } from '../../security/password.js';
import { createSessionToken } from '../../security/session.js';
import { HttpError } from '../../utils/http-error.js';

export class AdminService {
  private readonly adminRepository = new AdminRepository();

  public async login(payload: LoginInput) {
    const cleanEmail = payload.email.trim().toLowerCase();
    const admin = await this.adminRepository.findByEmail(cleanEmail);
    if (!admin) {
      const user = await this.adminRepository.findUserByEmail(cleanEmail);
      if (user) {
        const portalName = user.role === 'recycler' ? 'Mitra Pengelola di /pengelola/login' : 'Warga di /login';
        throw new HttpError(403, `Email ini terdaftar sebagai akun ${portalName}, bukan akun Administrator.`);
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
    return {
      ...admin,
      adminRole: admin.role,
      role: 'admin' as const,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }

  public async updateProfile(id: string, payload: UpdateAdminProfileInput) {
    const current = await this.adminRepository.findById(id);
    if (!current) throw new HttpError(404, 'Akun administrator tidak ditemukan.');

    const cleanEmail = payload.email.trim().toLowerCase();
    const otherAdmin = await this.adminRepository.findOtherAdminByEmail(cleanEmail, id);
    if (otherAdmin) {
      throw new HttpError(409, 'Email tersebut sudah digunakan oleh akun administrator lain.');
    }

    const existingUser = await this.adminRepository.findUserByEmail(cleanEmail);
    if (existingUser) {
      throw new HttpError(409, 'Email tersebut sudah terdaftar di tabel pengguna publik.');
    }

    const updated = await this.adminRepository.updateAdminProfile(id, {
      name: payload.name,
      email: cleanEmail,
    });

    return {
      ...updated,
      adminRole: updated.role,
      role: 'admin' as const,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  public async changePassword(id: string, currentPassword: string, newPassword: string) {
    const credentials = await this.adminRepository.findCredentialsById(id);
    if (!credentials || !(await verifyPasswordForLogin(currentPassword, credentials.password))) {
      throw new HttpError(401, 'Kata sandi saat ini tidak valid.');
    }

    const passwordHash = await hashPassword(newPassword);
    await this.adminRepository.updateAdminPassword(id, passwordHash);
  }

  public async verifyRecycler(id: string, status: 'verified' | 'rejected') {
    const existing = await this.adminRepository.findRecyclerById(id);
    if (!existing) {
      throw new HttpError(404, 'Data mitra pengelola tidak ditemukan.');
    }

    return this.adminRepository.updateRecyclerVerification(
      id,
      status === 'verified' ? VerificationStatus.verified : VerificationStatus.rejected,
    );
  }

  public async updateRecyclerFlags(id: string, payload: UpdateRecyclerStatusInput) {
    const existing = await this.adminRepository.findRecyclerById(id);
    if (!existing) {
      throw new HttpError(404, 'Data mitra pengelola tidak ditemukan.');
    }

    return this.adminRepository.updateRecyclerFlags(id, payload);
  }

  public getPendingRecyclers() {
    return this.adminRepository.findPendingRecyclers();
  }

  public getRecyclers(filters?: { status?: string; type?: string; search?: string }) {
    let status: VerificationStatus | undefined;
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'pending' || filters.status === 'verified' || filters.status === 'rejected') {
        status = filters.status as VerificationStatus;
      }
    }

    let managementType: ManagementType | undefined;
    if (filters?.type && filters.type !== 'all') {
      if (
        filters.type === 'bank_sampah' ||
        filters.type === 'pengepul' ||
        filters.type === 'tps3r' ||
        filters.type === 'recycler_industry'
      ) {
        managementType = filters.type as ManagementType;
      }
    }

    return this.adminRepository.findRecyclers({
      status,
      managementType,
      search: filters?.search,
    });
  }

  public getOverviewStats(staleDays = 30, deviationThreshold = 20) {
    return this.adminRepository.getPlatformOverviewStats(staleDays, deviationThreshold);
  }

  public getPriceAuditReport(staleDays = 30, deviationThreshold = 20) {
    return this.adminRepository.getPriceAuditReport(staleDays, deviationThreshold);
  }

  public getRecentActivity() {
    return this.adminRepository.getRecentAdminActivity();
  }
}
