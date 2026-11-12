'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { ManagementType, VerificationStatus } from '@/types';

export interface AdminRecyclerRecord {
  id: string;
  name: string;
  managementType: ManagementType;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  contact: string;
  operatingHours?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  isDemo: boolean;
  ownerName: string;
  ownerEmail: string | null;
  materialsCount: number;
  createdAt: string;
  updatedAt: string;
}

export function useAdminVerifications(defaultStatusFilter: 'all' | VerificationStatus = 'all') {
  const [items, setItems] = useState<AdminRecyclerRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>(defaultStatusFilter);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchRecyclers = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await apiClient<AdminRecyclerRecord[]>('/admin/recyclers');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar mitra pengelola.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiClient<AdminRecyclerRecord[]>('/admin/recyclers')
      .then((data) => {
        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar mitra pengelola.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const handleSync = () => {
      apiClient<AdminRecyclerRecord[]>('/admin/recyclers')
        .then((data) => {
          if (isMounted && Array.isArray(data)) setItems(data);
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

  const notifyAdminChanged = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin-data-changed'));
    }
  };

  const verifyRecycler = async (id: string, status: 'verified' | 'rejected') => {
    setProcessingId(id);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const updated = await apiClient<AdminRecyclerRecord>(`/admin/recyclers/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSuccessMessage(
        status === 'verified'
          ? `Mitra "${updated.name}" telah diverifikasi dan diaktifkan.`
          : `Pengajuan mitra "${updated.name}" telah ditolak.`,
      );
      notifyAdminChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui status verifikasi.');
    } finally {
      setProcessingId(null);
    }
  };

  const approve = (id: string) => verifyRecycler(id, 'verified');
  const reject = (id: string) => verifyRecycler(id, 'rejected');

  const toggleActive = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setProcessingId(id);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const updated = await apiClient<AdminRecyclerRecord>(`/admin/recyclers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !target.isActive }),
      });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSuccessMessage(
        `Status operasional "${updated.name}" diubah menjadi ${updated.isActive ? 'Aktif' : 'Nonaktif'}.`,
      );
      notifyAdminChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui status aktif mitra.');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleDemo = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setProcessingId(id);
    setActionError(null);
    setSuccessMessage(null);

    try {
      const updated = await apiClient<AdminRecyclerRecord>(`/admin/recyclers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isDemo: !target.isDemo }),
      });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setSuccessMessage(
        `Label "${updated.name}" diubah menjadi ${updated.isDemo ? 'Data Demo / Simulasi' : 'Mitra Terdaftar'}.`,
      );
      notifyAdminChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui status demo mitra.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.verificationStatus === statusFilter;
    const matchesType = filterType === 'all' || item.managementType === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.ownerName.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.contact.toLowerCase().includes(q);
    return matchesStatus && matchesType && matchesSearch;
  });

  const pendingItems = items.filter((i) => i.verificationStatus === 'pending');

  return {
    items: filteredItems,
    allItems: items,
    pendingItems,
    pendingCount: pendingItems.length,
    statusFilter,
    setStatusFilter,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    processingId,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
    approve,
    reject,
    toggleActive,
    toggleDemo,
    refresh: fetchRecyclers,
  };
}
