'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface IncomingDelivery {
  id: string;
  internalId?: string;
  citizenName: string;
  citizenPhone: string;
  materials: { name: string; estimatedQty: number; unit: string; pricePerUnit: number }[];
  totalEstimatedWeight: string;
  estimatedPayoutRp: number;
  actualWeight?: number | null;
  actualPayoutRp?: number | null;
  arrivalTime: string;
  status: 'antre' | 'timbang' | 'selesai' | 'batal';
  notes?: string;
  createdAt?: string;
}

export function useRecyclerIncoming(initialData: IncomingDelivery[] = []) {
  const [deliveries, setDeliveries] = useState<IncomingDelivery[]>(initialData);
  const [filterStatus, setFilterStatus] = useState<'all' | 'antre' | 'selesai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async () => {
    try {
      const data = await apiClient<IncomingDelivery[]>('/recyclers/incoming');
      if (Array.isArray(data)) {
        setDeliveries(data);
      }
    } catch {
      // Fallback tetap menggunakan data yang sudah ada
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiClient<IncomingDelivery[]>('/recyclers/incoming')
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setDeliveries(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    // Sinkronisasi lintas komponen (misal saat transaksi diubah di halaman antrean, badge sidebar ikut berubah)
    const handleSync = () => {
      apiClient<IncomingDelivery[]>('/recyclers/incoming')
        .then((data) => {
          if (!isMounted) return;
          if (Array.isArray(data)) {
            setDeliveries(data);
          }
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
  }, []);

  const confirmWeighing = async (
    id: string,
    actualWeight?: number,
    actualPayoutRp?: number,
    notes?: string
  ) => {
    const target = deliveries.find((d) => d.id === id);
    const targetName = target?.citizenName || 'Warga';

    // Optimistic update
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'selesai',
              actualWeight: actualWeight ?? d.actualWeight,
              actualPayoutRp: actualPayoutRp ?? d.actualPayoutRp,
              notes: notes ?? d.notes,
            }
          : d
      )
    );
    setActionError(null);
    setSuccessMessage(null);

    try {
      await apiClient(`/recyclers/incoming/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'selesai',
          actualWeight,
          actualPayoutRp,
          notes,
        }),
      });
      setSuccessMessage(`Penimbangan transaksi ${id} untuk ${targetName} berhasil diselesaikan.`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-incoming-changed'));
      }
    } catch (err) {
      fetchDeliveries();
      setActionError(err instanceof Error ? err.message : 'Gagal mengonfirmasi penimbangan.');
    }
  };

  const cancelDelivery = async (id: string, reason?: string) => {
    const target = deliveries.find((d) => d.id === id);
    const targetName = target?.citizenName || 'Warga';

    // Optimistic update
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'batal' } : d))
    );
    setActionError(null);
    setSuccessMessage(null);

    try {
      await apiClient(`/recyclers/incoming/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'batal',
          notes: reason,
        }),
      });
      setSuccessMessage(`Setoran ${id} dari ${targetName} telah dibatalkan.`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-incoming-changed'));
      }
    } catch (err) {
      fetchDeliveries();
      setActionError(err instanceof Error ? err.message : 'Gagal membatalkan jadwal setoran.');
    }
  };

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'antre' ? d.status === 'antre' || d.status === 'timbang' : d.status === 'selesai');
    const matchesSearch =
      d.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = deliveries.filter(
    (d) => d.status === 'antre' || d.status === 'timbang'
  ).length;

  const completedCount = deliveries.filter(
    (d) => d.status === 'selesai'
  ).length;

  return {
    deliveries: filteredDeliveries,
    allDeliveries: deliveries,
    pendingCount,
    completedCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
    confirmWeighing,
    cancelDelivery,
    refreshDeliveries: fetchDeliveries,
  };
}
