'use client';

import { useState } from 'react';

export interface RecyclerMaterial {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  minQuantity: number;
  qualityRequirements: string;
  isAccepting: boolean;
}

const DEFAULT_MATERIALS: RecyclerMaterial[] = [
  {
    id: 'mat-1',
    name: 'Kardus / Karton Box',
    category: 'Kertas & Karton',
    pricePerUnit: 2200,
    unit: 'kg',
    minQuantity: 10,
    qualityRequirements: 'Kering, bersih dari staples tebal, diikat rapi',
    isAccepting: true,
  },
  {
    id: 'mat-2',
    name: 'Botol Plastik PET Bening',
    category: 'Plastik',
    pricePerUnit: 4200,
    unit: 'kg',
    minQuantity: 5,
    qualityRequirements: 'Bersih, tanpa kotoran tanah, tutup botol dilepas',
    isAccepting: true,
  },
  {
    id: 'mat-3',
    name: 'Minyak Jelantah Rumahan',
    category: 'Minyak & Organik',
    pricePerUnit: 6500,
    unit: 'liter',
    minQuantity: 2,
    qualityRequirements: 'Disaring dari sisa remah makanan, jeriken tertutup rapat',
    isAccepting: true,
  },
  {
    id: 'mat-4',
    name: 'Kaleng Aluminium Soft Drink',
    category: 'Logam',
    pricePerUnit: 14000,
    unit: 'kg',
    minQuantity: 3,
    qualityRequirements: 'Dipipihkan, bebas dari sisa cairan manis',
    isAccepting: false,
  },
];

export function useRecyclerMaterials(initialData = DEFAULT_MATERIALS) {
  const [materials, setMaterials] = useState<RecyclerMaterial[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleAccepting = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAccepting: !m.isAccepting } : m))
    );
  };

  const updatePrice = (id: string, newPrice: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pricePerUnit: newPrice } : m))
    );
  };

  const updateMinQuantity = (id: string, minQty: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, minQuantity: minQty } : m))
    );
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = materials.filter((m) => m.isAccepting).length;

  return {
    materials: filteredMaterials,
    allMaterials: materials,
    activeCount,
    totalCount: materials.length,
    searchQuery,
    setSearchQuery,
    isSaving,
    setIsSaving,
    toggleAccepting,
    updatePrice,
    updateMinQuantity,
  };
}

