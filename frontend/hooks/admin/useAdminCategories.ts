'use client';

import { useState } from 'react';
import { WasteCategory } from '@/types';

export interface AdminCategoryItem extends WasteCategory {
  description?: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  totalRecyclers: number;
  updatedAt: string;
}

const INITIAL_CATEGORIES: AdminCategoryItem[] = [
  {
    id: 'cat-kardus',
    name: 'Kardus / Karton Cokelat',
    unit: 'kg',
    isActive: true,
    description: 'Kardus bekas packing, karton bergelombang bersih tanpa staples kawat tebal.',
    minPrice: 1600,
    maxPrice: 2400,
    averagePrice: 2050,
    totalRecyclers: 18,
    updatedAt: '2026-11-08',
  },
  {
    id: 'cat-pet',
    name: 'Botol Plastik PET Bening',
    unit: 'kg',
    isActive: true,
    description: 'Botol plastik minuman transparan/bening, bersih tanpa label & tutup botol.',
    minPrice: 3800,
    maxPrice: 4800,
    averagePrice: 4300,
    totalRecyclers: 22,
    updatedAt: '2026-11-09',
  },
  {
    id: 'cat-minyak',
    name: 'Minyak Jelantah',
    unit: 'liter',
    isActive: true,
    description: 'Minyak goreng bekas pakai, telah disaring bebas sisa makanan gosong.',
    minPrice: 6000,
    maxPrice: 7500,
    averagePrice: 6700,
    totalRecyclers: 9,
    updatedAt: '2026-11-07',
  },
  {
    id: 'cat-alum',
    name: 'Kaleng Aluminium / Soft Drink',
    unit: 'kg',
    isActive: true,
    description: 'Kaleng minuman aluminium tipis, dipipihkan agar hemat volume penyimpanan.',
    minPrice: 12000,
    maxPrice: 15500,
    averagePrice: 13800,
    totalRecyclers: 14,
    updatedAt: '2026-11-09',
  },
  {
    id: 'cat-hvs',
    name: 'Kertas HVS / Buku Dokumen',
    unit: 'kg',
    isActive: true,
    description: 'Kertas dokumen putih bersih, arsip kantor, majalah tanpa laminasi plastik.',
    minPrice: 1800,
    maxPrice: 2600,
    averagePrice: 2200,
    totalRecyclers: 16,
    updatedAt: '2026-11-06',
  },
  {
    id: 'cat-besi',
    name: 'Besi Tua / Logam Campur',
    unit: 'kg',
    isActive: true,
    description: 'Potongan besi konstruksi, plat besi tua, pipa dan logam scrap padat.',
    minPrice: 4500,
    maxPrice: 6200,
    averagePrice: 5300,
    totalRecyclers: 11,
    updatedAt: '2026-11-08',
  },
];

export function useAdminCategories(initialData = INITIAL_CATEGORIES) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);

  // Toggle active status
  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Save (Create or Update)
  const saveCategory = (catData: Partial<AdminCategoryItem>) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? ({
                ...c,
                ...catData,
                updatedAt: new Date().toISOString().split('T')[0],
              } as AdminCategoryItem)
            : c
        )
      );
    } else {
      const newCat: AdminCategoryItem = {
        id: `cat-${Date.now().toString().slice(-6)}`,
        name: catData.name || 'Kategori Baru',
        unit: catData.unit || 'kg',
        isActive: true,
        description: catData.description || '',
        minPrice: catData.minPrice || 1000,
        maxPrice: catData.maxPrice || 5000,
        averagePrice: Math.round(((catData.minPrice || 1000) + (catData.maxPrice || 5000)) / 2),
        totalRecyclers: 0,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Open modal for edit
  const openEdit = (cat: AdminCategoryItem) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  // Open modal for create
  const openCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Delete / Archive
  const deleteCategory = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori master ini dari sistem?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Filtered view
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unit.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterActive === 'active') return matchesSearch && c.isActive;
    if (filterActive === 'inactive') return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  return {
    categories: filteredCategories,
    allCategories: categories,
    activeCount: categories.filter((c) => c.isActive).length,
    totalCount: categories.length,
    searchQuery,
    setSearchQuery,
    filterActive,
    setFilterActive,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    openEdit,
    openCreate,
    saveCategory,
    deleteCategory,
    toggleActive,
  };
}
