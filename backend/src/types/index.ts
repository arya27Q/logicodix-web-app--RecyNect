export type ManagementType = 'bank_sampah' | 'pengepul' | 'tps3r' | 'recycler_industry';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type MatchingPriority = 'balanced' | 'highest_value' | 'nearest' | 'fewest_stops';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface UnmatchedItem {
  categoryId: string;
  categoryName: string;
  quantity: number;
  unit: string;
  reason: string;
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
  unmatchedItems: UnmatchedItem[];
}

export interface MatchingSessionResult {
  sessionId: string;
  priority: MatchingPriority;
  searchRadiusKm?: number;
  alternatives: MatchingAlternative[];
  createdAt: string;
}

