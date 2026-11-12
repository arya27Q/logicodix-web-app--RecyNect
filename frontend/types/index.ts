export type Role = 'user' | 'recycler' | 'admin';

export type ManagementType = 'bank_sampah' | 'pengepul' | 'tps3r' | 'recycler_industry';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type MatchingPriority = 'balanced' | 'highest_value' | 'nearest' | 'fewest_stops';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  slug?: string;
  unit: string; // e.g. 'kg', 'liter', 'pcs'
  description?: string;
  icon?: string;
  isActive: boolean;
  minPrice?: number;
  maxPrice?: number;
  averagePrice?: number;
  totalRecyclers?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecyclerMaterial {
  id: string;
  recyclerId: string;
  categoryId: string;
  category?: WasteCategory;
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
  materials?: RecyclerMaterial[];
  createdAt: string;
  updatedAt: string;
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

export interface AssignedMaterial {
  matchingItemId?: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  estimatedValue: number;
  minQuantity: number;
  qualityRequirements?: string;
}

export interface StopAllocation {
  recyclerId: string;
  recyclerName: string;
  managementType: ManagementType;
  address: string;
  contact: string;
  isDemo: boolean;
  latitude: number;
  longitude: number;
  distanceKm: number;
  materials: AssignedMaterial[];
  stopTotalValue: number;
}

export interface MatchingAlternative {
  rank: number;
  totalValue: number;
  totalDistanceKm: number;
  totalStops: number;
  economyScore: number;
  distanceScore: number;
  stopsScore: number;
  finalScore: number;
  stops: StopAllocation[];
  unmatchedItems: {
    categoryId: string;
    categoryName: string;
    quantity: number;
    unit: string;
    reason: string;
  }[];
}

export interface MatchingSessionResult {
  sessionId: string;
  priority: MatchingPriority;
  alternatives: MatchingAlternative[];
  createdAt: string;
}

