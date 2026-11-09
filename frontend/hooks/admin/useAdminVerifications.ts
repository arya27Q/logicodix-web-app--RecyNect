'use client';

import { useState } from 'react';

export interface PendingVerification {
  id: string;
  businessName: string;
  businessType: 'pabrik' | 'bank_sampah' | 'pengepul' | 'lapak';
  ownerName: string;
  regNumber: string;
  address: string;
  city: string;
  submissionDate: string;
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DEFAULT_VERIFICATIONS: PendingVerification[] = [
  {
    id: 'ver-101',
    businessName: 'PT Hijau Daur Perkasa',
    businessType: 'pabrik',
    ownerName: 'Hendra Saputra',
    regNumber: 'NIB-8823109281',
    address: 'Kawasan Industri Cimareme No. 42',
    city: 'Bandung Barat',
    submissionDate: '2026-11-08',
    status: 'pending',
  },
  {
    id: 'ver-102',
    businessName: 'Bank Sampah Mandiri Sukamaju',
    businessType: 'bank_sampah',
    ownerName: 'Siti Aminah',
    regNumber: 'SK-RW-05/2025',
    address: 'Jl. Sukamaju No. 12, RT 03/05',
    city: 'Bandung',
    submissionDate: '2026-11-09',
    status: 'pending',
  },
  {
    id: 'ver-103',
    businessName: 'UD Logam Berkah Jaya',
    businessType: 'pengepul',
    ownerName: 'Bambang Irawan',
    regNumber: 'NIB-9102837122',
    address: 'Jl. Soekarno Hatta No. 802',
    city: 'Bandung',
    submissionDate: '2026-11-07',
    status: 'pending',
  },
];

export function useAdminVerifications(initialData = DEFAULT_VERIFICATIONS) {
  const [items, setItems] = useState<PendingVerification[]>(initialData);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const approve = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const reject = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.businessType === filterType;
  });

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return {
    items: filteredItems,
    allItems: items,
    pendingCount,
    filterType,
    setFilterType,
    selectedId,
    setSelectedId,
    approve,
    reject,
  };
}

