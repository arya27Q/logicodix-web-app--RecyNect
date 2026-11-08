import { calculateHaversineDistanceKm } from '../../../utils/haversine.js';

export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export class DistanceService {
  /**
   * Sesuai BAB 9.6: Menghitung estimasi jarak garis lurus (Haversine)
   */
  public calculateDistance(from: LocationPoint, to: LocationPoint): number {
    return calculateHaversineDistanceKm(from.latitude, from.longitude, to.latitude, to.longitude);
  }
}
