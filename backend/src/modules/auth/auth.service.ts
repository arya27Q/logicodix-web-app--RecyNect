import { AuthRepository } from './auth.repository.js';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  public async register(payload: any) {
    // TODO: Hash password & simpan melalui repository
    return this.authRepository.createUser(payload);
  }

  public async login(payload: any) {
    // TODO: Cari user via repository & verifikasi password
    const user = await this.authRepository.findByEmail(payload.email);
    return { token: 'placeholder-jwt-token', user };
  }
}
