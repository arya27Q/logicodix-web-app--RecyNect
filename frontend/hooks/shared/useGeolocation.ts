'use client';

import { useState } from 'react';

export interface GeolocationState {
  latitude: number;
  longitude: number;
  locationName: string;
  isLocating: boolean;
  locationSuccess: boolean;
  error: string | null;
}

export function useGeolocation(initialLat = -6.914744, initialLng = 107.60981, initialName = 'Pusat Kota Bandung (Default Simulasi)') {
  const [state, setState] = useState<GeolocationState>({
    latitude: initialLat,
    longitude: initialLng,
    locationName: initialName,
    isLocating: false,
    locationSuccess: false,
    error: null,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung Geolocation GPS.');
      return;
    }

    setState((prev) => ({ ...prev, isLocating: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          locationName: `GPS Akurat: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          isLocating: false,
          locationSuccess: true,
          error: null,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          isLocating: false,
          locationSuccess: false,
          error: err.message,
        }));
        alert(`Gagal mengambil lokasi GPS: ${err.message}. Menggunakan titik default.`);
      },
      { timeout: 10000 }
    );
  };

  return {
    ...state,
    requestLocation,
  };
}

