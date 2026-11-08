import { ManagementType, MatchingPriority, VerificationStatus } from '@/types';

export const MANAGEMENT_TYPE_LABELS: Record<ManagementType, string> = {
  bank_sampah: 'Bank Sampah',
  pengepul: 'Pengepul',
  tps3r: 'TPS3R',
  recycler_industry: 'Industri Daur Ulang',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, { label: string; color: string }> = {
  pending: { label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  verified: { label: 'Terverifikasi', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Ditolak', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const PRIORITY_OPTIONS: { id: MatchingPriority; label: string; description: string; weights: string }[] = [
  {
    id: 'balanced',
    label: 'Balanced (Seimbang)',
    description: 'Keseimbangan antara nilai jual, jarak lokasi, dan jumlah tempat singgah.',
    weights: '50% Nilai • 30% Jarak • 20% Titik Singgah',
  },
  {
    id: 'highest_value',
    label: 'Highest Value (Nilai Tertinggi)',
    description: 'Prioritaskan total estimasi pendapatan rupiah terbesar.',
    weights: '70% Nilai • 20% Jarak • 10% Titik Singgah',
  },
  {
    id: 'nearest',
    label: 'Nearest Location (Lokasi Terdekat)',
    description: 'Prioritaskan pengelola dengan radius jarak paling dekat dari lokasi Anda.',
    weights: '20% Nilai • 60% Jarak • 20% Titik Singgah',
  },
  {
    id: 'fewest_stops',
    label: 'Fewest Stops (Titik Kunjungan Paling Sedikit)',
    description: 'Prioritaskan kepraktisan dengan jumlah titik singgah sesedikit mungkin (ideal 1 tempat).',
    weights: '20% Nilai • 20% Jarak • 60% Titik Singgah',
  },
];

export const DEFAULT_SEARCH_RADIUS_KM = 25;
export const MAX_MATCHING_ITEMS = 5;

