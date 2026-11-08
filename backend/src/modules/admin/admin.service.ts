export class AdminService {
  public async verifyRecycler(id: string, status: 'verified' | 'rejected') {
    // TODO: Update status verifikasi pengelola di database
    return { id, verificationStatus: status };
  }
}

