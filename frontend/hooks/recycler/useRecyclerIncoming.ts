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

const FALLBACK_INCOMING: IncomingDelivery[] = [
  {
    id: 'RCV-8821',
    citizenName: 'Santi Damayanti',
    citizenPhone: '+62 821-9988-7766',
    materials: [
      { name: 'Kardus / Karton Cokelat', estimatedQty: 10, unit: 'kg', pricePerUnit: 2200 },
      { name: 'Botol Plastik PET Bening', estimatedQty: 5, unit: 'kg', pricePerUnit: 4200 },
    ],
    totalEstimatedWeight: '15.0 kg',
    estimatedPayoutRp: 43000,
    arrivalTime: '10:30 WIB Hari Ini',
    status: 'antre',
    notes: 'Kering, sudah diikat per ikat 5 kg.',
  },
  {
    id: 'RCV-8822',
    citizenName: 'Rian Hidayat',
    citizenPhone: '+62 813-2211-4455',
    materials: [
      { name: 'Minyak Jelantah', estimatedQty: 6, unit: 'liter', pricePerUnit: 6500 },
    ],
    totalEstimatedWeight: '6.0 L',
    estimatedPayoutRp: 39000,
    arrivalTime: '11:15 WIB Hari Ini',
    status: 'antre',
    notes: 'Disaring dalam 2 jeriken 3L bersih.',
  },
  {
    id: 'RCV-8823',
    citizenName: 'Bank Sampah RW 04 Dago',
    citizenPhone: '+62 856-7788-9900',
    materials: [
      { name: 'Kardus / Karton Cokelat', estimatedQty: 80, unit: 'kg', pricePerUnit: 2200 },
      { name: 'Botol Plastik PET Bening', estimatedQty: 45, unit: 'kg', pricePerUnit: 4200 },
    ],
    totalEstimatedWeight: '125.0 kg',
    estimatedPayoutRp: 365000,
    arrivalTime: '13:00 WIB Hari Ini',
    status: 'antre',
    notes: 'Pengiriman via mobil pick-up rutin.',
  },
];

export function useRecyclerIncoming(initialData = FALLBACK_INCOMING) {
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
