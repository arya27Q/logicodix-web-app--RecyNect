'use client';

import { useState } from 'react';

export interface IncomingDelivery {
  id: string;
  citizenName: string;
  citizenPhone: string;
  materials: { name: string; estimatedQty: number; unit: string; pricePerUnit: number }[];
  totalEstimatedWeight: string;
  estimatedPayoutRp: number;
  arrivalTime: string;
  status: 'antre' | 'timbang' | 'selesai' | 'batal';
  notes?: string;
}

const DEFAULT_INCOMING: IncomingDelivery[] = [
  {
    id: 'RCV-8821',
    citizenName: 'Santi Damayanti',
    citizenPhone: '+62 821-9988-7766',
    materials: [
      { name: 'Kardus / Karton Box', estimatedQty: 10, unit: 'kg', pricePerUnit: 2200 },
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
      { name: 'Kardus / Karton Box', estimatedQty: 80, unit: 'kg', pricePerUnit: 2200 },
      { name: 'Botol Plastik PET Bening', estimatedQty: 45, unit: 'kg', pricePerUnit: 4200 },
    ],
    totalEstimatedWeight: '125.0 kg',
    estimatedPayoutRp: 365000,
    arrivalTime: '13:00 WIB Hari Ini',
    status: 'antre',
    notes: 'Pengiriman via mobil pick-up rutin.',
  },
  {
    id: 'RCV-8820',
    citizenName: 'Agus Pramono',
    citizenPhone: '+62 878-1122-3344',
    materials: [
      { name: 'Kaleng Aluminium', estimatedQty: 8, unit: 'kg', pricePerUnit: 14000 },
    ],
    totalEstimatedWeight: '8.0 kg',
    estimatedPayoutRp: 112000,
    arrivalTime: '09:10 WIB Hari Ini',
    status: 'selesai',
    notes: 'Selesai ditimbang. Payout tunai berhasil.',
  },
];

export function useRecyclerIncoming(initialData = DEFAULT_INCOMING) {
  const [deliveries, setDeliveries] = useState<IncomingDelivery[]>(initialData);
  const [filterStatus, setFilterStatus] = useState<'all' | 'antre' | 'selesai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const confirmWeighing = (id: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'selesai' } : d))
    );
  };

  const cancelDelivery = (id: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'batal' } : d))
    );
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

  return {
    deliveries: filteredDeliveries,
    allDeliveries: deliveries,
    pendingCount,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    confirmWeighing,
    cancelDelivery,
  };
}
