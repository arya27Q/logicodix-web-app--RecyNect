'use client';

import { useState, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isLocating: boolean;
  locationSuccess: boolean;
  error: string | null;
  locationName: string;
}

export const DEFAULT_COORDINATES = {
  latitude: -6.914744,
  longitude: 107.60981,
  locationName: 'Pusat Kota Bandung (Simulasi Default)',
};

/**
 * Validasi range koordinat geografis
 */
export function isValidCoordinate(latitude: unknown, longitude: unknown): boolean {
  const validLatitude =
    typeof latitude === 'number' && !isNaN(latitude) && latitude >= -90 && latitude <= 90;
  const validLongitude =
    typeof longitude === 'number' && !isNaN(longitude) && longitude >= -180 && longitude <= 180;
  return validLatitude && validLongitude;
}

/**
 * Hook Geolocation yang dioptimalkan untuk Mobile & Desktop:
 * - Opsi timeout 30 detik (menghindari timeout prematur pada HP)
 * - enableHighAccuracy: true & maximumAge: 0
 * - Penanganan error spesifik (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT)
 * - Tidak diam-diam menganggap fallback sebagai GPS riil
 */
export function useGeolocation(
  fallbackLat = DEFAULT_COORDINATES.latitude,
  fallbackLng = DEFAULT_COORDINATES.longitude,
  fallbackName = DEFAULT_COORDINATES.locationName
) {
  const [state, setState] = useState<GeolocationState>({
    latitude: fallbackLat,
    longitude: fallbackLng,
    accuracy: null,
    isLocating: false,
    locationSuccess: false,
    error: null,
    locationName: fallbackName,
  });

  const requestLocation = useCallback(() => {
    // 1. Pastikan dieksekusi di browser client-side
    if (typeof window === 'undefined' || !navigator) return;

    // 2. Cek apakah Geolocation API didukung
    if (!('geolocation' in navigator) || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isLocating: false,
        locationSuccess: false,
        error: 'Browser ini tidak mendukung fitur lokasi.',
      }));
      return;
    }

    // 3. Cek Secure Context (HTTPS)
    if (
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setState((prev) => ({
        ...prev,
        isLocating: false,
        locationSuccess: false,
        error: 'Fitur lokasi membutuhkan koneksi aman (HTTPS). Silakan buka melalui HTTPS.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLocating: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 detik agar GPS HP sempat lock satelit
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        if (!isValidCoordinate(latitude, longitude)) {
          setState((prev) => ({
            ...prev,
            isLocating: false,
            locationSuccess: false,
            error: 'Koordinat yang diterima dari GPS di luar batas valid.',
          }));
          return;
        }

        setState({
          latitude,
          longitude,
          accuracy: typeof accuracy === 'number' ? Math.round(accuracy) : null,
          isLocating: false,
          locationSuccess: true,
          error: null,
          locationName: `GPS Akurat (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
        });
      },
      (err) => {
        let errorMessage = 'Gagal mengambil lokasi GPS.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Izin lokasi ditolak. Aktifkan izin lokasi untuk browser ini di pengaturan perangkat.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'GPS tidak tersedia. Pastikan Location/GPS aktif di HP dan sinyal mencukupi.';
            break;
          case err.TIMEOUT:
            errorMessage = 'GPS terlalu lama merespons. Coba lagi di area terbuka dengan sinyal lebih baik.';
            break;
          default:
            errorMessage = err.message || 'Terjadi kendala saat membaca GPS perangkat.';
        }

        setState((prev) => ({
          ...prev,
          latitude: fallbackLat,
          longitude: fallbackLng,
          accuracy: null,
          isLocating: false,
          locationSuccess: false,
          error: errorMessage,
          locationName: fallbackName,
        }));
      },
      options
    );
  }, [fallbackLat, fallbackLng, fallbackName]);

  return {
    ...state,
    requestLocation,
    isValid: isValidCoordinate(state.latitude, state.longitude),
  };
}
