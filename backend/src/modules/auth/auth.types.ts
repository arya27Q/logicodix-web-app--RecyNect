export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterRecyclerInput {
  name: string;
  facilityName: string;
  managementType: 'bank_sampah' | 'pengepul' | 'tps3r' | 'recycler_industry';
  email: string;
  phone: string;
  address: string;
  operatingHours?: string;
  password: string;
}

export interface ResetPasswordInput {
  email: string;
  newPassword: string;
  portal?: 'warga' | 'pengelola' | 'admin';
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  facilityName?: string;
  managementType?: 'bank_sampah' | 'pengepul' | 'tps3r' | 'recycler_industry';
  address?: string;
  operatingHours?: string;
  description?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  portal?: 'warga' | 'pengelola' | 'admin';
}
