'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface DailyPoint {
  day: string;
  volumeTon: number;
  payoutJuta: number;
  x: number;
  y: number;
}

export interface StorageCategory {
  name: string;
  ton: number;
  capacityTon: number;
  percent: number;
  color: string;
}

export interface RecyclerKPIs {
  intakeThisMonthKg: number;
  totalPayoutRp: number;
  warehouseCapacityPercent: number;
  totalStorageTon: number;
  maxCapacityTon: number;
  activeCitizensServed: number;
  pendingDeliveriesCount: number;
  satisfactionRating: number;
  dailyTrend: DailyPoint[];
  storageBreakdown: StorageCategory[];
}

const DEFAULT_STATS: RecyclerKPIs = {
  intakeThisMonthKg: 18450,
  totalPayoutRp: 64200000,
  warehouseCapacityPercent: 72,
  totalStorageTon: 18.5,
  maxCapacityTon: 25.0,
  activeCitizensServed: 142,
  pendingDeliveriesCount: 0,
  satisfactionRating: 4.9,
  dailyTrend: [
    { day: 'Sen', volumeTon: 2.1, payoutJuta: 7.2, x: 50, y: 117 },
    { day: 'Sel', volumeTon: 2.8, payoutJuta: 9.6, x: 133, y: 96 },
    { day: 'Rab', volumeTon: 3.4, payoutJuta: 11.8, x: 216, y: 78 },
    { day: 'Kam', volumeTon: 3.1, payoutJuta: 10.5, x: 300, y: 87 },
    { day: 'Jum', volumeTon: 4.2, payoutJuta: 14.7, x: 383, y: 54 },
    { day: 'Sab', volumeTon: 4.8, payoutJuta: 16.9, x: 466, y: 36 },
    { day: 'Min', volumeTon: 1.5, payoutJuta: 5.2, x: 550, y: 135 },
  ],
  storageBreakdown: [
    { name: 'Kardus & Karton', ton: 8.2, capacityTon: 10.0, percent: 82, color: '#f59e0b' },
    { name: 'Botol Plastik PET', ton: 6.1, capacityTon: 8.0, percent: 76, color: '#10b981' },
    { name: 'Logam & Besi', ton: 2.8, capacityTon: 4.0, percent: 70, color: '#64748b' },
    { name: 'Minyak Jelantah', ton: 1.4, capacityTon: 3.0, percent: 46, color: '#6366f1' },
  ],
};

export function useRecyclerStats() {
  const [stats, setStats] = useState<RecyclerKPIs>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const applyData = useCallback((data: RecyclerKPIs) => {
    setStats({
      intakeThisMonthKg: Number(data.intakeThisMonthKg) || DEFAULT_STATS.intakeThisMonthKg,
      totalPayoutRp: Number(data.totalPayoutRp) || DEFAULT_STATS.totalPayoutRp,
      warehouseCapacityPercent: Number(data.warehouseCapacityPercent) || DEFAULT_STATS.warehouseCapacityPercent,
      totalStorageTon: Number(data.totalStorageTon) || DEFAULT_STATS.totalStorageTon,
      maxCapacityTon: Number(data.maxCapacityTon) || DEFAULT_STATS.maxCapacityTon,
      activeCitizensServed: Number(data.activeCitizensServed) || DEFAULT_STATS.activeCitizensServed,
      pendingDeliveriesCount: Number(data.pendingDeliveriesCount) || 0,
      satisfactionRating: Number(data.satisfactionRating) || DEFAULT_STATS.satisfactionRating,
      dailyTrend: Array.isArray(data.dailyTrend) && data.dailyTrend.length > 0 ? data.dailyTrend : DEFAULT_STATS.dailyTrend,
      storageBreakdown: Array.isArray(data.storageBreakdown) && data.storageBreakdown.length > 0 ? data.storageBreakdown : DEFAULT_STATS.storageBreakdown,
    });
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiClient<RecyclerKPIs>('/recyclers/dashboard/stats');
      if (data) {
        applyData(data);
      }
    } catch {
      // Pertahankan data default
    } finally {
      setIsLoading(false);
    }
  }, [applyData]);

  useEffect(() => {
    let isMounted = true;
    apiClient<RecyclerKPIs>('/recyclers/dashboard/stats')
      .then((data) => {
        if (!isMounted || !data) return;
        applyData(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    // Sinkronisasi otomatis saat ada aksi penimbangan atau jadwal setoran masuk baru dari warga
    const handleSync = () => {
      apiClient<RecyclerKPIs>('/recyclers/dashboard/stats')
        .then((data) => {
          if (!isMounted || !data) return;
          applyData(data);
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('recycler-incoming-changed', handleSync);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('recycler-incoming-changed', handleSync);
      }
    };
  }, [applyData]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats,
  };
}

