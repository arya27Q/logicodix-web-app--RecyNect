'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface MonthlyVolumePoint {
  month: string;
  label: string;
  volumeKg: number;
  volumeTon: number;
  valueRp: number;
  valueJuta: number;
  deliveriesCount: number;
  growthPercent: number | null;
}

export interface MaterialCompositionPoint {
  name: string;
  value: number;
  unit: string;
  percent: number;
  color: string;
}

export interface AdminKPIData {
  totalRecyclers: number;
  totalRegisteredRecyclers: number;
  newRecyclersThisMonth: number;
  pendingVerifications: number;
  totalTransactionsVolumeKg: number;
  completedDeliveriesCount: number;
  priceComplianceRate: number;
  anomalyReportsCount: number;
  stalePriceCount: number;
  totalEvaluatedMaterials: number;
  activeWasteCategories: number;
  totalWasteCategories: number;
  compositionBasis: 'matching_items' | 'recycler_materials';
  monthlyTrend: MonthlyVolumePoint[];
  materialComposition: MaterialCompositionPoint[];
}

const EMPTY_STATS: AdminKPIData = {
  totalRecyclers: 0,
  totalRegisteredRecyclers: 0,
  newRecyclersThisMonth: 0,
  pendingVerifications: 0,
  totalTransactionsVolumeKg: 0,
  completedDeliveriesCount: 0,
  priceComplianceRate: 100,
  anomalyReportsCount: 0,
  stalePriceCount: 0,
  totalEvaluatedMaterials: 0,
  activeWasteCategories: 0,
  totalWasteCategories: 0,
  compositionBasis: 'recycler_materials',
  monthlyTrend: [],
  materialComposition: [],
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminKPIData>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await apiClient<AdminKPIData>('/admin/stats');
      if (data) setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat ringkasan statistik platform.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiClient<AdminKPIData>('/admin/stats')
      .then((data) => {
        if (!isMounted) return;
        if (data) setStats(data);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat ringkasan statistik platform.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const handleSync = () => {
      apiClient<AdminKPIData>('/admin/stats')
        .then((data) => {
          if (isMounted && data) setStats(data);
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('admin-data-changed', handleSync);
    }
    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('admin-data-changed', handleSync);
      }
    };
  }, []);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats,
  };
}
