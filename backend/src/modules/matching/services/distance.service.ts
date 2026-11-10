import { calculateHaversineDistanceKm } from '../../../utils/haversine.js';

export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export class DistanceService {
  /**
   * Sesuai BAB 9.6: Menghitung estimasi jarak garis lurus (Haversine) antar dua titik koordinat (dalam km).
   * Nilai dibulatkan ke 1 desimal.
   */
  public calculateDistance(from: LocationPoint, to: LocationPoint): number {
    const raw = calculateHaversineDistanceKm(from.latitude, from.longitude, to.latitude, to.longitude);
    return Math.round(raw * 10) / 10;
  }

  /**
   * Menghitung total estimasi jarak rute multi-stop dari titik awal pengguna ke seluruh titik pengelola
   * Urutan: User -> Stop 1 -> Stop 2 -> ... -> Stop N
   */
  public calculateRouteDistance(origin: LocationPoint, stops: LocationPoint[]): number {
    if (stops.length === 0) return 0;

    let total = this.calculateDistance(origin, stops[0]);
    for (let i = 0; i < stops.length - 1; i++) {
      total += this.calculateDistance(stops[i], stops[i + 1]);
    }

    return Math.round(total * 10) / 10;
  }

  /**
   * Mengurutkan titik singgah (stops) berdasarkan pendekatan Nearest-Neighbor
   * agar urutan rute dari lokasi pengguna menjadi paling efisien.
   */
  public optimizeStopsOrder<T extends LocationPoint>(
    origin: LocationPoint,
    stops: T[]
  ): { orderedStops: T[]; totalDistanceKm: number } {
    if (stops.length <= 1) {
      const dist = stops.length === 1 ? this.calculateDistance(origin, stops[0]) : 0;
      return { orderedStops: [...stops], totalDistanceKm: dist };
    }

    const unvisited = [...stops];
    const ordered: T[] = [];
    let currentPoint: LocationPoint = origin;
    let totalDist = 0;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = this.calculateDistance(currentPoint, unvisited[i]);
        if (d < minDistance) {
          minDistance = d;
          nearestIndex = i;
        }
      }

      const nearestStop = unvisited.splice(nearestIndex, 1)[0];
      ordered.push(nearestStop);
      totalDist += minDistance;
      currentPoint = nearestStop;
    }

    return {
      orderedStops: ordered,
      totalDistanceKm: Math.round(totalDist * 10) / 10,
    };
  }

  /**
   * Memeriksa apakah lokasi pengelola berada dalam batas radius pencarian pengguna
   */
  public isWithinRadius(userLocation: LocationPoint, targetLocation: LocationPoint, radiusKm: number): boolean {
    const dist = this.calculateDistance(userLocation, targetLocation);
    return dist <= radiusKm;
  }
}
