export class AuthService {
  public async register(payload: any) {
    // TODO: Hash password & simpan ke database
    return { id: 'placeholder-user-id', ...payload };
  }

  public async login(payload: any) {
    // TODO: Validasi kredensial & sign JWT
    return { token: 'placeholder-jwt-token' };
  }
}

