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
  intakeThisMonthKg: 0,
  totalPayoutRp: 0,
  warehouseCapacityPercent: 0,
  totalStorageTon: 0,
  maxCapacityTon: 25.0,
  activeCitizensServed: 0,
  pendingDeliveriesCount: 0,
  satisfactionRating: 4.9,
  dailyTrend: [
    { day: 'Sen', volumeTon: 0, payoutJuta: 0, x: 50, y: 180 },
    { day: 'Sel', volumeTon: 0, payoutJuta: 0, x: 133, y: 180 },
    { day: 'Rab', volumeTon: 0, payoutJuta: 0, x: 216, y: 180 },
    { day: 'Kam', volumeTon: 0, payoutJuta: 0, x: 300, y: 180 },
    { day: 'Jum', volumeTon: 0, payoutJuta: 0, x: 383, y: 180 },
    { day: 'Sab', volumeTon: 0, payoutJuta: 0, x: 466, y: 180 },
    { day: 'Min', volumeTon: 0, payoutJuta: 0, x: 550, y: 180 },
  ],
  storageBreakdown: [
    { name: 'Kardus & Karton', ton: 0, capacityTon: 10.0, percent: 0, color: '#f59e0b' },
    { name: 'Botol Plastik PET', ton: 0, capacityTon: 8.0, percent: 0, color: '#10b981' },
    { name: 'Logam & Besi', ton: 0, capacityTon: 4.0, percent: 0, color: '#64748b' },
    { name: 'Minyak Jelantah', ton: 0, capacityTon: 3.0, percent: 0, color: '#6366f1' },
  ],
};

export function useRecyclerStats() {
  const [stats, setStats] = useState<RecyclerKPIs>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const applyData = useCallback((data: RecyclerKPIs) => {
    setStats({
      intakeThisMonthKg: data.intakeThisMonthKg !== undefined ? Number(data.intakeThisMonthKg) : 0,
      totalPayoutRp: data.totalPayoutRp !== undefined ? Number(data.totalPayoutRp) : 0,
      warehouseCapacityPercent: data.warehouseCapacityPercent !== undefined ? Number(data.warehouseCapacityPercent) : 0,
      totalStorageTon: data.totalStorageTon !== undefined ? Number(data.totalStorageTon) : 0,
      maxCapacityTon: data.maxCapacityTon !== undefined ? Number(data.maxCapacityTon) : 25.0,
      activeCitizensServed: data.activeCitizensServed !== undefined ? Number(data.activeCitizensServed) : 0,
      pendingDeliveriesCount: data.pendingDeliveriesCount !== undefined ? Number(data.pendingDeliveriesCount) : 0,
      satisfactionRating: data.satisfactionRating !== undefined ? Number(data.satisfactionRating) : 4.9,
      dailyTrend: Array.isArray(data.dailyTrend) ? data.dailyTrend : DEFAULT_STATS.dailyTrend,
      storageBreakdown: Array.isArray(data.storageBreakdown) ? data.storageBreakdown : DEFAULT_STATS.storageBreakdown,
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

