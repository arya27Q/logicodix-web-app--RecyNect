import { AdminRepository } from './admin.repository.js';

export class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  public async login(payload: any) {
    // Cari admin di tabel 'admins' terpisah
    const admin = await this.adminRepository.findByEmail(payload.email);
    return { token: 'placeholder-admin-jwt-token', admin };
  }

  public async verifyRecycler(id: string, status: 'verified' | 'rejected') {
    return this.adminRepository.updateRecyclerVerification(id, status);
  }
}
