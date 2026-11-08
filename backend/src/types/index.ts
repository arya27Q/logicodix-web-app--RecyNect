export type Role = 'user' | 'recycler' | 'admin';
export type ManagementType = 'bank_sampah' | 'pengepul' | 'tps3r' | 'recycler_industry';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type MatchingPriority = 'balanced' | 'highest_value' | 'nearest' | 'fewest_stops';

export interface WasteCategory {
  id: string;
  name: string;
  unit: string;
  description?: string;
  isActive: boolean;
}

export interface RecyclerMaterial {
  id: string;
  recyclerId: string;
  categoryId: string;
  price: number;
  unit: string;
  minQuantity: number;
  qualityRequirements?: string;
  isAvailable: boolean;
  priceUpdatedAt: string;
}

export interface Recycler {
  id: string;
  userId?: string;
  name: string;
  managementType: ManagementType;
  address: string;
  latitude: number;
  longitude: number;
  contact: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
  isActive: boolean;
}

export interface MatchingItemInput {
  categoryId: string;
  quantity: number;
  unit: string;
  condition?: string;
}

export interface MatchingRequest {
  latitude: number;
  longitude: number;
  priority: MatchingPriority;
  searchRadiusKm?: number;
  items: MatchingItemInput[];
}
